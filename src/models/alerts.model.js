import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    OBJECTID: {
      type: Number,
      required: true,
      unique: true,
    },
    hwa: {
      type: {
        message: String,
        alert: {
          type: String,
          enum: ["NO THREAT", "WATCH", "ALERT", "WARNING"],
          default: "NO THREAT",
        },
        color: {
          type: String,
          enum: ["GREEN", "YELLOW", "ORANGE", "RED"],
          default: "GREEN",
        },
        issueDate: Date,
      },
    },

    ssa: {
      type: {
        message: String,
        alert: {
          type: String,
          enum: ["NO THREAT", "WATCH", "ALERT", "WARNING"],
          default: "NO THREAT",
        },
        color: {
          type: String,
          enum: ["GREEN", "YELLOW", "ORANGE", "RED"],
          default: "GREEN",
        },
        issueDate: Date,
      },
    },

    oceanCurrent: {
      type: {
        message: String,
        alert: {
          type: String,
          enum: ["NO THREAT", "WATCH", "ALERT", "WARNING"],
          default: "NO THREAT",
        },
        color: {
          type: String,
          enum: ["GREEN", "YELLOW", "ORANGE", "RED"],
          default: "GREEN",
        },
        issueDate: Date,
      },
    },
    tsunami: Boolean,
    stormSurge: Boolean,
  },

  { timestamps: true, _id: false }
);

export const Alert = mongoose.model("Alert", alertSchema);