#!/bin/bash

echo "🚀 Starting Mock Backend Server for SustainShare"
echo "=============================================="

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js to run the mock backend."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Navigate to mock-backend directory
cd mock-backend

# Install dependencies if not present
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🌐 Starting server on http://localhost:8080"
echo "📋 API endpoints will be available for frontend"
echo "🗺️  Includes Hyderabad location data"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm start
