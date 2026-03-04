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
      ],
    },

    type: {
      type: String,
      required: true,
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
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
    },

    description: {
      type: String,
      trim: true,
    },

    isSystem: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);
exerciseSchema.index({ name: "text" });
exerciseSchema.index({ muscleGroup: 1 });

module.exports = mongoose.model("Exercise", exerciseSchema);
