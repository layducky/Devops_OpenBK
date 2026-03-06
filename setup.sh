#!/usr/bin/env bash
set -e

if ! command -v docker >/dev/null 2>&1; then
    sudo apt update
    sudo apt install -y ca-certificates curl gnupg lsb-release
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker "$USER"
fi

docker compose pull
docker compose down -v
docker compose up -d

echo "Waiting for backend (and RDS) to be ready..."
sleep 20

echo "Seeding database..."
docker compose exec -T backend node scripts/seedAll.js || echo "Seed skipped or failed - check backend logs"

echo "Setup complete!"
