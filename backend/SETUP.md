# Quick Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**For MongoDB Atlas:**
Replace `MONGODB_URI` with your Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crm_db
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS (if installed via Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Or use MongoDB Atlas** (cloud-hosted, no local installation needed)

### 4. Seed Initial Data (Optional but Recommended)

```bash
npm run seed
```

This will create:
- Default users (Admin, Sales Manager, Sales Executives, etc.)
- Sample organization data
- Sample leads, accounts, contacts, deals, tasks, and campaigns

### 5. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000` (or your configured PORT).

### 6. Test the API

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Login Test:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@crm.com","password":"admin123"}'
```

## Default Credentials (After Seeding)

| Role                | Email              | Password      |
| ------------------- | ------------------ | ------------- |
| System Admin        | admin@crm.com      | admin123      |
| Sales Manager       | manager@crm.com    | manager123    |
| Sales Executive     | sarah@crm.com      | sales123      |
| Sales Executive     | mike@crm.com       | sales123      |
| Marketing Executive | emily@crm.com      | marketing123  |
| Support Executive   | david@crm.com      | support123    |

## API Base URL

```
http://localhost:5000/api
```

## Frontend Integration

Update your React frontend's API base URL to:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

Make sure CORS is configured in `.env`:
```
FRONTEND_URL=http://localhost:5173
```

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- For Atlas, verify network access settings

### Port Already in Use

Change `PORT` in `.env` to a different port (e.g., 5001)

### JWT Errors

Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set in `.env`

### Module Not Found

Run `npm install` again to ensure all dependencies are installed

## Next Steps

1. Test all API endpoints using Postman or curl
2. Integrate with your React frontend
3. Update CORS settings for production
4. Set strong JWT secrets for production
5. Configure MongoDB indexes for better performance
