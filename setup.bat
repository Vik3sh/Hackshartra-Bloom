@echo off
echo 🌱 Setting up Environmental Education Platform...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..

REM Create environment files if they don't exist
if not exist ".env.local" (
    echo 📝 Creating .env.local file...
    copy env.example .env.local
    echo ⚠️  Please update .env.local with your actual credentials
)

if not exist "backend\.env" (
    echo 📝 Creating backend\.env file...
    copy backend\env.example backend\.env
    echo ⚠️  Please update backend\.env with your actual credentials
)

echo.
echo 🎉 Setup complete!
echo.
echo 📋 Next steps:
echo 1. Update .env.local with your Supabase and Firebase credentials
echo 2. Update backend\.env with your backend credentials
echo 3. Set up your Supabase and Firebase projects
echo 4. Run 'npm run dev' to start the frontend
echo 5. Run 'cd backend && npm run dev' to start the backend
echo.
echo 🔗 Useful URLs:
echo - Frontend: http://localhost:5173
echo - Backend API: http://localhost:3001
echo - Auth Example: http://localhost:5173/auth-example
echo.
echo 📚 Check README.md for detailed setup instructions
pause
