# SweatStreak Backend — Authentication Architecture

This document explains the authentication system used in the SweatStreak backend.
It describes the design decisions, security considerations, and the full authentication flow.

The goal of this architecture is to provide:

- Secure authentication
- Scalable session management
- Protection against token attacks
- A reusable auth architecture for future backend projects

---

# 1. Authentication Strategy

SweatStreak uses **JWT-based authentication** with:

- **Access Tokens**
- **Refresh Tokens**
- **Refresh Token Rotation**
- **Hashed Refresh Tokens**
- **Multi-device session support**

This pattern is commonly used in modern backend systems and large-scale applications.

---

# 2. Token Types

## Access Token

Access tokens are short-lived tokens used to authenticate API requests.

Properties:

- Signed using `JWT_ACCESS_SECRET`
- Short expiration time (15 minutes)
- Sent in request headers

Example:

```
Authorization: Bearer <access_token>
```

Payload example:

```json
{
  "id": "user_id",
  "iat": 1710000000,
  "exp": 1710000900
}
```

### Why Access Tokens Expire Quickly

If an attacker obtains an access token, it becomes useless after a short period of time.

Short-lived tokens reduce the impact of token leaks.

---

## Refresh Token

Refresh tokens are long-lived tokens used to obtain new access tokens without requiring the user to log in again.

Properties:

- Signed using `JWT_REFRESH_SECRET`
- Longer expiration (7 days)
- Stored in database (hashed)
- Used to issue new tokens

Refresh tokens are sent to:

```
POST /api/auth/refresh-token
```

---

# 3. Why Refresh Tokens Are Required

Without refresh tokens:

1. User logs in
2. Access token expires
3. User must log in again

This creates poor user experience.

With refresh tokens:

1. Access token expires
2. Client requests new access token
3. User session continues

This provides **persistent login sessions**.

---

# 4. Refresh Token Rotation

SweatStreak implements **refresh token rotation**.

Flow:

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

1. Verifies refresh token
2. Removes old refresh token
3. Generates new access token
4. Generates new refresh token
5. Stores new refresh token hash
6. Returns new tokens

Flow diagram:

```
Client
   ↓
refresh-token endpoint
   ↓
verify refresh token
   ↓
remove old token
   ↓
issue new tokens
```

### Why Rotation Is Important

Without rotation:

```
stolen refresh token = permanent access
```

With rotation:

```
old refresh token becomes invalid immediately
```

This prevents **token replay attacks**.

---

# 5. Hashed Refresh Tokens

Refresh tokens are **not stored in raw form** in the database.

Instead they are hashed using SHA256.

Example:

```
refreshTokenHash = SHA256(refreshToken)
```

Why this is important:

If the database is compromised:

```
attacker cannot use hashed tokens
```

This follows the same security principle used for password storage.

---

# 6. Multi-Device Sessions

SweatStreak supports multiple active sessions per user.

Instead of storing one refresh token:

```
refreshTokenHash: String
```

We store multiple:

```
refreshTokenHashes: [String]
```

Example:

```json
{
  "refreshTokenHashes": ["hash_device_1", "hash_device_2", "hash_device_3"]
}
```

Benefits:

- login from multiple devices
- independent sessions
- logout per device
- better session management

---

# 7. Authentication Endpoints

## Register

```
POST /api/auth/register
```

Steps:

1. Check if email exists
2. Hash password using bcrypt
3. Create user
4. Generate access token
5. Generate refresh token
6. Store hashed refresh token

---

## Login

```
POST /api/auth/login
```

Steps:

1. Find user by email
2. Compare password using bcrypt
3. Generate tokens
4. Store hashed refresh token
5. Return tokens and serialized user

---

## Refresh Token

```
POST /api/auth/refresh-token
```

Steps:

1. Verify refresh token signature
2. Find user by token payload
3. Compare hashed token with database
4. Remove old token
5. Generate new tokens
6. Store new token hash

---

## Logout

```
POST /api/auth/logout
```

Steps:

1. Receive refresh token
2. Hash token
3. Remove matching token hash from DB

Logout only affects **that specific device session**.

---

# 8. Password Security

Passwords are hashed using **bcrypt**.

Example:

```
bcrypt.hash(password, 10)
```

Why bcrypt is used:

- One-way hashing
- Salted hashes
- Resistant to brute force attacks

Passwords are never stored in plain text.

---

# 9. Serializer Layer

SweatStreak uses serializers to control API responses.

Example:

```
user.serializer.js
```

Purpose:

- remove sensitive fields
- keep API responses consistent
- protect internal database structure

Example API response:

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

Sensitive fields such as:

```
password
refreshTokenHashes
```

are never exposed.

---

# 10. Rate Limiting

Authentication routes are protected using rate limiting.

Protected routes:

```
/api/auth/register
/api/auth/login
/api/auth/refresh-token
```

Example configuration:

```
50 requests per 15 minutes per IP
```

This prevents:

- brute force attacks
- credential stuffing
- token abuse

---

# 11. Security Practices Implemented

The authentication system includes:

- bcrypt password hashing
- short-lived access tokens
- refresh token rotation
- hashed refresh tokens
- multi-device sessions
- serializer layer
- rate limiting protection
- JWT signature verification

These practices follow common backend security standards.

---

# 12. Possible Future Improvements

Potential upgrades:

- store hashed refresh tokens with bcrypt
- use HTTP-only cookies
- email verification
- password reset flow
- OAuth login (Google / Apple)
- session activity tracking
- device identification

---

# 13. Summary

The SweatStreak authentication system provides:

- secure login
- scalable session management
- protection against token attacks
- reusable backend architecture

This authentication structure can be reused in future backend projects with minimal changes.
