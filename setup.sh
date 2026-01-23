#!/usr/bin/env bash
set -e

# Kiểm tra và cài đặt Docker (giữ nguyên logic cũ của bạn)
if ! command -v docker >/dev/null 2>&1; then
    sudo apt update
    sudo apt install -y ca-certificates curl gnupg lsb-release
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker "$USER"
fi

# Logic tạo file .env từ biến môi trường
echo "--- Generating .env files ---"

# 1. File .env (DB)
cat <<EOF > .env
DB_USER=$DB_USER
DB_PASS=$DB_PASS
DB_NAME=$DB_NAME
DB_PORT=$DB_PORT
EOF

# 2. File .env.be
cat <<EOF > .env.be
PORT=$BE_PORT
DB_DIALECT=$BE_DB_DIALECT
DB_URL=$BE_DB_URL
FE_ORIGIN=$BE_FE_ORIGIN
ACCESS_TOKEN_SECRET=$BE_ACCESS_TOKEN_SECRET
ACCESS_TOKEN_LIFETIME=$BE_ACCESS_TOKEN_LIFETIME
DB_USER=$DB_USER
DB_PASS=$DB_PASS
DB_NAME=$DB_NAME
DB_PORT=$DB_PORT
EOF

# 3. File .env.fe
cat <<EOF > .env.fe
NEXTAUTH_SECRET=$FE_NEXTAUTH_SECRET
NEXTAUTH_URL=$FE_NEXTAUTH_URL
NEXT_PUBLIC_GOOGLE_CLIENT_ID=$FE_NEXT_PUBLIC_GOOGLE_CLIENT_ID
NEXT_PUBLIC_GOOGLE_CLIENT_SECRET=$FE_NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
EOF

echo "--- Deploying Containers ---"
docker compose pull
docker compose up -d