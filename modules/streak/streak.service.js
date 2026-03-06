const UserStreak = require("../../models/userStreak.model");

exports.updateStreak = async (userId, workoutDate) => {
  const today = new Date(workoutDate);
  today.setHours(0, 0, 0, 0);

  let streak = await UserStreak.findOne({ user: userId });

  if (!streak) {
    return UserStreak.create({
      user: userId,
      currentStreak: 1,
      longestStreak: 1,
      lastWorkoutDate: today,
    });
  }

  let lastDate = null;

  if (streak.lastWorkoutDate) {
    lastDate = new Date(streak.lastWorkoutDate);
    lastDate.setHours(0, 0, 0, 0);
  }

  let diffDays = 1;

  if (lastDate) {
    diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
  }

  if (diffDays === 0) return streak;

  if (diffDays === 1) {
    streak.currentStreak += 1;
  }

  if (diffDays > 1) {
    streak.currentStreak = 1;
  }

  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }

  streak.lastWorkoutDate = today;

  await streak.save();

  return streak;
};
