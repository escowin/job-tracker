const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const jobApplicationSchema = new Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
      trim: true,
    },
    dateSubmitted: {
      // type: Date,
      type: String,
      required: true,
      // default: Date.now,
      // get: (timestamp) => dateFormat(timestamp)
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const JobApplication = model("Application", jobApplicationSchema);

module.exports = JobApplication;
