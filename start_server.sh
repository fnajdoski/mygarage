#!/bin/bash
echo "Starting MyGarage Local Server..."
echo "Opening http://localhost:8000 in your browser..."
open http://localhost:8000
python3 -m http.server 8000
