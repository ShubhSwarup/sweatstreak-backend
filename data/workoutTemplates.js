module.exports = [
  {
    name: "Push Day",
    description: "Chest, shoulders and triceps workout",
    isSystem: true,
    exercises: [
      { slug: "bench-press", sets: 4, min: 6, max: 8 },
      { slug: "incline-dumbbell-press", sets: 3, min: 8, max: 10 },
      { slug: "overhead-press", sets: 3, min: 6, max: 8 },
      { slug: "lateral-raise", sets: 3, min: 12, max: 15 },
      { slug: "tricep-pushdown", sets: 3, min: 10, max: 12 },
    ],
  },

  {
    name: "Pull Day",
    description: "Back and biceps workout",
    isSystem: true,
    exercises: [
      { slug: "deadlift", sets: 4, min: 3, max: 6 },
      { slug: "lat-pulldown", sets: 3, min: 8, max: 12 },
      { slug: "seated-cable-row", sets: 3, min: 8, max: 12 },
      { slug: "face-pull", sets: 3, min: 12, max: 15 },
      { slug: "barbell-curl", sets: 3, min: 8, max: 12 },
    ],
  },

  {
    name: "Leg Day",
    description: "Leg focused workout",
    isSystem: true,
    exercises: [
      { slug: "squat", sets: 4, min: 5, max: 8 },
      { slug: "romanian-deadlift", sets: 3, min: 6, max: 10 },
      { slug: "leg-press", sets: 3, min: 8, max: 12 },
      { slug: "leg-curl", sets: 3, min: 10, max: 15 },
      { slug: "standing-calf-raise", sets: 4, min: 12, max: 20 },
    ],
  },

  {
    name: "Full Body Beginner",
    description: "Balanced beginner workout",
    isSystem: true,
    exercises: [
      { slug: "squat", sets: 3, min: 8, max: 10 },
      { slug: "bench-press", sets: 3, min: 8, max: 10 },
      { slug: "lat-pulldown", sets: 3, min: 8, max: 12 },
      { slug: "dumbbell-shoulder-press", sets: 3, min: 10, max: 12 },
      { slug: "plank", sets: 3, min: 30, max: 60 },
    ],
  },
];
