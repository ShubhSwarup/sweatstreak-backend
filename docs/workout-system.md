# SweatStreak Backend – Workout & Progression System Documentation

## Overview

This document explains the **Workout Tracking System** of the SweatStreak backend.

The system is responsible for:

- logging workouts
- tracking exercises and sets
- calculating exercise summaries
- updating user strength statistics
- generating progression suggestions
- maintaining workout streaks

This module is the **core engine of the SweatStreak application**.

---

# Architecture Overview

The workout system consists of the following modules:

```
Workout Templates
        ↓
Start Workout Session
        ↓
Workout Session
        ↓
Exercise Logs
        ↓
Sets
        ↓
Finish Workout
        ↓
Update Systems
   ├─ Streak Engine
   ├─ Exercise Stats
   └─ Progression Engine
```

---

# Core Data Models

## Exercise

Represents exercises available in the system.

Examples:

- Bench Press
- Squat
- Dumbbell Curl

Important fields:

```
name
type (compound | isolation)
muscleGroup
equipment
progressionStep
```

Example:

```
Bench Press
type: compound
progressionStep: 2.5
```

Progression step determines weight increase amount.

---

# WorkoutTemplate

Templates define a **planned workout structure**.

Examples:

```
Push Day
Pull Day
Leg Day
Upper Body
```

Each template contains:

```
exercises[]
  exercise
  order
  repRange
  restSeconds
```

Templates may be:

```
system templates
user templates
```

System templates are shared across all users.

---

# WorkoutSession

Represents a **real workout performed by the user**.

Fields:

```
user
template
name
exercises[]
startedAt
endedAt
durationSeconds
completed
```

---

# Exercise Log (Inside Session)

Each workout contains exercise logs:

```
exercise
order
notes
sets[]
summary
completed
```

---

# Sets

Sets represent the smallest unit of workout logging.

Fields:

```
setNumber
weight
reps
durationSeconds
distance
rpe
isWarmup
completed
```

Example:

```
Set1 60kg x 8
Set2 60kg x 7
Set3 60kg x 6
```

---

# Exercise Summary

Each exercise maintains a summary object.

Purpose:

- quick analytics
- progression engine input
- PR detection

Structure:

```
summary
  bestWeight
  bestReps
  volume
  setCount
```

Example:

```
bestWeight: 60
bestReps: 8
volume: 1260
setCount: 3
```

Volume formula:

```
volume = Σ(weight × reps)
```

---

# UserExerciseStats

This model stores **lifetime statistics for each exercise per user**.

Document uniqueness:

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

Estimated 1RM formula:

```
1RM = weight × (1 + reps / 30)
```

Purpose:

- progression engine
- strength graphs
- performance analytics

---

# Streak System

SweatStreak tracks workout consistency.

Model:

```
UserStreak
```

Fields:

```
user
currentStreak
longestStreak
lastWorkoutDate
```

Rules:

```
same day workout → no change
next day workout → streak++
missed days → reset streak
```

Example:

```
Day1 workout → streak 1
Day2 workout → streak 2
skip day
Day4 workout → streak 1
```

---

# Progression Engine

The progression engine suggests **next workout weight targets**.

Rep ranges:

```
Compound exercises → 6–8 reps
Isolation exercises → 8–12 reps
```

Weight increase rule:

```
If lastReps >= maxRep
→ increase weight
```

Weight decrease rule:

```
If lastReps < minRep
→ reduce weight (~10%)
```

Weight increments use:

```
exercise.progressionStep
```

Examples:

```
Bench Press → +2.5kg
Dumbbell Curl → +1kg
Machines → +5kg
```

Example suggestion:

```
Last workout: 60kg x 8
Next target: 62.5kg
Rep range: 6–8
```

---

# API Endpoints

## Start Workout

```
POST /sessions/start
```

Creates a workout session.

If a template is provided, exercises are loaded from the template.

---

## Add Exercise

```
POST /sessions/:id/exercises
```

Adds a new exercise to an active session.

---

## Add Set

```
POST /sessions/:id/sets
```

Adds a set to an exercise.

Also recalculates:

```
exercise.summary
```

---

## Finish Workout

```
POST /sessions/:id/finish
```

Triggers the following operations:

```
1. mark session completed
2. calculate duration
3. update streak
4. update exercise stats
```

---

## Get Workout History

```
GET /sessions
```

Returns paginated workout history.

---

## Get Workout Detail

```
GET /sessions/:id
```

Returns:

```
exercises
sets
summaries
```

---

## Progression Suggestion

```
GET /progression/:exerciseId
```

Returns:

```
nextWeight
repRange
lastWeight
lastReps
```

---

## Get Streak

```
GET /streak
```

Returns:

```
currentStreak
longestStreak
lastWorkoutDate
```

---

# Workout Completion Flow

```
Finish Workout
      ↓
Save Session
      ↓
Update Streak
      ↓
Update Exercise Stats
      ↓
Return Session
```

---

# Future Improvements

The following systems may be added later.

### Dashboard API

Single endpoint returning:

```
current streak
weekly volume
last workout
recent exercises
```

---

### XP System

Gamification layer.

Example:

```
+10 XP per workout
+5 XP per streak day
```

---

### Plateau Detection

Detect stalled progress.

Example:

```
same weight
same reps
3 sessions
```

Suggestion:

```
deload
```

---

# Summary

The workout engine supports:

```
exercise library
workout templates
session logging
set tracking
exercise summaries
strength statistics
progression suggestions
streak tracking
```

This forms the **core backend engine of SweatStreak**.
