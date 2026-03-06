# SweatStreak Backend – Database Schema

## Overview

The SweatStreak backend uses **MongoDB** as the primary database.

The schema is designed to support:

```
exercise tracking
workout logging
strength progression
habit streaks
```

Each collection serves a specific role in the system.

---

# Core Collections

## Users

Represents application users.

Fields:

```
email
passwordHash
name
createdAt
```

Relationships:

```
User
 ├─ WorkoutSessions
 ├─ WorkoutTemplates
 ├─ UserExerciseStats
 └─ UserStreak
```

---

# Exercise

Represents exercises in the library.

Examples:

```
Bench Press
Squat
Deadlift
Dumbbell Curl
```

Fields:

```
name
type
muscleGroup
equipment
progressionStep
```

Progression step determines weight increments.

Example:

```
Bench Press → 2.5kg
Dumbbell Curl → 1kg
```

---

# WorkoutTemplate

Defines structured workouts.

Example:

```
Push Day
```

Exercises stored as:

```
exercise
order
repRange
restSeconds
notes
```

Templates may belong to:

```
system
user
```

---

# WorkoutSession

Represents a completed workout.

Fields:

```
user
template
name
startedAt
endedAt
durationSeconds
completed
```

Contains embedded data:

```
exercises[]
```

---

# Exercise Logs (Embedded)

Stored inside sessions.

Structure:

```
exercise
order
notes
sets[]
summary
completed
```

---

# Sets (Embedded)

Each set includes:

```
setNumber
weight
reps
durationSeconds
distance
rpe
completed
```

Example:

```
Set1 60kg x 8
Set2 60kg x 7
Set3 60kg x 6
```

---

# Exercise Summary (Embedded)

Provides quick statistics for each exercise.

Fields:

```
bestWeight
bestReps
volume
setCount
```

Volume calculation:

```
weight × reps
```

Summed across sets.

---

# UserExerciseStats

Stores long-term performance per user per exercise.

Unique index:

```
user + exercise
```

Fields:

```
bestWeight
bestReps
estimated1RM
lastWeight
lastReps
totalVolume
totalSets
lastSession
```

Purpose:

```
progression engine
strength analytics
performance graphs
```

---

# UserStreak

Tracks workout streaks.

Fields:

```
user
currentStreak
longestStreak
lastWorkoutDate
```

Logic:

```
same day workout → no change
next day workout → streak++
missed days → reset
```

---

# Database Relationships

```
User
 ├─ WorkoutSession
 │     └─ ExerciseLogs
 │           └─ Sets
 │
 ├─ WorkoutTemplate
 │     └─ TemplateExercises
 │
 ├─ UserExerciseStats
 │
 └─ UserStreak
```

---

# Index Strategy

Important indexes:

```
UserExerciseStats → (user, exercise)
WorkoutSession → (user, startedAt)
UserStreak → (user)
```

Indexes ensure fast queries for:

```
workout history
exercise progression
streak lookup
```

---

# Data Flow Example

Example workout:

```
Push Day
```

Stored as:

```
WorkoutSession
   user: X
   exercises:
      Bench Press
         sets:
            60x8
            60x7
            60x6
```

Summary stored as:

```
bestWeight: 60
bestReps: 8
volume: 1260
```

Stats updated:

```
UserExerciseStats
```

Streak updated:

```
UserStreak
```

---

# Summary

The database schema supports:

```
exercise library
workout templates
session logging
strength statistics
progression engine
streak tracking
```

This schema forms the **foundation of the SweatStreak backend system**.
