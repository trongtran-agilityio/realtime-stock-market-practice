#!/usr/bin/env bash
set -euo pipefail

# This script stops and removes local dev services started by docker compose.
# Usage: bash devops/stop-all-services.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="$SCRIPT_DIR/docker-compose.yml"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: Docker is not installed or not in PATH." >&2
  exit 1
fi

if ! command -v docker compose >/dev/null 2>&1; then
  echo "Error: Docker Compose V2 is required (docker compose)." >&2
  exit 1
fi

echo "Stopping services with $COMPOSE_FILE ..."
docker compose -f "$COMPOSE_FILE" down --remove-orphans

echo "Services stopped."
