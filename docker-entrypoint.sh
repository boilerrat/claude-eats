#!/bin/sh
set -e

# Ensure DATABASE_URL is set, default to production path
export DATABASE_URL="${DATABASE_URL:-file:/data/db.sqlite}"

# Run any pending migrations before starting
prisma migrate deploy

exec node server.js
