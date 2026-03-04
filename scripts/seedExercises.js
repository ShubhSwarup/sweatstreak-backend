require("dotenv").config();
const mongoose = require("mongoose");
const Exercise = require("../models/exercise.model");

const connectDB = require("../config/db");

const exercises = require("../data/exercises");

const seedExercises = async () => {
  try {
    await connectDB();

    await Exercise.deleteMany();

    await Exercise.insertMany(exercises);

    console.log("Exercises seeded successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedExercises();
