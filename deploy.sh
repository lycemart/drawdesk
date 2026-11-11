#!/usr/bin/env bash
# Deploy DrawDesk to the owner's server (nginx, static, HTTPS).
# No AWS, no registrar, no CI dependency. Rollback = re-point `current`.
set -euo pipefail

HOST="drawdesk.76-13-181-161.sslip.io"
SITE_URL="https://${HOST}"
ROOT="/srv/drawdesk"
REV="$(git rev-parse --short HEAD)"
DEST="${ROOT}/releases/${REV}"

pnpm test
pnpm typecheck
NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_SITE_URL="${SITE_URL}" pnpm build

mkdir -p "${ROOT}/releases"
rm -rf "${DEST}"
cp -a out "${DEST}"
chmod -R a+rX "${DEST}"
ln -sfn "${DEST}" "${ROOT}/current"

nginx -t
systemctl reload nginx

sleep 1
curl -fsS -o /tmp/drawdesk-deploy.html "https://${HOST}/"
grep -q "DrawDesk" /tmp/drawdesk-deploy.html
curl -fsS -o /dev/null "https://${HOST}/methodology/"
curl -fsS -o /dev/null "https://${HOST}/take-home/"

# keep the last three releases
ls -1dt "${ROOT}"/releases/* | tail -n +4 | xargs -r rm -rf

echo "deployed ${REV} to ${SITE_URL}"
echo "rollback: ln -sfn ${ROOT}/releases/<previous> ${ROOT}/current && systemctl reload nginx"
