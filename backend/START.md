# Quick Start Commands

## Option 1: Start Server Only

```bash
cd backend
npm install
npm start
```

Then manually open browser to: http://localhost:5000/health

## Option 2: Using Batch Script (Windows)

Double-click `start-and-open.bat` or run:
```bash
cd backend
start-and-open.bat
```

## Option 3: Manual Commands

### Step 1: Install Dependencies
```powershell
cd backend
$env:npm_config_offline="false"
npm install
```

### Step 2: Start Server
```powershell
npm start
```

### Step 3: Open Browser (in new terminal)
```powershell
start http://localhost:5000/health
```

## Option 4: All-in-One PowerShell Command

```powershell
cd C:\Users\Admin\OneDrive\Desktop\crm---frontend\backend; $env:npm_config_offline="false"; if (-not (Test-Path node_modules)) { npm install }; Start-Process "http://localhost:5000/health"; npm start
```

## Option 5: Using npm scripts

```bash
cd backend
npm install
npm start
```

Then in another terminal:
```bash
start http://localhost:5000/health
```

## Test Endpoints

Once server is running, test these URLs in browser:

- Health Check: http://localhost:5000/health
- API Base: http://localhost:5000/api

## Login Test (using curl or Postman)

```bash
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"admin@crm.com\",\"password\":\"admin123\"}"
```

## Seed Data (Optional)

After server starts, in another terminal:
```bash
cd backend
npm run seed
```
