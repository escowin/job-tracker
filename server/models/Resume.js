const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const ResumeSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    // username: {
    //   type: String,
    //   required: true,
    // },
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
      match: [/.+@.+\..+/, "Must match an email address!"],
    },
    phone: {
      type: String,
      trim: true,
      min: 5,
      max: 24,
    },
    location: {
      type: String,
      trim: true,
      max: 50,
    },
    currentCompany: {
      type: String,
      trim: true,
      max: 50,
    },
    //  tbd fields
    //   coverLetter: {
    //     type: String,
    //     trim: true,
    //   },
    //   links: [LinkSchema],
    //   education: [EducationSchema],
    //   experience: [ExperienceSchema]
  },
  {
    toJSON: { getters: true },
  }
);

const Resume = model("Resume", ResumeSchema);

module.exports = Resume;
