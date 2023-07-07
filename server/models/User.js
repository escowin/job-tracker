const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
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
    jobApplications: [
      {
        type: Schema.Types.ObjectId,
        ref: "Application",
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
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// virtual | used to get the total numer of job application submissions
userSchema.virtual("totalSubmitted").get(function () {
  return this.jobApplications.length;
});

// uses .filter() to return the specified totals
// pending count
userSchema.virtual("pendingCount").get(function () {
  const result = this.jobApplications.filter(
    (application) => application.status === "pending"
  );
  return result.length;
});

// rejected count
userSchema.virtual("rejectedCount").get(function () {
  const result = this.jobApplications.filter(
    (application) => application.status === "rejected"
  );
  return result.length;
});

// hired count
userSchema.virtual("hiredCount").get(function () {
  const result = this.jobApplications.filter(
    (application) => application.status === "hired"
  );
  return result.length;
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;
