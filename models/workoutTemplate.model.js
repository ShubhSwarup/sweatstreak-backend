const mongoose = require("mongoose");

const templateExerciseSchema = new mongoose.Schema(
  {
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },

    sets: {
      type: Number,
      required: true,
      min: 1,
    },

    repRange: {
      min: Number,
      max: Number,
    },

    restSeconds: {
      type: Number,
      default: 90,
    },

    supersetGroup: Number,

    notes: String,
  },
  { _id: false },
);

const workoutTemplateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
    },

    exercises: [templateExerciseSchema],
  },

  { timestamps: true },
);
workoutTemplateSchema.index({ user: 1 });
workoutTemplateSchema.index({ name: "text" });

module.exports = mongoose.model("WorkoutTemplate", workoutTemplateSchema);
