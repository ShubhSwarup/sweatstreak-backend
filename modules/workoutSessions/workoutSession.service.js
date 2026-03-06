const WorkoutSession = require("../../models/workoutSession.model");
const WorkoutTemplate = require("../../models/workoutTemplate.model");
const UserExerciseStats = require("../../models/userExerciseStats.model");
const streakService = require("../streak/streak.service");
const xpService = require("../xp/xp.service");
const progressionService = require("../progression/progression.service");
const Exercise = require("../../models/exercise.model");

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

    // load exercise metadata once
    const exerciseIds = template.exercises.map((e) => e.exercise);

    const exerciseDocs = await Exercise.find({
      _id: { $in: exerciseIds },
    }).select("exerciseType trackingType");

    const exerciseMap = new Map();

    for (const ex of exerciseDocs) {
      exerciseMap.set(ex._id.toString(), ex);
    }

    // recent sessions
    const lastSessions = await WorkoutSession.find({
      user: userId,
      completed: true,
    })
      .select("exercises.exercise exercises.sets")
      .sort({ startedAt: -1 })
      .limit(20)
      .lean();

    const lastExerciseMap = new Map();

    for (const session of lastSessions) {
      for (const ex of session.exercises) {
        const key = ex.exercise.toString();
        if (!lastExerciseMap.has(key)) {
          lastExerciseMap.set(key, ex);
        }
      }
    }

    const statsList = await UserExerciseStats.find({ user: userId }).lean();

    const statsMap = new Map();

    for (const stat of statsList) {
      statsMap.set(stat.exercise.toString(), stat);
    }

    for (let i = 0; i < template.exercises.length; i++) {
      const ex = template.exercises[i];
      const exerciseId = ex.exercise.toString();

      const exerciseDoc = exerciseMap.get(exerciseId);
      if (!exerciseDoc) continue;
      const lastExercise = lastExerciseMap.get(exerciseId);
      const stats = statsMap.get(exerciseId);

      let sets = [];
      let nextWeight = null;

      if (stats) {
        const suggestion =
          progressionService.calculateSuggestionFromStats(stats);
        nextWeight = suggestion?.nextWeight ?? null;
      }

      if (lastExercise) {
        sets = lastExercise.sets.map((s, index) => ({
          setNumber: index + 1,
          weight: nextWeight ?? s.weight,
          reps: s.reps,
          durationSeconds: s.durationSeconds,
          distance: s.distance,
          rpe: s.rpe,
          completed: false,
        }));
      } else {
        const defaultSets = ex.sets || 3;

        for (let j = 0; j < defaultSets; j++) {
          sets.push({
            setNumber: j + 1,
            weight: null,
            reps: null,
            completed: false,
          });
        }
      }

      exercises.push({
        exercise: ex.exercise,
        exerciseType: exerciseDoc.exerciseType,
        trackingType: exerciseDoc.trackingType,
        order: i + 1,
        sets,
        restSeconds: ex.restSeconds || 90,
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
  if (session.completed) {
    throw new Error("Session already finished");
  }

  const exerciseDoc = await Exercise.findById(exerciseData.exercise);

  if (!exerciseDoc) throw new Error("Exercise not found");

  session.exercises.push({
    exercise: exerciseData.exercise,
    order: exerciseData.order,
    notes: exerciseData.notes || "",
    restSeconds: exerciseData.restSeconds || 90,
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
  if (session.completed) throw new Error("Session already finished");

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

  let bestWeight = 0;
  let bestReps = 0;
  let volume = 0;

  for (const set of exercise.sets) {
    if (exercise.exerciseType === "strength") {
      if (set.weight != null && set.reps != null) {
        volume += set.weight * set.reps;
        bestWeight = Math.max(bestWeight, set.weight);
        bestReps = Math.max(bestReps, set.reps);
      }
    } else {
      if (set.distance != null) volume += set.distance;
      if (set.durationSeconds != null) volume += set.durationSeconds;
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
  if (session.completed) return session;

  session.endedAt = new Date();
  session.durationSeconds = (session.endedAt - session.startedAt) / 1000;
  session.completed = true;

  let totalVolume = 0;
  let totalSets = 0;
  let totalExercises = 0;

  const personalRecords = [];
  const bulkOps = [];

  const previousStatsMap = new Map();

  const statsList = await UserExerciseStats.find({
    user: userId,
  }).lean();

  for (const stat of statsList) {
    previousStatsMap.set(stat.exercise.toString(), stat);
  }

  for (const ex of session.exercises) {
    const summary = ex.summary;
    if (!summary) continue;

    totalVolume += summary.volume || 0;
    totalSets += summary.setCount || 0;
    totalExercises += 1;

    const volumeScore = summary.volume;
    const estimated1RM = summary.bestWeight * (1 + summary.bestReps / 30);

    const previousStats = previousStatsMap.get(ex.exercise.toString());

    const previousBestWeight = previousStats?.bestWeight || 0;
    const previousVolume = previousStats?.volumeScore || 0;
    const previous1RM = previousStats?.estimated1RM || 0;

    // detect PRs

    if (summary.bestWeight > previousBestWeight) {
      personalRecords.push({
        exercise: ex.exercise,
        type: "weight",
        value: summary.bestWeight,
      });
    }

    if (volumeScore > previousVolume) {
      personalRecords.push({
        exercise: ex.exercise,
        type: "volume",
        value: volumeScore,
      });
    }

    if (estimated1RM > previous1RM) {
      personalRecords.push({
        exercise: ex.exercise,
        type: "1rm",
        value: estimated1RM,
      });
    }

    // cardio PR detection
    if (ex.exerciseType === "cardio") {
      let bestDistance = 0;
      let bestTime = 0;

      for (const set of ex.sets) {
        if (set.distance) bestDistance = Math.max(bestDistance, set.distance);
        if (set.durationSeconds)
          bestTime = Math.max(bestTime, set.durationSeconds);
      }

      if (bestDistance > (previousStats?.bestDistance || 0)) {
        personalRecords.push({
          exercise: ex.exercise,
          type: "distance",
          value: bestDistance,
        });
      }

      if (bestTime > (previousStats?.bestTime || 0)) {
        personalRecords.push({
          exercise: ex.exercise,
          type: "time",
          value: bestTime,
        });
      }
    }

    bulkOps.push({
      updateOne: {
        filter: {
          user: userId,
          exercise: ex.exercise,
        },
        update: {
          $max: {
            bestWeight: summary.bestWeight,
            bestReps: summary.bestReps,
            volumeScore,
            estimated1RM,
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
        upsert: true,
      },
    });
  }

  if (bulkOps.length > 0) {
    await UserExerciseStats.bulkWrite(bulkOps);
  }

  session.sessionSummary = {
    totalVolume,
    totalSets,
    totalExercises,
  };

  session.personalRecords = personalRecords;

  await session.save();

  const streak = await streakService.updateStreak(userId, session.endedAt);

  await xpService.addWorkoutXP(userId, session, streak?.currentStreak > 1);

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

exports.getActiveSession = async (userId) => {
  const session = await WorkoutSession.findOne({
    user: userId,
    completed: false,
  })
    .sort({ startedAt: -1 })
    .populate("exercises.exercise");

  return session;
};
