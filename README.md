# EchoRoom 🌱

### Structured Experimentation & Community Learning Platform

EchoRoom is an open-source platform that transforms community ideas into **structured experiments, measurable outcomes, and documented reflections**.

It is not an idea board.
It is a **learning system**.

Instead of stopping at discussion or voting, EchoRoom enforces a lifecycle:

> **Idea → Experiment → Outcome → Reflection → Shared Knowledge**

Every step exists to ensure communities don’t just propose — they **test, measure, and learn**.

---

## 🚀 What Makes EchoRoom Different

Most platforms:

* Collect ideas
* Allow discussion
* Maybe allow voting
* Stop there

EchoRoom enforces:

* 🔁 Structured state transitions (no skipping steps)
* 📊 Measurable experimentation
* 🧠 Mandatory reflection before closure
* 🧾 Documented learning archive
* ⚙️ Domain validation & lifecycle control

This makes EchoRoom suitable for:

* Campus initiatives
* Open-source communities
* Startup experimentation logs
* Civic innovation groups
* Product validation workflows

---

## 🧠 The Learning Lifecycle

Every idea progresses through a controlled state chain:

```
draft → proposed → experiment → outcome → reflection
```

Each transition is intentional.

* **Idea** – A structured proposal
* **Experiment** – A time-bound, testable implementation
* **Outcome** – Recorded results (success / failure / mixed)
* **Reflection** – Structured analysis of what was learned
* **Shared Knowledge** – Public documentation for future reuse

See full walkthrough:
📄 `docs/workflow.md`

---

## 🛡 System Guarantees

EchoRoom is built with domain constraints, not just CRUD forms.

### Backend Guarantees

* Enforced state transitions
* Optimistic locking (version-based updates)
* Experiment progress derived from status
* Deletion constraints (experiments cannot be removed if outcomes exist)
* Structured reflection validation (required fields, bounded score ranges)
* JWT authentication (access + persisted refresh tokens)
* Health endpoint for service observability (`GET /health`)

See:

* 📄 `docs/architecture.md`
* 📄 `docs/health.md`
* 📄 API documentation inside `/docs`

---

## 🏗 Architecture Overview

### Frontend

* Next.js 16
* Tailwind CSS
* Radix UI
* Framer Motion
* TypeScript

### Backend

* Express + TypeScript
* REST API architecture
* Prisma (MongoDB persistence for auth)
* JWT authentication (access + refresh tokens)

### Current Persistence Model

* Persistent: Users, refresh tokens (MongoDB via Prisma)
* Domain entities (ideas, experiments, outcomes, reflections): in-memory (planned migration to full persistence)

This design allows rapid iteration while domain rules stabilize.

---

## 📂 Repository Structure

```
echoroom/
├── frontend/          # Next.js application
├── backend/           # Express API (TypeScript)
├── docs/              # System documentation
│   ├── architecture.md
│   ├── workflow.md
│   ├── moderation.md
│   ├── user-roles.md
│   ├── health.md
│   └── README.md
├── ROADMAP.md
├── CONTRIBUTING.md
└── README.md
```

---

## 🔌 API Overview

Base URL (local):

```
http://localhost:5000
```

Core route groups:

* `/auth`
* `/ideas`
* `/experiments`
* `/outcomes`
* `/reflections`
* `/ideas/:ideaId/comments`
* `/health`

Full endpoint documentation:
📄 See `/docs` folder

---

## ⚙️ Local Development Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/R3ACTR/EchoRoom-Community-Ideas-Experiments-Reflection-Platform.git
cd echoroom
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
npm run dev
```

If using Prisma:

```bash
npm run prisma:push
```

Backend runs at:

```
http://localhost:5000
```

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

## 🔐 Authentication

* JWT access token (short-lived)
* Refresh token persisted in database
* Auth middleware available
* Role/permission system scaffolded (expansion planned)

---

## 📚 Documentation

Documentation is a **first-class contribution area**.

Key documents:

* 🏗 `docs/architecture.md` – Backend design & layering
* 🔄 `docs/workflow.md` – Idea → Reflection lifecycle
* 🧠 `docs/data-structures.md` – Experiment & reflection schemas
* 🛡 `docs/moderation.md` – Community safety guidelines
* 👥 `docs/user-roles.md` – Role design
* ❤️ `docs/health.md` – Health endpoint details

---

## 🧭 Roadmap

Upcoming milestones:

* Full domain persistence via Prisma
* Consistent authentication enforcement across all domain routes
* Role-based access control
* Insights engine activation
* Version history for experiments
* Moderation tooling
* Experiment templates
* Analytics & replication metrics

See `ROADMAP.md` for details.

---

## 🤝 Contributing

EchoRoom welcomes:

* Frontend engineers
* Backend engineers
* System designers
* Documentation writers
* UX thinkers
* Moderation designers
* QA testers

Before contributing:

* Read `CONTRIBUTING.md`
* Review `ROADMAP.md`
* Follow Code of Conduct

For OSQ-specific rules:
See `OSQ.md`

---

## 🌍 Philosophy

EchoRoom is built on a simple belief:

> Communities improve when they document not just what worked — but what didn’t.

Failure is not hidden.
It is structured, analyzed, and shared.

Small experiments + honest reflection = lasting collective intelligence.

---

## Status

Active development
Open to contributors
Designed for iteration

---

## Built For Open Source Quest (OSQ)

EchoRoom is part of OSQ and structured to allow meaningful contributions across engineering, documentation, UX, and moderation domains.

---