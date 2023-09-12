const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

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

// virtual | used to get the total numer of job  submissions
UserSchema.virtual("totalSubmitted").get(function () {
  return this.jobs.length;
});

// uses .filter() to return the specified totals
// pending count
UserSchema.virtual("pendingCount").get(function () {
  const result = this.jobs.filter(
    (job) => job.status === "pending"
  );
  return result.length;
});

// rejected count
UserSchema.virtual("rejectedCount").get(function () {
  const result = this.jobs.filter(
    (job) => job.status === "rejected"
  );
  return result.length;
});

// hired count
UserSchema.virtual("hiredCount").get(function () {
  const result = this.jobs.filter(
    (job) => job.status === "hired"
  );
  return result.length;
});

// waitlisted count
UserSchema.virtual("waitlistedCount").get(function () {
  const result = this.jobs.filter(
    (job) => job.status === "waitlisted"
  );
  return result.length;
});

UserSchema.virtual("rate").get(function() {
  const hiredCount = this.hiredCount;
  const totalCount = this.totalSubmitted;
  const result = (hiredCount / totalCount) * 100;
  const rounded = Math.round(result * 100) / 100;
  return `${rounded}%`
})

UserSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", UserSchema);

module.exports = User;
