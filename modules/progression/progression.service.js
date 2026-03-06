const UserExerciseStats = require("../../models/userExerciseStats.model");
const Exercise = require("../../models/exercise.model");

exports.getProgressionSuggestion = async (userId, exerciseId) => {
  const exercise = await Exercise.findById(exerciseId).select(
    "type progressionStep",
  );

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
      action: "start",
    };
  }

  if (stats.repRangeShifted) {
    minRep += 2;
    maxRep += 2;
  }

  const lastWeight = stats.lastWeight || 0;
  const lastReps = stats.lastReps || 0;
  const bestReps = stats.bestReps || 0;

  const step = exercise.progressionStep || 2.5;
  const volumeScore = lastWeight * lastReps;
  const previousVolume = stats.volumeScore || 0;
  let nextWeight = lastWeight;
  let action = "hold";

  // ---------- FAILURE TRACKING ----------

  if (lastReps < minRep) {
    stats.failureCount = (stats.failureCount || 0) + 1;
  } else {
    stats.failureCount = 0;
  }

  // ---------- PLATEAU DETECTION ----------

  if (stats.failureCount >= 3 && !stats.repRangeShifted) {
    stats.repRangeShifted = true;

    minRep += 2;
    maxRep += 2;

    action = "shift";
  }

  // ---------- REGRESSION ----------

  if (lastReps < minRep) {
    if (volumeScore < previousVolume) {
      nextWeight = Math.max(lastWeight - step, step);

      action = "decrease";
    } else {
      action = "hold";
    }
  }

  // ---------- PROGRESSION ----------

  if (lastReps >= maxRep && bestReps >= maxRep) {
    nextWeight = lastWeight + step;

    action = "increase";

    stats.failureCount = 0;
    stats.repRangeShifted = false;
  }

  await stats.save();

  return {
    lastWeight,
    lastReps,
    nextWeight,
    action,
    repRange: `${minRep}-${maxRep}`,
  };
};

exports.calculateSuggestionFromStats = (stats, exercise) => {
  const step = exercise.progressionStep || 2.5;

  let nextWeight = stats.lastWeight;
  let action = "hold";

  if (stats.lastReps >= stats.bestReps) {
    nextWeight += step;
    action = "increase";
  }

  return {
    nextWeight,
    action,
  };
};
