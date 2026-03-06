const UserStreak = require("../../models/userStreak.model");

exports.getStreak = async (req, res) => {
  let streak = await UserStreak.findOne({
    user: req.user.id,
  });

  if (!streak) {
    streak = {
      currentStreak: 0,
      longestStreak: 0,
      lastWorkoutDate: null,
    };
  }

  res.json({
    success: true,
    data: streak,
  });
};
