const UserExerciseStats = require("../../models/userExerciseStats.model");
const Exercise = require("../../models/exercise.model");

exports.getProgressionSuggestion = async (userId, exerciseId) => {
  const exercise = await Exercise.findById(exerciseId);

  if (!exercise) throw new Error("Exercise not found");

  const stats = await UserExerciseStats.findOne({
    user: userId,
    exercise: exerciseId,
  });

  let minRep;
  let maxRep;

  if (exercise.type === "compound") {
    minRep = 6;
    maxRep = 8;
  } else {
    minRep = 8;
    maxRep = 12;
  }

  if (!stats) {
    return {
      nextWeight: null,
      repRange: `${minRep}-${maxRep}`,
    };
  }

  const lastWeight = stats.lastWeight || 0;
  const lastReps = stats.lastReps || 0;
  const bestReps = stats.bestReps || 0;

  const step = exercise.progressionStep || 2.5;

  let nextWeight = lastWeight;
  let action = "hold";

  // ---------- PROGRESSION ----------
  if (lastReps >= maxRep && bestReps >= maxRep) {
    nextWeight = lastWeight + step;
    action = "increase";
  }

  // ---------- REGRESSION ----------
  if (lastReps < minRep) {
    nextWeight = Math.max(lastWeight * 0.9, step);
    action = "decrease";
  }

  return {
    lastWeight,
    lastReps,
    nextWeight,
    action,
    repRange: `${minRep}-${maxRep}`,
  };
};
