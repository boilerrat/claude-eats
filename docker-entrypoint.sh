#!/bin/sh
set -e

# Run any pending migrations before starting
node_modules/.bin/prisma migrate deploy

exec node server.js
