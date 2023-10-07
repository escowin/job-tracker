const { Schema, model, Types } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const LinkSchema = new Schema({
  link: {
    type: String,
    required: true,
    maxLength: 50,
  },
  url: {
    type: String,
    required: true,
  },
});

const EducationSchema = new Schema({
  school: {
    type: String,
    required: true,
    maxLength: 80,
  },
  location: {
    type: String,
    required: false,
    maxLength: 80,
  },
});

const ExperienceSchema = new Schema({
  role: {
    type: String,
    required: true,
    maxLength: 80,
  },
  company: {
    type: String,
    required: true,
    maxLength: 80,
  },
  location: {
    type: String,
    required: false,
    maxLength: 80,
  },
  description: {
    type: String,
    required: false,
  },
});

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
    },
    //  tbd fields
    //   coverLetter: {
    //     type: String,
    //     trim: true,
    //   },
    links: [LinkSchema],
    education: [EducationSchema],
    experience: [ExperienceSchema]
  },
  {
    toJSON: { getters: true },
  }
);

const Resume = model("Resume", ResumeSchema);

module.exports = Resume;
