#!/usr/bin/env bash
# Local deploy without GitHub: build and sync to Webhostone.
# Usage: SSH_USER=... SSH_HOST=... ./deploy.sh   (or set them in .deploy.env)
set -euo pipefail

cd "$(dirname "$0")"
[ -f .deploy.env ] && source .deploy.env

: "${SSH_USER:?SSH_USER fehlt (z.B. in .deploy.env)}"
: "${SSH_HOST:?SSH_HOST fehlt (z.B. in .deploy.env)}"
SSH_PORT="${SSH_PORT:-22}"
REMOTE_DIR="${REMOTE_DIR:-/home/www/freudenau/subfotos}"

# Start from an empty public/ so deleted photos are also removed on the server
rm -rf public
hugo --gc --minify

rsync -rlvz --checksum --delete \
  -e "ssh -p ${SSH_PORT}" \
  public/ "${SSH_USER}@${SSH_HOST}:${REMOTE_DIR}/"

echo "Fertig: https://fotos.freudenau.de/"
