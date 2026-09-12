# Welfare Database Management System

## Overview
A comprehensive database management system for NORTH KARACHUONYO WARD WELFARE CBO to manage member registration, capture registration fees, monthly payments, and welfare contributions.

## Features
- **Member Management**: Register and manage member profiles
- **Financial Tracking**: Track registration fees, monthly payments, and welfare contributions
- **Payment Management**: Record payments and generate receipts
- **Reporting & Analytics**: Generate financial and membership reports
- **User Access Control**: Role-based access control (Admin, Treasurer, Secretary, Member)
- **Dashboard**: Real-time financial overview and member statistics
- **Data Export**: Export reports to PDF and Excel
- **Notifications**: Payment reminders and system alerts

## Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Frontend**: React.js with Material-UI
- **Authentication**: JWT
- **API Documentation**: Swagger/OpenAPI

## Project Structure
```
welfare-db-system/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Database and app configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Express server entry point
│   ├── migrations/         # Database migrations
│   ├── seeds/              # Database seed data
│   ├── .env.example        # Environment variables template
│   └── package.json        # Dependencies
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── utils/          # Utility functions
│   │   ├── styles/         # Global styles
│   │   ├── App.js          # Main App component
│   │   └── index.js        # React entry point
│   ├── .env.example        # Environment variables template
│   └── package.json        # Dependencies
├── database/               # Database schemas and migrations
│   ├── schema.sql          # Initial database schema
│   └── migrations/         # Versioned migrations
├── docs/                   # Documentation
│   ├── API.md              # API documentation
│   ├── SETUP.md            # Setup instructions
│   └── USER_GUIDE.md       # User guide
└── docker-compose.yml      # Docker compose for local development
```

## Getting Started

### Prerequisites
- Node.js v14+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Mikora-prog/welfare-db-system.git
   cd welfare-db-system
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your database and app settings in .env
   npm run migrate
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Docs: http://localhost:5000/api-docs

## Default Credentials
- **Username**: admin@welfare.org
- **Password**: Admin123!

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh JWT token

### Members
- `GET /api/members` - List all members
- `GET /api/members/:id` - Get member details
- `POST /api/members` - Register new member
- `PUT /api/members/:id` - Update member
- `DELETE /api/members/:id` - Delete member

### Payments
- `GET /api/payments` - List all payments
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments` - Record payment
- `PUT /api/payments/:id` - Update payment
- `GET /api/payments/member/:memberId` - Get member payment history

### Reports
- `GET /api/reports/financial` - Financial summary report
- `GET /api/reports/members` - Member statistics report
- `GET /api/reports/payments` - Payment collection report
- `GET /api/reports/export/pdf` - Export report as PDF
- `GET /api/reports/export/excel` - Export report as Excel

### Dashboard
- `GET /api/dashboard/overview` - Dashboard overview data
- `GET /api/dashboard/metrics` - Key metrics

## Database Schema

### Main Tables
- `users` - System users with roles
- `members` - CBO members
- `payment_types` - Types of payments (registration fee, monthly, welfare)
- `payments` - Payment transactions
- `payment_receipts` - Receipt records
- `notifications` - System notifications
- `audit_logs` - Activity audit trail

## User Roles
1. **Admin** - Full system access, user management
2. **Treasurer** - Financial management, payment recording
3. **Secretary** - Member registration, reporting
4. **Member** - View own profile and payment history

## Development

### Running Tests
```bash
cd backend
npm test

cd ../frontend
npm test
```

### Building for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd ../frontend
npm run build
```

## Documentation
See the `docs/` directory for detailed documentation:
- [API Documentation](docs/API.md)
- [Setup Guide](docs/SETUP.md)
- [User Guide](docs/USER_GUIDE.md)

## Contributing
1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License
MIT License - See LICENSE file for details

## Support
For issues, questions, or suggestions, please create an issue in the GitHub repository.

## Contact
NORTH KARACHUONYO WARD WELFARE CBO
Email: info@welfare.org
