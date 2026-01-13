#!/bin/bash
set -e

# Start the original sandbox service (web UI on 8080) in background
/opt/gem/run.sh &

cd /app
exec uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
