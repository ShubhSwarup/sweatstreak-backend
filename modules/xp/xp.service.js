const UserXP = require("../../models/userXP.model");

function calculateLevel(totalXP) {
  return Math.floor(Math.sqrt(totalXP / 50)) + 1;
}

exports.addWorkoutXP = async (userId, session, streakIncreased = false) => {
  let xp = 10; // workout bonus

  let sets = 0;

  for (const ex of session.exercises) {
    sets += ex.sets.length;
  }

  xp += sets;

  if (streakIncreased) {
    xp += 5;
  }

  const userXP = await UserXP.findOneAndUpdate(
    { user: userId },
    { $inc: { totalXP: xp } },
    { upsert: true, new: true },
  );

  userXP.level = calculateLevel(userXP.totalXP);
  userXP.lastUpdated = new Date();

  await userXP.save();

  return userXP;
};
