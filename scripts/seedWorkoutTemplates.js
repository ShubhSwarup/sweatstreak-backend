require("dotenv").config();
const connectDB = require("../config/db");

const Exercise = require("../models/exercise.model");
const WorkoutTemplate = require("../models/workoutTemplate.model");

const templates = require("../data/workoutTemplates");

const seedTemplates = async () => {
  try {
    await connectDB();

    await WorkoutTemplate.deleteMany({ isSystem: true });

    for (const template of templates) {
      const exercises = [];

      for (let i = 0; i < template.exercises.length; i++) {
        const ex = template.exercises[i];

        const exerciseDoc = await Exercise.findOne({
          slug: ex.slug,
        });

        if (!exerciseDoc) {
          throw new Error(`Exercise not found: ${ex.slug}`);
        }

        exercises.push({
          exercise: exerciseDoc._id,
          sets: ex.sets,
          repRange: {
            min: ex.min ?? null,
            max: ex.max ?? null,
          },
          order: i + 1,
        });
      }

      await WorkoutTemplate.create({
        name: template.name,
        description: template.description,
        isSystem: true,
        exercises,
      });
    }

    console.log("Workout templates seeded");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedTemplates();
