# SecureVault - MERN Security Platform

A security scanning platform built with MongoDB, Express, React, and Node.js.

## Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 6.0
- Redis >= 7.0
- Docker (optional) >= 20.10

## Quick Start

### Using Docker (Recommended)

```bash
docker-compose up -d
```

### Manual Setup

1. Start MongoDB and Redis:
```bash
mongod
redis-server
```

2. Start the backend:
```bash
cd backend
npm install
npm run dev
```

3. Start the scan worker:
```bash
cd backend
node workers/scanWorker.js
```

4. Start the frontend:
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (authenticated)

### Scans
- `POST /api/scans` - Create a new scan (authenticated)
- `GET /api/scans` - List user scans (authenticated)
- `GET /api/scans/:scanId` - Get scan details (authenticated)
- `PATCH /api/scans/:scanId/cancel` - Cancel a scan (authenticated)
- `GET /api/scans/:scanId/findings` - Get scan findings (authenticated)

## Project Structure

```
secure-vault/
├── backend/          # Express API server
├── frontend/         # React dashboard
└── docker-compose.yml
```
