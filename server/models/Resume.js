const { Schema, model } = require("mongoose");

const ResumeSchema = new Schema(
  {
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
    toJSON: {
      virtuals: true,
    },
  }
);

const Resume = model("Resume", ResumeSchema);

module.exports = Resume;
