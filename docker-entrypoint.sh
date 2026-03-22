#!/bin/sh
set -e

# Run any pending migrations before starting
node node_modules/prisma/build/index.js migrate deploy

exec node server.js
