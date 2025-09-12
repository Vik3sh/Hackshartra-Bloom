#!/bin/bash

# Environmental Education Platform Setup Script
echo "🌱 Setting up Environmental Education Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create environment files if they don't exist
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cp env.example .env.local
    echo "⚠️  Please update .env.local with your actual credentials"
fi

if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend/.env file..."
    cp backend/env.example backend/.env
    echo "⚠️  Please update backend/.env with your actual credentials"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update .env.local with your Supabase and Firebase credentials"
echo "2. Update backend/.env with your backend credentials"
echo "3. Set up your Supabase and Firebase projects"
echo "4. Run 'npm run dev' to start the frontend"
echo "5. Run 'cd backend && npm run dev' to start the backend"
echo ""
echo "🔗 Useful URLs:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:3001"
echo "- Auth Example: http://localhost:5173/auth-example"
echo ""
echo "📚 Check README.md for detailed setup instructions"
