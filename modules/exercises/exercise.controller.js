const exerciseService = require("./exercise.service");

exports.getExercises = async (req, res) => {
  try {
    const { muscleGroup, search, page = 1, limit = 20 } = req.query;

    const exercises = await exerciseService.getExercises({
      muscleGroup,
      search,
      page: Number(page),
      limit: Number(limit),
    });

    res.json(exercises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getExercise = async (req, res) => {
  try {
    const exercise = await exerciseService.getExerciseById(req.params.id);

    if (!exercise) {
      return res.status(404).json({ message: "Exercise not found" });
    }

    res.json(exercise);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
