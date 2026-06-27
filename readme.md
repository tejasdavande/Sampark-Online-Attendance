# 📋 Sampark — Online Attendance API

A **RESTful attendance-management backend** built with **Node.js, Express and MongoDB**, with role-based JWT authentication and interactive **Swagger / OpenAPI** documentation.

---

## 📌 Problem Statement

Community and youth organisations (here, the Hariprabodham *Gunatit Yuvak Mandal*) run regular gatherings — *sabhas* — across multiple locations and need to know **who attended which sabha, when**. Doing this on paper or in spreadsheets is slow, error-prone, hard to share between volunteers, and impossible to query ("who has a birthday this month?", "show attendance for last Sunday's Andheri sabha").

**Sampark** digitises that workflow with a single, secure API that lets organisers:

- **Manage members (bhulku)** — maintain a rich profile for every member (contact, education, family, joining date, etc.).
- **Organise sabhas** — create gatherings by name, type and location, each with a designated leader.
- **Record attendance** — mark attendees and non-attendees for a sabha on a given date, and look it up later by sabha + date.
- **Stay engaged** — query members' birthdays by day, month or range so no one is missed.
- **Control access** — sign-up/login issues JWTs, and sensitive operations are restricted to privileged roles (admin / sabhaleader / sevak).

The result is a shareable, queryable source of truth that replaces scattered manual records.

---

## ✨ Features

- 🔐 JWT auth with bcrypt-hashed passwords and **role-based access control**
- 👥 Full member (bhulku) CRUD with a detailed profile schema
- 🏛️ Sabha management with a referenced leader
- 🗓️ Attendance recording and lookup by sabha + date
- 🎂 Birthday queries by day / month / range (MongoDB aggregation)
- 🛡️ Centralised error handling with an async wrapper (no unhandled rejections)
- 📚 Interactive API docs at `/api-docs` (OpenAPI 3.0)
- ❤️ Health-check endpoint

---

## 🛠️ Tech Stack

| Layer            | Technology                     |
| ---------------- | ------------------------------ |
| Runtime          | Node.js                        |
| Web framework    | Express.js                     |
| Database         | MongoDB + Mongoose             |
| Auth             | JSON Web Tokens (JWT)          |
| Password hashing | bcrypt                         |
| Dates            | Moment.js                      |
| API docs         | swagger-ui-express (OpenAPI 3) |

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/tejasdavande/Sampark-Online-Attendance.git
cd Sampark-Online-Attendance
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Then edit `.env`:

```env
PORT=5000
PRIVATEKEY=your_long_random_secret
MONGODB_URI=mongodb://127.0.0.1:27017/sampark
```

> You need a running MongoDB — either a local instance or a MongoDB Atlas cluster.

### 3. Run

```bash
npm run dev     # auto-reload with nodemon
# or
npm start
```

You should see:

```
server is running on port 5000
📚  API docs at http://localhost:5000/api-docs
```

---

## 📚 API Documentation

Open **<http://localhost:5000/api-docs>** for interactive Swagger UI. The raw spec is at **`/openapi.json`**.

### Endpoint overview

| Method | Endpoint                     | Access  | Description                         |
| ------ | ---------------------------- | ------- | ----------------------------------- |
| POST   | `/user/signup`               | Public  | Register a new user                 |
| POST   | `/user/login`                | Public  | Log in, returns a JWT               |
| GET    | `/user`                      | Admin   | List users                          |
| GET    | `/user/:id`                  | Admin   | Get a user                          |
| DELETE | `/user/:id`                  | Admin   | Delete a user                       |
| PATCH  | `/user/newpassword/:id`      | Admin   | Reset a password                    |
| GET    | `/bhulku`                    | Token   | List members                        |
| POST   | `/bhulku`                    | Token   | Create a member                     |
| GET    | `/bhulku/:id`                | Token   | Get a member                        |
| PATCH  | `/bhulku/:id`                | Token   | Update a member                     |
| DELETE | `/bhulku/:id`                | Admin   | Delete a member                     |
| GET    | `/sabha`                     | Token   | List sabhas                         |
| POST   | `/sabha/register`            | Admin   | Create a sabha                      |
| GET    | `/sabha/:id`                 | Token   | Get a sabha                         |
| PATCH  | `/sabha/:id`                 | Admin   | Update a sabha                      |
| DELETE | `/sabha/:id`                 | Admin   | Delete a sabha                      |
| POST   | `/attendance/newattedance`   | Token   | Create attendance                   |
| GET    | `/attendance/search`         | Token   | Find attendance by sabha + date     |
| PATCH  | `/attendance/:id`            | Admin   | Update attendance by id             |
| PATCH  | `/attendance`                | Admin   | Update attendance by sabha + date   |
| DELETE | `/attendance/:id`            | Admin   | Delete attendance                   |
| GET    | `/birthday/day`              | Token   | Birthdays on a day                  |
| GET    | `/birthday/month`            | Token   | Birthdays in a month                |
| GET    | `/birthday/range`            | Token   | Birthdays in a range                |
| GET    | `/health`                    | Public  | Service health check                |

> **Token** = any valid JWT; **Admin** = JWT with role `admin` / `sabhaleader` / `sevak`.
> Send it as `Authorization: Bearer <token>`.

---

## 🗂️ Project Structure

```
Sampark-Online-Attendance/
├── common/         # db connection + async handler
├── controllers/    # request/response logic
├── docs/           # openapi.json (Swagger spec)
├── middleware/     # JWT auth, role check, error handler
├── models/         # Mongoose schemas
├── routes/         # route definitions
├── constants.js    # HTTP status constants
├── app.js          # Express app wiring
└── server.js       # HTTP server entry point
```

---

## 📝 License

ISC © Tejas Davande
