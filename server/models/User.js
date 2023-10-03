const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const { format } = require("../utils/helpers");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
    },
    jobs: [
      {
        type: Schema.Types.ObjectId,
        ref: "Job",
      },
    ],
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
const virtuals = ["pending", "rejected", "hired", "waitlisted", "no-response", "interviewing"];
virtuals.forEach((virtual) => {
  UserSchema.virtual(`${format.camel(virtual)}Count`).get(function () {
    const result = this.jobs.filter((job) => job.status === virtual);
    return result.length;
  });
});

// gets the total numer of job submissions
UserSchema.virtual("totalSubmitted").get(function () {
  return this.jobs.length;
});

UserSchema.virtual("rate").get(function () {
  const hiredCount = this.hiredCount;
  const totalCount = this.totalSubmitted;
  const result = (hiredCount / totalCount) * 100;
  const rounded = Math.round(result * 100) / 100;
  return `${rounded}%`;
});

UserSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", UserSchema);

module.exports = User;
