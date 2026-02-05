# Development Setup Guide

A quick guide to get the Minato app running locally.

## Prerequisites

- Ruby 3.2.3+
- PostgreSQL
- Node.js & npm

## Installation

### 1. Clone & Install Dependencies

```bash
# Install Ruby gems
bundle install

# Install Node packages
cd client
npm install
cd ..
```

### 2. Setup Database

```bash
# Create database and run migrations
MINATO_DATABASE_USERNAME=minato MINATO_DATABASE_PASSWORD=minato bundle exec rails db:create db:migrate
```

### 3. Start Development Servers

**Terminal 1 - Rails Backend (port 3001):**
```bash
MINATO_DATABASE_USERNAME=minato MINATO_DATABASE_PASSWORD=minato bundle exec rails server -p 3001
```

**Terminal 2 - Quasar Frontend (port 9000):**
```bash
cd client
npm run dev
```

## Access the App

- **Frontend**: http://localhost:9000
- **Backend API**: http://localhost:3001

## Quick Reference

| Command | Purpose |
|---------|---------|
| `bundle install` | Install Ruby dependencies |
| `cd client && npm install` | Install JavaScript dependencies |
| `MINATO_DATABASE_USERNAME=minato MINATO_DATABASE_PASSWORD=minato bundle exec rails db:create db:migrate` | Setup database |
| `MINATO_DATABASE_USERNAME=minato MINATO_DATABASE_PASSWORD=minato bundle exec rails server -p 3001` | Start Rails |
| `cd client && npm run dev` | Start Quasar dev server |

## Notes

- Database credentials: username `minato`, password `minato`
- Environment variables can be saved in a `.env` file to avoid repeating them
