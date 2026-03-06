const UserXP = require("../../models/userXP.model");

exports.getXP = async (req, res) => {
  const xp = await UserXP.findOne({
    user: req.user.id,
  });

  res.json({
    success: true,
    data: xp || {
      totalXP: 0,
      level: 1,
    },
  });
};
