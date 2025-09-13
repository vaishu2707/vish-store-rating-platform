@echo off
echo ========================================
echo    Store Rating Platform Setup
echo ========================================
echo.

echo Step 1: Installing dependencies...
call npm run install-all
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Setting up environment file...
if not exist "server\.env" (
    copy "server\env.example" "server\.env"
    echo Environment file created. Please edit server\.env with your MySQL credentials.
) else (
    echo Environment file already exists.
)

echo.
echo Step 3: Database setup instructions...
echo.
echo Please follow these steps to set up MySQL database:
echo 1. Open MySQL Workbench or command line
echo 2. Create database: CREATE DATABASE store_rating_platform;
echo 3. Run schema: mysql -u root -p store_rating_platform ^< server/database/schema.sql
echo 4. Edit server\.env with your MySQL password
echo.
echo Step 4: Starting the application...
echo.
echo Starting both frontend and backend servers...
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:5000
echo.
echo Default admin login:
echo Email: admin@storeplatform.com
echo Password: Admin123!
echo.
pause
call npm run dev
