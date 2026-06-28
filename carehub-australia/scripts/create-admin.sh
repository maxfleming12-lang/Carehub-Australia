#!/usr/bin/env bash
set -euo pipefail

# One-time helper to call the admin creation endpoint.
# Prompts for ADMIN_SETUP_SECRET (hidden), email, password, and full name.

BASE_URL=${1:-http://localhost:3000}

read -s -p "ADMIN_SETUP_SECRET: " sb_secret_FVF3tGDfMQdeSJcpPQ5zlQ_8beF2Sv2
echo
read -p "Admin email: " maxfleming12@gmail.com
read -p "Admin full name: " Maxwell Fleming
read -s -p "Admin password (will not be shown): " 1388Majf!
echo

BODY=$(cat <<EOF
{
  "secret": "${sb_secret_FVF3tGDfMQdeSJcpPQ5zlQ_8beF2Sv2}",
  "email": "${maxfleming12@gmail.com}",
  "password": "${1388Majf!}",
  "fullName": "${Maxwell Fleming}"
}
EOF
)

echo "Creating admin account for ${maxfleming12@gmail.com}..."

curl --fail --silent --show-error -X POST "${BASE_URL}/api/admin/create-admin" \
  -H "Content-Type: application/json" \
  -d "${BODY}" | jq . || true

echo "Done." 
