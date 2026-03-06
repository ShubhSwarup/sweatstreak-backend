const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    muscleGroup: {
      type: String,
      required: true,
      enum: [
        "chest",
        "back",
        "shoulders",
        "legs",
        "biceps",
        "triceps",
        "core",
        "glutes",
        "calves",
        "cardio",
      ],
    },
    primaryMuscles: {
      type: [String],
      required: true,
      enum: [
        "chest",
        "back",
        "shoulders",
        "legs",
        "biceps",
        "triceps",
        "core",
        "glutes",
        "calves",
        "cardio",
      ],
    },

    secondaryMuscles: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ["compound", "isolation"],
    },

    equipment: {
      type: String,
      enum: [
        "barbell",
        "dumbbell",
        "machine",
        "cable",
        "bodyweight",
        "kettlebell",
        "other",
      ],
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    defaultRepRange: {
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
    },
    exerciseType: {
      type: String,
      enum: ["strength", "cardio"],
      default: "strength",
    },

    trackingType: {
      type: String,
      enum: ["reps", "time", "distance"],
      default: "reps",
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    isSystem: {
      type: Boolean,
      default: true,
    },
    progressionStep: {
      type: Number,
      default: 2.5,
    },
  },
  { timestamps: true },
);
exerciseSchema.index({ muscleGroup: 1 });
exerciseSchema.index({ primaryMuscles: 1 });
exerciseSchema.index({ exerciseType: 1 });
module.exports = mongoose.model("Exercise", exerciseSchema);
