const progressionService = require("./progression.service");

exports.getSuggestion = async (req, res) => {
  try {
    const suggestion = await progressionService.getProgressionSuggestion(
      req.user.id,
      req.params.exerciseId,
    );

    res.json({
      success: true,
      data: suggestion,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
