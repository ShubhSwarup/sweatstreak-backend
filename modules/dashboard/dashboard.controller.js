const service = require("./dashboard.service");

exports.getDashboard = async (req, res) => {
  try {
    const data = await service.getDashboard(req.user.id);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
