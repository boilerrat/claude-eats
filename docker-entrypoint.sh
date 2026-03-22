#!/bin/sh
set -e

# Run any pending migrations before starting
npx prisma migrate deploy

exec node server.js
