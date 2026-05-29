#!/bin/bash
# deploy.sh — build & push the AIX_OT deck to amadeo.run/project-aix-ot/
#
# Static Astro deck served behind the auth gateway (same pattern as the
# dashboard). One-time registration was done with:
#   ssh apps-agora "/srv/apps/new-app.sh project-aix-ot --static"
set -euo pipefail

APP=project-aix-ot
REMOTE=apps-agora
REMOTE_DIR=/srv/apps/$APP

echo "→ Building..."
npm run build

echo "→ Syncing dist/ to $REMOTE:$REMOTE_DIR/dist/ ..."
rsync -az --delete dist/ "$REMOTE:$REMOTE_DIR/dist/"

echo ""
echo "✓ Live at amadeo.run/$APP/"
