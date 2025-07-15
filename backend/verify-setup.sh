#!/bin/bash

echo "🔍 Backend Setup Verification"
echo "=============================="

# Check if Java is installed
echo "Checking Java installation..."
if command -v java &> /dev/null; then
    java -version
    echo "✅ Java is installed"
else
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

# Check if Maven wrapper exists
if [ -f "./mvnw" ]; then
    echo "✅ Maven wrapper found"
    chmod +x mvnw
else
    echo "❌ Maven wrapper not found"
    exit 1
fi

# Check if port 8080 is available
echo "Checking if port 8080 is available..."
if lsof -Pi :8080 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 8080 is already in use. Please stop the service using port 8080."
    lsof -Pi :8080 -sTCP:LISTEN
else
    echo "✅ Port 8080 is available"
fi

# Test Maven setup
echo "Testing Maven setup..."
if ./mvnw --version &> /dev/null; then
    echo "✅ Maven wrapper is working"
else
    echo "❌ Maven wrapper failed. Check Java installation."
    exit 1
fi

echo ""
echo "🚀 Ready to start backend server!"
echo "Run: ./mvnw spring-boot:run"
echo ""
echo "Frontend will connect to: http://localhost:8080"
echo "H2 Console available at: http://localhost:8080/h2-console"
