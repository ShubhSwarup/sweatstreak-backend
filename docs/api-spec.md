# SweatStreak Backend – API Specification

## Overview

This document lists all backend endpoints available in the SweatStreak API.

The API follows REST principles and returns JSON responses in the format:

```
{
  success: true,
  data: {...}
}
```

Error responses:

```
{
  success: false,
  message: "Error description"
}
```

Authentication is required for most endpoints.

Protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Authentication API

## Register User

POST /auth/register

Request:

```
{
  "email": "user@email.com",
  "password": "password123",
  "name": "John"
}
```

Response:

```
{
  success: true,
  data: {
    user,
    token
  }
}
```

---

## Login

POST /auth/login

Request:

```
{
  "email": "user@email.com",
  "password": "password123"
}
```

Response:

```
{
  success: true,
  data: {
    user,
    token
  }
}
```

---

# Exercise API

## Get All Exercises

GET /exercises

Returns the full exercise library.

Response:

```
{
  success: true,
  data: [Exercise]
}
```

Example Exercise:

```
{
  name: "Bench Press",
  type: "compound",
  muscleGroup: "chest",
  equipment: "barbell",
  progressionStep: 2.5
}
```

---

# Workout Template API

## Get Templates

GET /templates

Returns available templates.

Includes:

```
system templates
user templates
```

---

## Create Template

POST /templates

Request:

```
{
  name: "Push Day",
  exercises: [
    {
      exercise: "exerciseId",
      order: 1,
      repRange: { min: 6, max: 8 },
      restSeconds: 120
    }
  ]
}
```

---

## Get Template By Id

GET /templates/:id

Returns template details.

---

# Workout Session API

## Start Workout Session

POST /sessions/start

Request:

```
{
  name: "Push Day",
  template: "templateId"
}
```

Response:

```
{
  success: true,
  data: session
}
```

If a template is provided, exercises are loaded automatically.

---

## Add Exercise To Session

POST /sessions/:id/exercises

Request:

```
{
  exercise: "exerciseId",
  order: 1,
  notes: ""
}
```

---

## Add Set

POST /sessions/:id/sets

Request:

```
{
  exerciseIndex: 0,
  weight: 60,
  reps: 8,
  rpe: 8
}
```

Server automatically assigns:

```
setNumber
```

Exercise summary is recalculated after each set.

---

## Finish Workout

POST /sessions/:id/finish

Triggers:

```
save session
update streak
update exercise stats
```

Response:

```
{
  success: true,
  data: session
}
```

---

## Get Workout History

GET /sessions

Query parameters:

```
page
limit
```

Example:

```
GET /sessions?page=1&limit=10
```

Response:

```
{
  success: true,
  data: [sessions],
  pagination: {
    page,
    pages,
    total
  }
}
```

---

## Get Workout Detail

GET /sessions/:id

Returns full session details including:

```
exercises
sets
summaries
```

---

# Progression Engine API

## Get Progression Suggestion

GET /progression/:exerciseId

Returns suggested weight and rep range.

Response:

```
{
  success: true,
  data: {
    lastWeight: 60,
    lastReps: 8,
    nextWeight: 62.5,
    repRange: "6-8"
  }
}
```

Logic:

```
compound → 6-8 reps
isolation → 8-12 reps
```

Weight increases if upper rep range is reached.

---

# Streak API

## Get User Streak

GET /streak

Response:

```
{
  success: true,
  data: {
    currentStreak: 5,
    longestStreak: 12,
    lastWorkoutDate: "2026-03-06"
  }
}
```

Streak rules:

```
same day workout → no change
next day workout → streak++
missed days → reset
```

---

# Future APIs

These endpoints are planned for future phases.

---

## Dashboard

GET /dashboard

Will return:

```
current streak
last workout
weekly volume
recent exercises
```

---

## Workout Analytics

GET /analytics/weekly

Example response:

```
{
  weekVolume: 5400,
  workouts: 4,
  exercises: [...]
}
```

---

# API Authentication Flow

```
Register/Login
      ↓
Receive JWT Token
      ↓
Include token in header
      ↓
Access protected endpoints
```

Header format:

```
Authorization: Bearer <token>
```

---

# API Modules Summary

```
auth
exercises
workoutTemplates
workoutSessions
progression
streak
```

Each module follows the structure:

```
routes
controller
service
```

---

# Summary

The SweatStreak API supports:

```
user authentication
exercise library
workout templates
workout logging
set tracking
progression suggestions
habit streak tracking
```

This API forms the backend interface for the **SweatStreak mobile application**.
