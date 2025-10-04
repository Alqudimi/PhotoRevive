#!/bin/bash

# Start Python FastAPI server in the background
cd server
python3 photo_api.py &
PYTHON_PID=$!
cd ..

# Start Node.js server
npm run dev &
NODE_PID=$!

# Trap SIGINT and SIGTERM to kill both processes
trap "kill $PYTHON_PID $NODE_PID; exit" SIGINT SIGTERM

# Wait for both processes
wait
