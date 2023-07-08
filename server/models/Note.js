const { Schema } = require("mongoose");
const dateFormat = require("../utils/dateFormat");

const NoteSchema = new Schema(
  {
    note: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (timestamp) => dateFormat(timestamp),
    },
  },
  {
    toJSON: { getters: true },
  }
);

module.exports = NoteSchema;
