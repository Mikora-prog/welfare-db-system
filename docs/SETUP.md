# Setup Guide

## Prerequisites
- Node.js v14 or higher
- PostgreSQL 12 or higher
- npm or yarn
- Git

## Backend Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Mikora-prog/welfare-db-system.git
cd welfare-db-system/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env` with your database and server configuration:
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=welfare_db
DB_USER=welfare_user
DB_PASSWORD=welfare_password
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

### 4. Setup Database

#### Option A: Using Docker (Recommended)
```bash
cd ..
docker-compose up -d
```

This will:
- Start PostgreSQL server
- Start pgAdmin (http://localhost:5050)
- Create the database

#### Option B: Manual PostgreSQL Setup
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE welfare_db;
CREATE USER welfare_user WITH PASSWORD 'welfare_password';
ALTER ROLE welfare_user SET client_encoding TO 'utf8';
ALTER ROLE welfare_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE welfare_user SET default_transaction_deferrable TO on;
ALTER ROLE welfare_user SET default_transaction_read_uncommitted TO off;
GRANT ALL PRIVILEGES ON DATABASE welfare_db TO welfare_user;

# Exit psql
\q

# Run the schema
psql -U welfare_user -d welfare_db -f database/schema.sql
```

### 5. Run Migrations
```bash
cd backend
npm run migrate
```

### 6. Start the Backend Server
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

### 4. Start the Frontend
```bash
npm start
```

The application will open at `http://localhost:3000`

## Database Access

### pgAdmin Web Interface
- URL: http://localhost:5050
- Email: admin@welfare.org
- Password: admin

### Command Line Access
```bash
psql -U welfare_user -d welfare_db
```

## API Documentation

Once the server is running, API docs are available at:
```
http://localhost:5000/api-docs
```

## Default Credentials

**Admin User:**
- Email: admin@welfare.org
- Password: Admin123!

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Troubleshooting

### Database Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:** Ensure PostgreSQL is running:
```bash
# Linux/Mac
sudo systemctl start postgresql

# Using Docker
docker-compose up -d postgres
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:** Change the PORT in `.env` or kill the process using the port:
```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Module Not Found
```
Error: Cannot find module 'express'
```

**Solution:** Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use a process manager (PM2, Forever)
3. Configure HTTPS/SSL
4. Update JWT_SECRET
5. Use environment-specific database

### Frontend
1. Build the frontend: `npm run build`
2. Deploy to Netlify, Vercel, or your hosting
3. Update API_URL to production backend

## Support

For issues or questions, please create an issue in the GitHub repository.
