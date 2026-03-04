const Exercise = require("../../models/exercise.model");

exports.getExercises = async ({
  muscleGroup,
  search,
  page = 1,
  limit = 20,
}) => {
  const query = {};

  if (muscleGroup) {
    query.muscleGroup = muscleGroup;
  }

  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;

  const [exercises, total] = await Promise.all([
    Exercise.find(query).sort({ name: 1 }).skip(skip).limit(limit).lean(),

    Exercise.countDocuments(query),
  ]);

  return {
    data: exercises,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

exports.getExerciseById = async (id) => {
  return Exercise.findById(id);
};
