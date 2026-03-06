const mongoose = require("mongoose");

const userExerciseStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },

    bestWeight: {
      type: Number,
      default: 0,
    },

    bestReps: {
      type: Number,
      default: 0,
    },

    estimated1RM: {
      type: Number,
      default: 0,
    },

    lastWeight: Number,
    lastReps: Number,

    totalVolume: {
      type: Number,
      default: 0,
    },

    totalSets: {
      type: Number,
      default: 0,
    },
    failureCount: {
      type: Number,
      default: 0,
    },

    repRangeShifted: {
      type: Boolean,
      default: false,
    },
    failureCount: {
      type: Number,
      default: 0,
    },
    volumeScore: {
      type: Number,
      default: 0,
    },

    repRangeShifted: {
      type: Boolean,
      default: false,
    },

    lastSession: Date,
  },
  { timestamps: true },
);

userExerciseStatsSchema.index({ user: 1, exercise: 1 }, { unique: true });

module.exports = mongoose.model("UserExerciseStats", userExerciseStatsSchema);
