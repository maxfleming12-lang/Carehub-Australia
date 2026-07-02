#!/usr/bin/env bash
set -euo pipefail

# One-time helper to call the admin creation endpoint.
# Prompts for ADMIN_SETUP_SECRET (hidden), email, password, and full name.

BASE_URL=${1:-http://localhost:3000}

read -s -p "ADMIN_SETUP_SECRET: " SECRET
echo
read -p "Admin email: " EMAIL
read -p "Admin full name: " FULLNAME
read -s -p "Admin password (will not be shown): " PASSWORD
echo

BODY=$(cat <<EOF
{
  "secret": "${SECRET}",
  "email": "${EMAIL}",
  "password": "${PASSWORD}",
  "fullName": "${FULLNAME}"
}
EOF
)

echo "Creating admin account for ${EMAIL}..."

curl --fail --silent --show-error -X POST "${BASE_URL}/api/admin/create-admin" \
  -H "Content-Type: application/json" \
  -d "${BODY}" | jq . || true

echo "Done." 
