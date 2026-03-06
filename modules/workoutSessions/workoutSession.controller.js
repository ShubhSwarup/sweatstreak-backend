const service = require("./workoutSession.service");

/**
 * Start workout
 */
exports.startSession = async (req, res) => {
  try {
    const session = await service.startSession(req.user.id, req.body);

    res.status(201).json({
      success: true,
      data: session,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Add exercise
 */
exports.addExercise = async (req, res) => {
  try {
    const session = await service.addExercise(
      req.user.id,
      req.params.id,
      req.body,
    );

    res.json({
      success: true,
      data: session,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Add set
 */
exports.addSet = async (req, res) => {
  try {
    const session = await service.addSet(
      req.user.id,
      req.params.id,
      req.body.exerciseIndex,
      req.body,
    );

    res.json({
      success: true,
      data: session,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Finish workout
 */
exports.finishSession = async (req, res) => {
  try {
    const session = await service.finishSession(req.user.id, req.params.id);

    res.json({
      success: true,
      data: session,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Get sessions
 */
exports.getSessions = async (req, res) => {
  try {
    const result = await service.getSessions(req.user.id, req.query);

    res.json({
      success: true,
      data: result.sessions,
      pagination: result.pagination,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/**
 * Get session detail
 */
exports.getSessionById = async (req, res) => {
  try {
    const session = await service.getSessionById(req.user.id, req.params.id);

    if (!session)
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });

    res.json({
      success: true,
      data: session,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
