#!/bin/sh
set -e

export DATABASE_URL="${DATABASE_URL:-file:/data/db.sqlite}"

# Run any pending migrations before starting
./node_modules/.bin/prisma migrate deploy

exec node server.js
