const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const ResumeSchema = new Schema(
  {
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    title: {
      type: String,
      required: true,
      trim: true,
      max: 25,
    }
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
