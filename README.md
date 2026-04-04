# 🚀 Dev Automation Platform

> A full-stack SaaS platform for developer automation tools
> Built with a modern React frontend and a distributed Node.js backend using async job processing

---

## 🌐 Live Website

👉 https://dev-automation-platform.vercel.app/

---

## ✨ Features

### 🛰️ API Monitoring

- Monitor APIs with custom intervals
- Detect incidents (errors, slow responses, failures)
- Generate AI-powered summaries
- Send email alerts on status changes (UP ↔ DOWN)
- View monitoring history in dashboard

### 📸 Screenshot Capture

- Capture full-page screenshots of any website
- Process jobs asynchronously via worker queue
- Store images in AWS S3 for distributed access
- Track job status in real time

### 🤖 AI Commit Generator

- Generate structured commit messages from git diff
- Enforce conventional commit format
- Includes fallback logic for reliability

### 🔐 Authentication

- JWT-based authentication
- Per-user data isolation
- Guest login for quick access

---

## 🏗️ Architecture

```
Frontend (React + TypeScript)
        ↓
Backend API (Node.js + Express)
        ↓
Redis Queue (BullMQ)
        ↓
Worker Services
        ↓
PostgreSQL
```

### 🔑 Key Concepts

- Distributed backend with separate worker services
- Asynchronous job processing using Redis + BullMQ
- Production-safe file storage using AWS S3
- Real-time UI updates via polling
- Multi-user system with secure data isolation

---

## ⚙️ Tech Stack

### 🎨 Frontend

- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Query

### 🧠 Backend

- Node.js
- Express
- PostgreSQL
- Redis
- BullMQ
- Puppeteer

### ☁️ Infrastructure

- AWS S3
- Railway (API, workers, Redis, PostgreSQL)
- Vercel (frontend)

### 🤖 AI

- Groq API (OpenAI-compatible)

---

## 🔄 System Flow

### 📸 Screenshot Flow

```
User submits URL
→ Job added to Redis queue
→ Worker processes with Puppeteer
→ Upload to S3
→ UI polls and displays result
```

### 🛰️ Monitoring Flow

```
User creates monitor
→ Scheduled job runs
→ Worker checks API
→ Result stored in PostgreSQL
→ Incident detected + summarized
→ Email alert sent
```

---

## 🛡️ Production Considerations

- Rate limiting to prevent abuse
- Per-user quotas for monitors and jobs
- Ownership checks for secure access
- Async processing to avoid blocking API
- Fallback handling for AI failures
- Distributed storage (S3) for multi-service setup

---

## 🌍 Deployment

- Frontend → Vercel
- Backend API → Railway
- Workers → Railway
- Database → Railway PostgreSQL
- Queue → Railway Redis

---

## 📌 What I Learned

- Designing async systems with queues and workers
- Building distributed backend architecture
- Handling real production issues (CORS, worker isolation, storage)
- Integrating AI features into real applications
- Deploying and debugging fullstack systems

---

## 📎 Repository

🔗 https://github.com/hereisben/dev-automation-platform

---
