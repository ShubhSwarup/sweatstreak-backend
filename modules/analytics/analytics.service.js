const WorkoutSession = require("../../models/workoutSession.model");

exports.getWeeklyStats = async (userId) => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - 6);

  const sessions = await WorkoutSession.find({
    user: userId,
    completed: true,
    endedAt: { $gte: startDate },
  }).select("endedAt sessionSummary");

  const result = {};

  // initialize last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    const key = date.toISOString().slice(0, 10);

    result[key] = {
      volume: 0,
      workouts: 0,
    };
  }

  for (const session of sessions) {
    const key = session.endedAt.toISOString().slice(0, 10);

    if (!result[key]) continue;

    result[key].volume += session.sessionSummary?.totalVolume || 0;
    result[key].workouts += 1;
  }

  return result;
};
