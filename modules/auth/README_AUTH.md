# SweatStreak Backend — Authentication System

This document explains the authentication architecture used in the SweatStreak backend, including why certain design decisions were made and how the full authentication flow works.

The goal of this system is to provide a **secure, scalable, and production-ready authentication mechanism** using **JWT access tokens, refresh tokens, and token rotation**.

---

# 1. Authentication Strategy

SweatStreak uses **JWT-based authentication** with two types of tokens:

- **Access Token**
- **Refresh Token**

This approach is widely used in modern web and mobile applications because it provides:

- Stateless authentication
- Scalable APIs
- Secure session management

---

# 2. Access Token

An **Access Token** is a short-lived JWT used to authenticate API requests.

### Properties

- Contains user ID
- Signed with `JWT_ACCESS_SECRET`
- Short expiration time (ex: 15 minutes)

### Example Payload

```json
{
  "id": "user_id",
  "iat": 1710000000,
  "exp": 1710000900
}
```

### Purpose

Access tokens are sent in API requests:

```
Authorization: Bearer <access_token>
```

The server verifies this token to allow access to protected endpoints.

### Why Access Tokens Expire Quickly

Short expiration protects the system if a token is stolen.

If an attacker gets an access token, it becomes useless after a short time.

---

# 3. Refresh Token

A **Refresh Token** is used to generate new access tokens without requiring the user to log in again.

### Properties

- Long expiration (ex: 7 days)
- Stored in the database
- Signed with `JWT_REFRESH_SECRET`

### Example Use

When an access token expires, the client sends the refresh token to:

```
POST /api/auth/refresh-token
```

The server verifies the refresh token and issues a new access token.

---

# 4. Why Refresh Tokens Are Needed

Without refresh tokens:

1. User logs in
2. Access token expires
3. User must log in again

This creates a poor user experience.

With refresh tokens:

1. Access token expires
2. Client requests a new one
3. User stays logged in

This creates a **smooth session experience**.

---

# 5. Refresh Token Rotation

SweatStreak implements **refresh token rotation** for better security.

### Flow

```
Login
   ↓
Access Token (15 min)
Refresh Token (7 days)
```

When the client calls:

```
POST /api/auth/refresh-token
```

The server:

1. Verifies the refresh token
2. Generates a new access token
3. Generates a new refresh token
4. Replaces the old refresh token in the database

### Why This Is Important

If a refresh token is stolen:

Without rotation:

```
attacker can use token forever
```

With rotation:

```
old token becomes invalid immediately
```

This prevents **token replay attacks**.

---

# 6. Authentication Endpoints

## Register

```
POST /api/auth/register
```

Creates a new user.

Steps:

1. Check if email exists
2. Hash password with bcrypt
3. Create user in database
4. Generate access token
5. Generate refresh token
6. Store refresh token in DB

---

## Login

```
POST /api/auth/login
```

Steps:

1. Find user by email
2. Compare password using bcrypt
3. Generate access token
4. Generate refresh token
5. Save refresh token in DB
6. Return tokens and serialized user

---

## Refresh Token

```
POST /api/auth/refresh-token
```

Steps:

1. Verify refresh token signature
2. Find user from token payload
3. Compare refresh token with DB
4. Generate new access token
5. Generate new refresh token
6. Replace refresh token in DB

---

## Logout

```
POST /api/auth/logout
```

Steps:

1. Receive refresh token
2. Find user with that token
3. Remove refresh token from database

After logout the refresh token becomes invalid.

---

# 7. Password Security

Passwords are never stored in plain text.

SweatStreak uses **bcrypt hashing**.

Example:

```
bcrypt.hash(password, 10)
```

Why bcrypt is used:

- One-way hashing
- Resistant to brute force
- Industry standard

---

# 8. Serializer Layer

SweatStreak uses a **serializer layer** to prevent sensitive data exposure.

Example:

```
user.serializer.js
```

Purpose:

- Remove password
- Remove refreshToken
- Control API response structure

Example response:

```json
{
  "user": {
    "id": "...",
    "name": "Shubh",
    "email": "test@test.com",
    "currentStreak": 0,
    "longestStreak": 0,
    "totalXP": 0
  },
  "accessToken": "...",
  "refreshToken": "..."
}
```

---

# 9. Security Decisions

Key security practices implemented:

- bcrypt password hashing
- short-lived access tokens
- refresh token rotation
- refresh token stored in database
- serializer to hide sensitive fields
- JWT signature verification
- protected route middleware

---

# 10. Future Improvements

Possible improvements for production environments:

- store **hashed refresh tokens**
- use **HTTP-only cookies**
- add **rate limiting for auth endpoints**
- implement **email verification**
- implement **password reset flow**
- support **OAuth login (Google/Apple)**

---

# 11. Summary

The SweatStreak authentication system provides:

- Secure login
- Stateless API authentication
- Session persistence
- Protection against token replay attacks
- Clean and scalable architecture

This authentication system can be reused across multiple backend projects with minimal changes.
