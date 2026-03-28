#!/bin/bash

# AI Career Soft Skills Coach - Development Runner
# This script runs both backend and frontend development servers

echo "🚀 Starting AI Career Soft Skills Coach Development Environment"
echo "============================================================"

# Check if we're in the correct directory
if [ ! -f "package.json" ] || [ ! -f "DEVELOPMENT_PROGRESS.md" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🗄️ Generating Prisma client..."
npm run db:generate

echo "🌱 Running database seed..."
npm run db:seed

echo "🏗️ Building backend..."
npm run build

echo "🎨 Starting development servers..."
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup INT TERM

# Start backend server in background
npm run dev &
BACKEND_PID=$!

# Start frontend server in background
npm run dev:frontend &
FRONTEND_PID=$!

# Wait for background processes
wait