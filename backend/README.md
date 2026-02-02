# CRM Backend API

A secure, scalable backend API for a CRM web application built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT-based authentication with refresh tokens
- 👥 Role-based access control (RBAC)
- 📊 Complete CRM modules (Leads, Contacts, Accounts, Deals, Tasks, etc.)
- 📈 Analytics and reporting
- 🔔 Real-time notifications
- 📝 Audit logging
- 🛡️ Security middleware (Helmet, CORS, Rate Limiting)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (jsonwebtoken)
- **Security:** bcryptjs, helmet, express-rate-limit
- **Validation:** express-validator

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - MongoDB connection string
   - JWT secrets
   - Port number
   - Frontend URL for CORS

3. **Start MongoDB:**
   Make sure MongoDB is running on your system or use MongoDB Atlas.

4. **Seed initial data (optional):**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (email or mobile)
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Admin/Sales Manager)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/:id` - Get lead by ID
- `POST /api/leads` - Create lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `POST /api/leads/:id/convert` - Convert lead to contact/account/deal

### Accounts
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/:id` - Get account by ID
- `POST /api/accounts` - Create account
- `PUT /api/accounts/:id` - Update account
- `DELETE /api/accounts/:id` - Delete account

### Contacts
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get contact by ID
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Deals
- `GET /api/deals` - Get all deals
- `GET /api/deals/:id` - Get deal by ID
- `POST /api/deals` - Create deal
- `PUT /api/deals/:id` - Update deal
- `DELETE /api/deals/:id` - Delete deal

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Communications
- `GET /api/communications/:entityType/:entityId` - Get communications for entity
- `POST /api/communications` - Create communication
- `PUT /api/communications/:id` - Update communication
- `DELETE /api/communications/:id` - Delete communication

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign by ID
- `POST /api/campaigns` - Create campaign (Marketing/Admin)
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

### Reports
- `GET /api/reports/sales` - Sales report
- `GET /api/reports/leads` - Leads report
- `GET /api/reports/productivity` - User productivity report
- `GET /api/reports/campaigns` - Campaign performance report

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Organization
- `GET /api/organization` - Get organization settings
- `PUT /api/organization` - Update organization (Admin only)

### Audit Logs
- `GET /api/audit-logs` - Get audit logs (Admin only)

## User Roles

| Role                | Permissions                              |
| ------------------- | ---------------------------------------- |
| System Admin        | Full CRUD access, user & role management |
| Sales Manager       | Team data, reports, deal pipelines       |
| Sales Executive     | Leads, contacts, deals, tasks            |
| Marketing Executive | Campaigns, lead sources                  |
| Support Executive   | Customer info, interactions              |
| Customer            | Read-only access to assigned data        |

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error message"
}
```

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm_db
JWT_SECRET=your-secret-key
JWT_EXPIRE=24h
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_REFRESH_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Default Credentials (After Seeding)

- **Admin:** admin@crm.com / admin123
- **Sales Manager:** manager@crm.com / manager123
- **Sales Executive:** sarah@crm.com / sales123
- **Sales Executive:** mike@crm.com / sales123
- **Marketing Executive:** emily@crm.com / marketing123
- **Support Executive:** david@crm.com / support123

## Project Structure

```
backend/
├── config/
│   ├── database.js
│   └── jwt.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── leadController.js
│   └── ...
├── middleware/
│   ├── auth.js
│   └── authorize.js
├── models/
│   ├── User.js
│   ├── Lead.js
│   └── ...
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   └── ...
├── utils/
│   ├── asyncHandler.js
│   ├── errorHandler.js
│   └── auditLogger.js
├── scripts/
│   └── seed.js
├── app.js
├── server.js
└── package.json
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Audit logging

## License

ISC
