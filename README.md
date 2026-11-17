# **TaskForge**

### Description

A full stack application for personal task management. Users register, sign in, and
organize tasks across TODO / In Progress / Done columns with priority levels.

- JWT authentication with httpOnly refresh tokens
- Task CRUD with status and priority
- PostgreSQL + Prisma ORM
- Dockerized (frontend, backend, database)

```bash
A practice project to deep into NestJS backend development. Built as a Kanban-style task board with JWT authentication, Prisma ORM, and a React frontend.
```

---

### Prerequisites

- **Docker**

---

### Getting Started

1. Clone the repository

```bash
git clone https://github.com/MEDABIBA/TaskForge && cd TaskForge
```

2. Set up environment variables

```bash
cp .env .env.axample
```

3. Start the Docker

```bash
docker compose up --build
```

---

### 👷Project Structure

```
TaskForge/
├── frontend/          # React 18, Vite
│   ├── src/
│   │   ├── api/           # HTTP-client (fetch + auto-refresh)
│   │   ├── components/    # TaskCard, TaskColumn, CreateTaskModal
│   │   ├── context/       # AuthContext (JWT state)
│   │   ├── pages/         # Login, Register, Board
│   │   ├── styles.css
│   │   └── App.jsx
│   ├── Dockerfile
│   └── vite.config.js
├── backend/           # NestJS, Prisma, JWT
│   ├── src/
│   │   ├── auth/          # Register, Login, Refresh, Logout
│   │   ├── tasks/         # CRUD
│   │   ├── users/         # GET /me
│   │   ├── prisma/        # PrismaService + schema
│   │   ├── helpers/       # Token generation
│   │   └── dto/
│   ├── Dockerfile
│   └── prisma.config.ts
├── docker-compose.yml
├── .env.example
└── .gitignore
```
