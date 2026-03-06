const mongoose = require("mongoose");

const setSchema = new mongoose.Schema(
  {
    setNumber: Number,

    weight: Number,
    reps: Number,

    durationSeconds: Number,
    distance: Number,

    rpe: Number,

    isWarmup: {
      type: Boolean,
      default: false,
    },

    completed: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

const workoutExerciseSchema = new mongoose.Schema(
  {
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
    },

    order: Number,

    notes: String,

    sets: [setSchema],
    completed: {
      type: Boolean,
      default: false,
    },
    summary: {
      bestWeight: Number,
      bestReps: Number,
      volume: Number,
      setCount: Number,
    },
  },
  { _id: false },
);

const workoutSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutTemplate",
    },

    exercises: [workoutExerciseSchema],

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: Date,

    durationSeconds: Number,

    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

workoutSessionSchema.index({ user: 1, startedAt: -1 });

module.exports = mongoose.model("WorkoutSession", workoutSessionSchema);
