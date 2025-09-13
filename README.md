# 🏪 Store Rating Platform

A full-stack web application that allows users to submit ratings for stores with role-based access control. Built with React.js frontend and Express.js backend with MySQL database.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/)
- **Git** (optional) - [Download here](https://git-scm.com/)

### Installation & Setup

1. **Clone or download the project**
   ```bash
   # If using git
   git clone <repository-url>
   cd store-rating-platform
   
   # Or extract the zip file and navigate to the folder
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up MySQL database**
   - Install MySQL on your system
   - Open MySQL Workbench or command line
   - Create database:
     ```sql
     CREATE DATABASE store_rating_platform;
     ```
   - Run the schema:
     ```bash
     mysql -u root -p store_rating_platform < server/database/schema.sql
     ```

4. **Configure environment variables**
   ```bash
   # Copy environment file
   copy server\env.example server\.env
   ```
   
   Edit `server\.env` with your MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=store_rating_platform
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   NODE_ENV=development
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔐 Default Login Credentials

### Admin Account
- **Email**: `admin@storeplatform.com`
- **Password**: `Admin123!`

### Test User Account (Create via registration)
- **Email**: `user@example.com`
- **Password**: `Password123!`

## 🎯 User Roles & Features

### 👑 System Administrator
- **Dashboard**: View statistics (total users, stores, ratings)
- **User Management**: Add, edit, delete users
- **Store Management**: Add, edit, delete stores
- **Advanced Features**: Filtering, sorting, detailed user information

### 👤 Normal User
- **Store Browsing**: View all stores with ratings
- **Search & Filter**: Find stores by name or address
- **Rating System**: Submit and modify ratings (1-5 stars)
- **Profile Management**: Update password and personal info

### 🏪 Store Owner
- **Store Dashboard**: View store statistics and ratings
- **Rating Analytics**: See who rated their store and average rating
- **Profile Management**: Update password and personal info

## 🗄️ Database Schema

### Tables Overview

| Table | Description | Key Fields |
|-------|-------------|------------|
| `users` | User accounts with roles | id, name, email, password, role, address |
| `stores` | Store information | id, name, email, address, owner_id |
| `ratings` | User ratings for stores | id, user_id, store_id, rating |

### Sample Data

The database comes pre-populated with:

#### Users Table
```sql
-- Admin user (already created)
INSERT INTO users (name, email, password, address, role) VALUES 
('System Administrator', 'admin@storeplatform.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.IjdQvOQ5eqGStBm65xTp9EW6M4f9Oe', '123 Admin Street, Admin City, AC 12345', 'admin');
```

#### Stores Table (Sample entries)
```sql
-- Sample stores (add these manually or via admin panel)
INSERT INTO stores (name, email, address, owner_id) VALUES 
('TechMart Electronics', 'techmart@example.com', '123 Technology Street, Silicon Valley, CA 94000', NULL),
('Fresh Grocery Store', 'fresh@example.com', '456 Main Street, Downtown, NY 10001', NULL),
('Fashion Boutique', 'fashion@example.com', '789 Fashion Avenue, Style District, LA 90210', NULL),
('Coffee Corner', 'coffee@example.com', '321 Brew Street, Coffee Town, Seattle, WA 98101', NULL),
('Book Haven', 'books@example.com', '654 Library Lane, Reading City, Boston, MA 02101', NULL);
```

## 🛠️ Project Structure

```
store-rating-platform/
├── 📁 server/                    # Backend API
│   ├── 📁 config/
│   │   └── database.js          # MySQL connection
│   ├── 📁 database/
│   │   └── schema.sql           # Database schema
│   ├── 📁 middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── validation.js        # Input validation
│   ├── 📁 routes/
│   │   ├── auth.js              # Login/register routes
│   │   ├── stores.js            # Store management
│   │   ├── ratings.js           # Rating system
│   │   └── admin.js             # Admin functions
│   ├── index.js                 # Server entry point
│   └── package.json
├── 📁 client/                   # React Frontend
│   ├── 📁 public/
│   ├── 📁 src/
│   │   ├── 📁 components/       # React components
│   │   ├── 📁 contexts/         # React contexts
│   │   ├── 📁 services/         # API services
│   │   ├── App.js               # Main app component
│   │   └── index.js
│   └── package.json
├── package.json                 # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `PUT /api/auth/password` - Update password
- `GET /api/auth/profile` - Get user profile

### Stores
- `GET /api/stores` - Get all stores (public)
- `GET /api/stores/:id` - Get store by ID
- `POST /api/stores` - Create store (admin only)
- `PUT /api/stores/:id` - Update store (admin only)
- `DELETE /api/stores/:id` - Delete store (admin only)

### Ratings
- `POST /api/ratings` - Submit/update rating
- `GET /api/ratings/user/:storeId` - Get user's rating for store
- `GET /api/ratings/store/:storeId` - Get all ratings for store
- `DELETE /api/ratings/:id` - Delete rating

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users with filtering
- `POST /api/admin/users` - Create user
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stores` - Get all stores with filtering

## 📋 Form Validations

- **Name**: 20-60 characters
- **Address**: Maximum 400 characters
- **Password**: 8-16 characters, must include at least one uppercase letter and one special character
- **Email**: Standard email validation

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- CORS protection
- Input validation and sanitization
- Role-based access control

## 🚨 Troubleshooting

### Common Issues

1. **MySQL connection error**
   - Check if MySQL is running
   - Verify credentials in `.env` file
   - Ensure database exists

2. **Port already in use**
   - Kill processes on ports 3000 and 5000
   - Or change ports in configuration

3. **Admin login not working**
   - Verify admin user exists in database
   - Check password hash is correct
   - Ensure role is set to 'admin'

4. **Module not found errors**
   - Run `npm run install-all` to install all dependencies
   - Check if you're in the correct directory

### Quick Fixes

```bash
# Kill processes on ports
netstat -ano | findstr :3000
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Reinstall dependencies
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json
rm -rf client/node_modules client/package-lock.json
npm run install-all
```

## 🎉 Features Showcase

- **Beautiful Landing Page** with gradient design
- **Role-based Navigation** (Admin, User, Store Owner)
- **Real-time Search & Filtering** for stores
- **Interactive Rating System** with star ratings
- **Responsive Design** for mobile and desktop
- **Modern UI/UX** with smooth animations
- **Secure Authentication** with JWT tokens
- **Comprehensive Admin Panel** with statistics

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure database is properly set up
4. Check console logs for error messages

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🚀**