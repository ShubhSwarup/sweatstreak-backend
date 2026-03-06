const mongoose = require("mongoose");

const userStreakSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    currentStreak: {
      type: Number,
      default: 0,
    },

    longestStreak: {
      type: Number,
      default: 0,
    },

    lastWorkoutDate: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("UserStreak", userStreakSchema);
