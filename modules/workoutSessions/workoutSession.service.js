const WorkoutSession = require("../../models/workoutSession.model");
const WorkoutTemplate = require("../../models/workoutTemplate.model");
const UserExerciseStats = require("../../models/userExerciseStats.model");
const streakService = require("../streak/streak.service");

async function getUserSession(sessionId, userId) {
  const session = await WorkoutSession.findOne({
    _id: sessionId,
    user: userId,
  });

  if (!session) throw new Error("Workout session not found");

  return session;
}

/**
 * Start workout session
 */

exports.startSession = async (userId, data) => {
  let exercises = [];

  if (data.template) {
    const template = await WorkoutTemplate.findOne({
      _id: data.template,
      $or: [{ user: userId }, { isSystem: true }],
    });

    if (!template) throw new Error("Template not found");

    for (let i = 0; i < template.exercises.length; i++) {
      const ex = template.exercises[i];

      const lastSession = await WorkoutSession.findOne({
        user: userId,
        completed: true,
        "exercises.exercise": ex.exercise,
      }).sort({ startedAt: -1 });

      let sets = [];

      if (lastSession) {
        const lastExercise = lastSession.exercises.find(
          (e) => e.exercise.toString() === ex.exercise.toString(),
        );

        if (lastExercise) {
          sets = lastExercise.sets.map((s, index) => ({
            setNumber: index + 1,
            weight: s.weight,
            reps: s.reps,
            durationSeconds: s.durationSeconds,
            distance: s.distance,
            rpe: s.rpe,
            completed: false,
          }));
        }
      }

      exercises.push({
        exercise: ex.exercise,
        order: i + 1,
        sets,
      });
    }
  }

  return WorkoutSession.create({
    user: userId,
    name: data.name,
    template: data.template || null,
    startedAt: new Date(),
    exercises,
  });
};

/**
 * Add exercise to session
 */
exports.addExercise = async (userId, sessionId, exerciseData) => {
  const session = await getUserSession(sessionId, userId);

  if (!session) throw new Error("Workout session not found");

  session.exercises.push({
    exercise: exerciseData.exercise,
    order: exerciseData.order,
    notes: exerciseData.notes || "",
    sets: [],
  });

  return session.save();
};

/**
 * Add set to exercise
 */

exports.addSet = async (userId, sessionId, exerciseIndex, setData) => {
  const session = await getUserSession(sessionId, userId);
  if (!session) throw new Error("Workout session not found");

  const exercise = session.exercises[exerciseIndex];

  if (!exercise) throw new Error("Exercise not found");

  const newSet = {
    setNumber: exercise.sets.length + 1,
    weight: setData.weight,
    reps: setData.reps,
    durationSeconds: setData.durationSeconds,
    distance: setData.distance,
    rpe: setData.rpe,
    completed: true,
  };

  exercise.sets.push(newSet);

  // ---------- SUMMARY CALCULATION ----------

  let bestWeight = 0;
  let bestReps = 0;
  let volume = 0;

  for (const set of exercise.sets) {
    if (set.weight && set.reps) {
      volume += set.weight * set.reps;

      if (set.weight > bestWeight) {
        bestWeight = set.weight;
      }

      if (set.reps > bestReps) {
        bestReps = set.reps;
      }
    }
  }

  exercise.summary = {
    bestWeight,
    bestReps,
    volume,
    setCount: exercise.sets.length,
  };

  return session.save();
};

/**
 * Finish workout
 */
exports.finishSession = async (userId, sessionId) => {
  const session = await getUserSession(sessionId, userId);
  if (!session) throw new Error("Workout session not found");

  session.endedAt = new Date();
  session.durationSeconds = (session.endedAt - session.startedAt) / 1000;
  session.completed = true;

  await session.save();
  await streakService.updateStreak(userId, session.endedAt);
  for (const ex of session.exercises) {
    const summary = ex.summary;
    if (!summary) continue;

    const stats = await UserExerciseStats.findOneAndUpdate(
      { user: userId, exercise: ex.exercise },
      {
        $max: {
          bestWeight: summary.bestWeight,
          bestReps: summary.bestReps,
        },

        $set: {
          lastWeight: summary.bestWeight,
          lastReps: summary.bestReps,
          lastSession: session.endedAt,
        },

        $inc: {
          totalVolume: summary.volume || 0,
          totalSets: summary.setCount || 0,
        },
      },
      { upsert: true, new: true },
    );

    if (summary.bestWeight && summary.bestReps) {
      const estimated1RM = summary.bestWeight * (1 + summary.bestReps / 30);

      stats.estimated1RM = Math.max(stats.estimated1RM || 0, estimated1RM);

      await stats.save();
    }
  }

  return session;
};

/**
 * Get user workout history
 */
exports.getSessions = async (userId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { user: userId };

  const [sessions, total] = await Promise.all([
    WorkoutSession.find(filter)
      .sort({ startedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("name startedAt endedAt durationSeconds"),
    WorkoutSession.countDocuments(filter),
  ]);

  return {
    sessions,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    },
  };
};

/**
 * Get session details
 */
exports.getSessionById = async (userId, sessionId) => {
  return WorkoutSession.findOne({
    _id: sessionId,
    user: userId,
  }).populate("exercises.exercise");
};
