const { Schema, model } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const NoteSchema = new Schema(
  {
    noteId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    noteBody: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
  },
  {
    toJson: { getters: true },
    id: false,
  }
);

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
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
    notes: [NoteSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const JobApplication = model("Application", jobApplicationSchema);

module.exports = JobApplication;
