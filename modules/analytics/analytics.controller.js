const service = require("./analytics.service");

exports.getWeeklyStats = async (req, res) => {
  try {
    const stats = await service.getWeeklyStats(req.user.id);

    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
