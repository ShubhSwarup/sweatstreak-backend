const WorkoutSession = require("../../models/workoutSession.model");
const UserStreak = require("../../models/userStreak.model");
const Exercise = require("../../models/exercise.model");

exports.getDashboard = async (userId) => {
  // ---------- 1️⃣ STREAK ----------
  const streak = await UserStreak.findOne({ user: userId });

  // ---------- 2️⃣ LAST WORKOUT ----------
  const lastWorkout = await WorkoutSession.findOne({
    user: userId,
    completed: true,
  })
    .sort({ endedAt: -1 })
    .select("endedAt durationSeconds sessionSummary");

  // ---------- 3️⃣ WEEKLY WORKOUTS ----------
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const weeklySessions = await WorkoutSession.find({
    user: userId,
    completed: true,
    endedAt: { $gte: startOfWeek },
  }).select("exercises.exercise exercises.summary sessionSummary");

  let weeklyVolume = 0;

  const exerciseVolumeMap = {};

  for (const session of weeklySessions) {
    weeklyVolume += session.sessionSummary?.totalVolume || 0;

    for (const ex of session.exercises) {
      const exerciseId = ex.exercise.toString();

      if (!exerciseVolumeMap[exerciseId]) {
        exerciseVolumeMap[exerciseId] = 0;
      }

      exerciseVolumeMap[exerciseId] += ex.summary?.volume || 0;
    }
  }

  // ---------- 4️⃣ TOP EXERCISES ----------
  const sortedExercises = Object.entries(exerciseVolumeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const exerciseIds = sortedExercises.map(([id]) => id);

  const exerciseDocs = await Exercise.find({
    _id: { $in: exerciseIds },
  }).select("name");

  const exerciseNameMap = {};

  for (const ex of exerciseDocs) {
    exerciseNameMap[ex._id.toString()] = ex.name;
  }

  const topExercises = sortedExercises.map(([id, volume]) => ({
    exerciseId: id,
    name: exerciseNameMap[id] || "Unknown",
    volume,
  }));

  // ---------- RESPONSE ----------
  return {
    streak: {
      current: streak?.currentStreak || 0,
      longest: streak?.longestStreak || 0,
    },

    lastWorkout: lastWorkout
      ? {
          date: lastWorkout.endedAt,
          duration: lastWorkout.durationSeconds,
        }
      : null,

    weeklyVolume,

    topExercises,
  };
};
