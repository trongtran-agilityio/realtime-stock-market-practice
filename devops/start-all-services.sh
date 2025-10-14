#!/usr/bin/env bash
set -euo pipefail

# This script starts all local dev services (MongoDB, etc.) using Docker Compose.
# Usage: bash devops/start-all-services.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load optional env overrides from devops/.env if present
if [ -f "$SCRIPT_DIR/.env" ]; then
  echo "Loading env from devops/.env"
  export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs -d '\n')
fi

COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker is not installed or not in PATH." >&2
  exit 1
fi

if ! command -v docker compose >/dev/null 2>&1; then
  echo "Error: Docker Compose V2 is required (docker compose)." >&2
  exit 1
fi

echo "Starting services with $COMPOSE_FILE ..."
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

echo "Services are starting. Useful URLs:"
echo "- MongoDB: mongodb://appuser:apppass@localhost:27017 (authSource=admin)"
echo "- Mongo Express: http://localhost:8081 (if included)"
