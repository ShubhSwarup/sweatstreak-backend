# SweatStreak Backend – System Architecture

## Overview

SweatStreak is a **fitness habit tracking application** designed to promote consistency rather than performance optimization.

The backend provides services for:

- authentication
- exercise library
- workout templates
- workout session logging
- progression suggestions
- streak tracking

The architecture follows a **modular service-based structure** built on:

```
Node.js
Express
MongoDB
JWT Authentication
```

---

# Backend Architecture Pattern

The project follows a **layered architecture**:

```
Routes
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
MongoDB
```

### Routes

Handle HTTP routing and middleware.

Example:

```
POST /sessions/start
GET /streak
```

---

### Controllers

Controllers handle request/response logic.

Responsibilities:

- validate request context
- call service functions
- format API responses

Example:

```
workoutSession.controller.js
streak.controller.js
```

---

### Services

Services contain **core business logic**.

Examples:

```
startSession()
addSet()
finishSession()
updateStreak()
getProgressionSuggestion()
```

Services interact with database models.

---

### Models

Models define MongoDB schemas.

Examples:

```
Exercise
WorkoutTemplate
WorkoutSession
UserExerciseStats
UserStreak
```

---

# Module Structure

The backend is organized into modules:

```
modules/
   auth
   exercises
   workoutTemplates
   workoutSessions
   progression
   streak
```

Each module contains:

```
routes
controller
service
```

Example:

```
modules/workoutSessions
    workoutSession.routes.js
    workoutSession.controller.js
    workoutSession.service.js
```

This ensures **clear separation of responsibilities**.

---

# Request Lifecycle

Example: finishing a workout.

```
Client Request
      ↓
POST /sessions/:id/finish
      ↓
Route
      ↓
Controller
      ↓
Service
      ↓
Database Updates
      ↓
Response
```

Service operations triggered:

```
finishSession()
   ├─ save session
   ├─ update streak
   └─ update exercise stats
```

---

# Core System Components

## Authentication

Provides secure user login and registration.

Uses:

```
JWT tokens
auth middleware
```

Protected routes require authentication.

---

## Exercise Library

Provides a curated list of exercises.

Stored in:

```
Exercise model
```

Seeded from:

```
data/exercises.js
```

Fields include:

```
name
type
muscleGroup
equipment
progressionStep
```

---

## Workout Templates

Templates define structured workouts.

Examples:

```
Push Day
Pull Day
Leg Day
Upper Body
```

Templates include:

```
exercise order
rep ranges
rest times
```

Templates may be:

```
system templates
user templates
```

---

## Workout Sessions

Represents actual workouts performed by users.

Sessions include:

```
exercises
sets
summary statistics
duration
completion status
```

Sessions trigger updates to:

```
streak engine
exercise statistics
```

---

## Progression Engine

Provides weight suggestions for future workouts.

Rules:

```
compound → 6–8 reps
isolation → 8–12 reps
```

Weight adjustments depend on performance in previous sessions.

---

## Streak Engine

Tracks workout consistency.

Maintains:

```
current streak
longest streak
last workout date
```

Streak updates occur when workouts are completed.

---

# Security

Security mechanisms include:

```
JWT authentication
auth middleware
ownership checks
rate limiting
```

Ownership checks ensure users only access their own data.

Example:

```
findOne({ _id: sessionId, user: userId })
```

---

# Scalability Considerations

The backend is designed to scale by:

```
modular architecture
separate services
indexed MongoDB queries
stat aggregation models
```

Example optimization:

```
UserExerciseStats
```

This prevents scanning all workout sessions when computing progression.

---

# Future System Extensions

Planned backend additions include:

### Dashboard API

Provides aggregated data for the mobile app.

Example response:

```
current streak
weekly volume
last workout
recent exercises
```

---

### Analytics Engine

Supports workout analytics:

```
weekly volume
monthly volume
exercise frequency
```

---

### Gamification Layer

Adds motivation mechanics:

```
XP system
achievement badges
challenge systems
```

---

# Summary

The SweatStreak backend architecture provides a scalable and modular system for:

```
user authentication
exercise management
workout tracking
progression suggestions
habit streaks
```

This architecture supports future expansion into advanced fitness analytics and coaching features.
