# SweatStreak Backend – Development Roadmap

## Overview

This document defines the **development roadmap for the SweatStreak backend**.

The roadmap is divided into phases to maintain:

- clear development scope
- incremental feature delivery
- manageable technical complexity

SweatStreak follows the philosophy:

```
Consistency over performance
Low friction logging
Progression guidance
```

The backend roadmap focuses on building a **stable workout engine first**, then layering **analytics, coaching, and social features**.

---

# Phase 1 – Core Workout Engine (MVP)

Status: **Completed / Near Completion**

The goal of Phase 1 is to build the **foundation of the application**.

Focus:

```
workout logging
exercise tracking
strength progression
habit streaks
```

---

## Authentication System

Provides secure user access.

Features:

```
user registration
user login
JWT authentication
protected routes
rate limiting
```

Files:

```
modules/auth
middlewares/auth.middleware
```

---

## Exercise Library

Provides a curated list of exercises.

Features:

```
exercise catalog
muscle group classification
equipment tagging
progression step configuration
```

Seed data:

```
data/exercises.js
```

Example:

```
Bench Press
Squat
Deadlift
Dumbbell Curl
```

---

## Workout Templates

Templates define reusable workout plans.

Examples:

```
Push Day
Pull Day
Leg Day
Upper Body
```

Features:

```
exercise order
rep ranges
rest intervals
system templates
user templates
```

Templates help users start workouts quickly.

---

## Workout Sessions

Sessions represent actual workouts.

Capabilities:

```
start workout
add exercises
add sets
finish workout
track duration
```

Session completion triggers system updates:

```
update streak
update exercise stats
```

---

## Exercise Logs & Sets

Workout sessions contain embedded exercise logs.

Each exercise contains:

```
sets
summary statistics
completion status
```

Each set stores:

```
weight
reps
duration
distance
RPE
```

---

## Exercise Summary System

Each exercise calculates a summary:

```
bestWeight
bestReps
volume
setCount
```

Purpose:

```
analytics
progression engine
PR detection
```

Volume calculation:

```
volume = Σ(weight × reps)
```

---

## UserExerciseStats

Stores lifetime performance per exercise.

Example:

```
Bench Press
bestWeight: 100kg
bestReps: 10
estimated1RM: 133kg
```

Used for:

```
progression engine
performance insights
strength graphs
```

---

## Progression Engine

Suggests next workout weight targets.

Rules:

```
compound → 6–8 reps
isolation → 8–12 reps
```

Weight changes:

```
increase weight if reps reach upper range
decrease weight if reps fall below minimum
```

Weight increments depend on:

```
exercise.progressionStep
```

Example:

```
Bench Press → +2.5kg
Dumbbell Curl → +1kg
Machine exercises → +5kg
```

---

## Streak Engine

Tracks workout consistency.

Fields:

```
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

Purpose:

```
habit reinforcement
motivation
gamification
```

---

# Phase 2 – Analytics & Smart Coaching

Goal: Improve workout insights and guidance.

---

## Dashboard API

Provides aggregated user statistics.

Example response:

```
current streak
weekly volume
last workout
recent exercises
```

This reduces the number of frontend API calls.

---

## Workout Analytics

Add endpoints for workout analysis.

Examples:

```
weekly volume
monthly volume
exercise frequency
personal records
```

These enable charts in the mobile app.

---

## Plateau Detection

Detect stalled progress.

Example:

```
same weight
same reps
3 sessions
```

Engine suggests:

```
deload
weight reduction
rep range adjustment
```

---

## Smart Suggestions

Additional guidance features:

```
suggest next workout
suggest rest days
suggest exercise rotation
```

These features move SweatStreak toward a **coaching system**.

---

# Phase 3 – Gamification & Social

Goal: increase engagement and long-term retention.

---

## XP System

Gamified progression system.

Example:

```
+10 XP per workout
+5 XP per streak day
+1 XP per set
```

Users gain levels over time.

---

## Achievement System

Example achievements:

```
7-day streak
50 workouts completed
first 100kg lift
```

Achievements increase motivation.

---

## Challenges

Example:

```
30-day workout challenge
bench press improvement challenge
```

Challenges can be:

```
solo
group
community
```

---

## Social Features

Future possibilities:

```
share workouts
compare streaks
community challenges
```

These features increase engagement.

---

# Infrastructure Roadmap

Future backend improvements.

---

## CI/CD Pipeline

Automated deployment.

Possible tools:

```
GitHub Actions
Docker
AWS
```

---

## Observability

Monitoring tools:

```
logging
performance metrics
error tracking
```

Example tools:

```
Sentry
Prometheus
Grafana
```

---

## Infrastructure as Code

Infrastructure automation using:

```
AWS CDK
Terraform
```

---

# Long-Term Vision

SweatStreak aims to evolve from:

```
simple workout tracker
```

into a:

```
habit-focused fitness platform
```

Combining:

```
strength tracking
habit reinforcement
smart coaching
gamification
```

The backend architecture is designed to **support this evolution without major rewrites**.

---

# Summary

Phase 1 delivers the core workout engine:

```
exercise library
workout templates
workout sessions
exercise summaries
exercise statistics
progression engine
streak tracking
```

Future phases add:

```
analytics
coaching
gamification
social features
```

This roadmap ensures **steady product evolution while maintaining backend stability**.
