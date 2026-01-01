# BackendAssignment4

Minimal Express + MongoDB backend for assignment 4.

## Description
Simple REST API with authentication and posts. Contains user registration/login and CRUD operations for posts.

## Prerequisites
- Node.js (v14+)
- npm
- MongoDB URI (Atlas or local)

## Installation

```bash
npm install
```

## Environment Variables
Create a `.env` file in the project root or set environment variables:

- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for signing JWTs
- `PORT` - (optional) port to run the server (default 3000)

## Run

Start the server:

```bash
node server.js
```

For development you can use `nodemon` if installed:

```bash
npx nodemon server.js
```

## API Endpoints

Authentication:
- POST /api/auth/register — register a new user
- POST /api/auth/login — login and receive a JWT

Posts (protected routes — require Authorization header `Bearer <token>`):
- GET /api/posts — list posts
- POST /api/posts — create a post
- GET /api/posts/:id — get a single post
- PUT /api/posts/:id — update a post
- DELETE /api/posts/:id — delete a post

Notes:
- Some routes may require specific roles; see `middleware/roles.js` and `middleware/auth.js` for details.

## Troubleshooting
- If the server crashes on start, ensure `MONGO_URI` and `JWT_SECRET` are set.
- Check `server.js` for the app port and DB connection logs.

