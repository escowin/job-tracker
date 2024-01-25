const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxLength: 25
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 25
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      match: [/.+@.+\..+/, "provide a properly formatted email address"],
    },
    phone: {
      type: String,
      trim: true,
      min: 5,
      max: 24,
    },
    address: {
      type: String,
      trim: true,
      max: 100,
    },
    location: {
      type: String,
      trim: true,
      max: 50,
    },
    zip: {
      type: Number,
      trim: true,
      max: 10
    },
    currentCompany: {
      type: String,
      trim: true,
      max: 50,
    },
    jobs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
    resumes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Resume",
      },
    ],
    letters: [
      {
        type: Schema.Types.ObjectId,
        ref: "Letter"
      }
    ]
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// passwords strings are hashed before saving a user document
UserSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// specific virtual counts
const virtuals = [
  "pending",
  "rejected",
  "hired",
  "waitlisted",
  "noResponse",
  "interviewing",
];
virtuals.forEach((virtual) => {
  UserSchema.virtual(`${virtual}Count`).get(function () {
    const result = this.jobs.filter((job) => job.status === virtual);
    return result.length;
  });
});

// gets the total numer of job submissions
UserSchema.virtual("totalCount").get(function () {
  return this.jobs.length;
});

UserSchema.virtual("rate").get(function () {
  const hiredCount = this.hiredCount;
  const totalCount = this.totalCount;
  const result = (hiredCount / totalCount) * 100;
  const rounded = Math.round(result * 100) / 100;
  // conditionally returns rounded value
  return isNaN(rounded) ? `0%` : `${rounded}%`;
});

UserSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", UserSchema);

module.exports = User;
