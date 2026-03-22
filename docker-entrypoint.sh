#!/bin/sh
set -e

# Run any pending migrations before starting
prisma migrate deploy

exec node server.js
