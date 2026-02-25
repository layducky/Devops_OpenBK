#!/usr/bin/env bash
set -e

if ! command -v docker >/dev/null 2>&1; then
    sudo apt update
    sudo apt install -y ca-certificates curl gnupg lsb-release
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker "$USER"
fi

docker compose pull
docker compose up -d

echo "Waiting for database to be ready..."
sleep 15

echo "Seeding database..."
docker compose exec -T backend node scripts/seedAll.js

echo "Setup complete!"
