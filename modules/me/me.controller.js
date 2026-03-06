const service = require("./me.service");

exports.getOverview = async (req, res) => {
  const data = await service.getOverview(req.user.id);

  res.json({
    success: true,
    data,
  });
};
