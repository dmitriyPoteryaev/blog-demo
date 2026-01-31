#!/usr/bin/env bash
set -euo pipefail

BASE="http://localhost:8090"
COOKIES="cookies.txt"

log() { echo -e "\n=== $* ==="; }

# unique user per run
TS="$(date +%s)"
RAND="$(openssl rand -hex 3 2>/dev/null || echo $RANDOM)"
EMAIL="smoke_${TS}_${RAND}@test.com"
NAME="Smoke ${TS}"
PASS="password"

# curl wrapper: always sends cookies; optionally saves cookies (-c)
req() {
  local save="${1:-0}"
  shift || true

  curl -sS -i \
    -b "$COOKIES" \
    $([ "$save" = "1" ] && echo -c "$COOKIES") \
    -H "Accept: application/json" \
    "$@"
}

refresh_xsrf() {
  local xsrf
  xsrf="$(grep -E $'\tXSRF-TOKEN\t' "$COOKIES" | tail -n 1 | awk '{print $7}' || true)"
  if [[ -z "${xsrf:-}" ]]; then
    XSRF_DECODED=""
    return 0
  fi

  XSRF_DECODED="$(python3 - <<PY
import urllib.parse
print(urllib.parse.unquote("""$xsrf"""))
PY
)"
}

csrf_bootstrap() {
  log "GET /sanctum/csrf-cookie"
  rm -f "$COOKIES"
  curl -sS -i -c "$COOKIES" "$BASE/sanctum/csrf-cookie" >/dev/null
  refresh_xsrf
}

# ---------------------------
# RUN
# ---------------------------

echo "Using NEW user:"
echo "  EMAIL=$EMAIL"
echo "  PASS=$PASS"

csrf_bootstrap

log "POST /api/auth/register (expect 201)"
REG_RES="$(req 1 \
  -H "X-XSRF-TOKEN: $XSRF_DECODED" \
  -H "Content-Type: application/json" \
  -X POST "$BASE/api/auth/register" \
  --data "{\"name\":\"$NAME\",\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")"

echo "$REG_RES" | head -n 80
refresh_xsrf

# quick assert: must be 201
echo "$REG_RES" | head -n 1 | grep -q "201" || {
  echo "❌ register did not return 201"
  exit 1
}

log "POST /api/auth/login (expect 200)"
LOGIN_RES="$(req 1 \
  -H "X-XSRF-TOKEN: $XSRF_DECODED" \
  -H "Content-Type: application/json" \
  -X POST "$BASE/api/auth/login" \
  --data "{\"email\":\"$EMAIL\",\"password\":\"$PASS\"}")"

echo "$LOGIN_RES" | head -n 80
refresh_xsrf

echo "$LOGIN_RES" | head -n 1 | grep -q "200" || {
  echo "❌ login did not return 200"
  exit 1
}

log "GET /api/auth/me (expect 200)"
ME_RES="$(req 1 \
  -H "X-XSRF-TOKEN: $XSRF_DECODED" \
  "$BASE/api/auth/me")"

echo "$ME_RES" | head -n 80
refresh_xsrf

echo "$ME_RES" | head -n 1 | grep -q "200" || {
  echo "❌ me did not return 200"
  exit 1
}

log "POST /api/auth/logout (expect 200)"
LOGOUT_RES="$(req 1 \
  -H "X-XSRF-TOKEN: $XSRF_DECODED" \
  -X POST "$BASE/api/auth/logout")"

echo "$LOGOUT_RES" | head -n 60
refresh_xsrf

echo "$LOGOUT_RES" | head -n 1 | grep -q "200" || {
  echo "❌ logout did not return 200"
  exit 1
}

log "GET /api/auth/me after logout (expect 401)"
ME2_RES="$(req 1 \
  -H "X-XSRF-TOKEN: $XSRF_DECODED" \
  "$BASE/api/auth/me" || true)"

echo "$ME2_RES" | head -n 80

# here we expect 401; if your route returns 200 null instead, adjust this check
echo "$ME2_RES" | head -n 1 | grep -q "401" || {
  echo "⚠️ after logout /auth/me was not 401 (check your backend behavior)"
}

echo -e "\n✅ Auth smoke test (NEW user) finished"
