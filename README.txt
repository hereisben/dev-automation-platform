Dev Automation Platform
Project Overview
Dev Automation Platform is a developer-focused tool that provides automation utilities for common development tasks.
The platform currently includes three core capabilities:

Screenshot Capture
API Monitoring with AI Incident Summary
AI Commit Message Generator

The project is designed to simulate a small SaaS-style backend system with asynchronous task processing using queues and workers.
The goal of the project is to practice building production-style backend architecture, including job queues, worker services, monitoring tasks, and AI-assisted developer tools.

Core Features
1. Screenshot Capture
This feature allows users to capture screenshots of web pages.
Workflow:
User submits a URL →
Backend creates a screenshot task →
Task is added to a job queue →
Screenshot worker processes the task using Puppeteer →
Screenshot image is stored and returned.
Example request:
POST /api/screenshot
Body:
{
"url": "https://example.com"
}
Response:
{
"status": "processing",
"taskId": "123"
}
Users can later retrieve the screenshot result from the dashboard.

2. API Monitor
This feature allows users to monitor API endpoints periodically.
Users can provide:

API endpoint URL
Monitoring interval

Example:
Monitor https://api.example.com/users every 10 minutes.
The system periodically checks the endpoint and stores monitoring data:

status code
response time
response snapshot

Monitoring data is saved for historical analysis.

3. AI Incident Summary
When the API monitor detects issues such as:

server errors
response structure changes
repeated failures

The system generates an AI-based summary explaining the incident.
Example AI output:
"The API started returning 500 errors at 10:42 AM.
This may indicate a backend deployment issue or a database connection problem.
Suggested action: check recent deployments or server logs."
The goal of this feature is to help developers quickly understand monitoring alerts.

4. AI Commit Message Generator
This feature generates commit messages from git diff input.
Workflow:
User pastes a git diff →
Backend sends the diff to an AI model →
AI generates a suggested commit message.
Example input:
git diff
Example output:
feat(api): add request validation middleware
This tool helps developers write clearer commit messages and maintain consistent commit history.

System Architecture
The system follows an asynchronous task processing model.
High-level architecture:
Frontend (React dashboard)
↓
Backend API (Node.js / Express)
↓
Job Queue (Redis + BullMQ)
↓
Workers

Screenshot Worker
API Monitor Worker
AI Worker

↓
Database

task history
screenshot results
monitoring logs
incident summaries


Task Processing Flow
General flow for automation tasks:
User submits request
↓
Backend validates request
↓
Task added to queue
↓
Worker processes task
↓
Result stored in database
↓
Frontend dashboard displays result

Technology Stack
Frontend
React
Vite
Tailwind CSS
Backend
Node.js
Express
Infrastructure
Redis
BullMQ
Workers
Puppeteer (screenshot capture)
Cron jobs (API monitoring)
AI Integration
LLM API for commit generation and incident summaries
Database
PostgreSQL or MongoDB
Deployment
Docker (planned)

Data Model (Simplified)
tasks

id
type
status
created_at

task_results

task_id
result
completed_at

api_monitors

id
url
interval
last_checked

monitor_logs

monitor_id
status_code
response_time
response_body
created_at

incidents

monitor_id
summary
severity
created_at


Project Goals
This project focuses on practicing real-world backend architecture concepts:

asynchronous task processing
job queues and workers
automation tools for developers
AI-assisted developer workflows
SaaS-style backend system design


Planned Development Order

Backend API setup
Redis + BullMQ queue
Screenshot worker
API monitoring system
AI commit generator
AI incident summary
React dashboard
Deployment


Future Improvements
Possible future features:

authentication system
rate limiting
alert notifications
monitoring dashboards
team collaboration
