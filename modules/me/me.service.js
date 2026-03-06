const UserXP = require("../../models/userXP.model");
const UserStreak = require("../../models/userStreak.model");
const WorkoutSession = require("../../models/workoutSession.model");

exports.getOverview = async (userId) => {
  const [xp, streak, lastWorkout, weeklySessions] = await Promise.all([
    UserXP.findOne({ user: userId }),

    UserStreak.findOne({ user: userId }),

    WorkoutSession.findOne({
      user: userId,
      completed: true,
    })
      .sort({ endedAt: -1 })
      .select("endedAt durationSeconds sessionSummary"),

    WorkoutSession.find({
      user: userId,
      completed: true,
      endedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }).select("sessionSummary"),
  ]);

  let weeklyVolume = 0;

  for (const s of weeklySessions) {
    weeklyVolume += s.sessionSummary?.totalVolume || 0;
  }

  return {
    xp: xp?.totalXP || 0,

    level: xp?.level || 1,

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
  };
};
