#!/usr/bin/env bash
# One-shot health check for the live site. Run after any DNS or env-var change:
#   ./scripts/verify-live.sh
# Exits non-zero if anything that should be working isn't.

set -uo pipefail

APEX="dekoraclean.com"
NETLIFY_HOST="dekoraclean.netlify.app"
NETLIFY_APEX_IP="75.2.60.5"
FAILED=0

ok()   { printf "  \033[32mOK\033[0m    %s\n" "$1"; }
bad()  { printf "  \033[31mFAIL\033[0m  %s\n" "$1"; FAILED=1; }
todo() { printf "  \033[33mTODO\033[0m  %s\n" "$1"; }

code() { curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$@" 2>/dev/null || echo 000; }

echo "── DNS ─────────────────────────────────────────"
APEX_IP=$(dig +short A "$APEX" | tail -1)
if [ "$APEX_IP" = "$NETLIFY_APEX_IP" ]; then
  ok "$APEX -> $APEX_IP (Netlify)"
elif [ -z "$APEX_IP" ]; then
  bad "$APEX has no A record"
else
  todo "$APEX -> $APEX_IP (not Netlify; expected $NETLIFY_APEX_IP)"
fi

# More than one A record means the old parking IP was left in place alongside the new
# one - the site would then load only some of the time, which is worse than plainly broken.
COUNT=$(dig +short A "$APEX" | grep -c '^[0-9]')
[ "$COUNT" -gt 1 ] && bad "$APEX has $COUNT A records - remove the old one, don't add alongside"

WWW=$(dig +short CNAME "www.$APEX" | tail -1)
case "$WWW" in
  "$NETLIFY_HOST".) ok "www -> $WWW" ;;
  "")               todo "www has no CNAME" ;;
  *)                todo "www -> $WWW (expected $NETLIFY_HOST.)" ;;
esac

echo "── Site ────────────────────────────────────────"
N=$(code "https://$NETLIFY_HOST")
[ "$N" = 200 ] && ok "https://$NETLIFY_HOST -> 200" || bad "https://$NETLIFY_HOST -> $N"

if [ "$APEX_IP" = "$NETLIFY_APEX_IP" ]; then
  A=$(code "https://$APEX")
  [ "$A" = 200 ] && ok "https://$APEX -> 200 (cert is live)" \
                 || bad "https://$APEX -> $A (DNS points here; cert may still be issuing)"
  R=$(curl -s -o /dev/null -w '%{redirect_url}' --max-time 20 "https://www.$APEX" 2>/dev/null)
  case "$R" in *"$APEX"*) ok "www redirects -> $R" ;; *) todo "www redirect: ${R:-none yet}" ;; esac
else
  todo "skipping $APEX checks until DNS points at Netlify"
fi

echo "── Contact form ────────────────────────────────"
BASE="https://$NETLIFY_HOST"
[ "$(code -X GET "$BASE/api/contact")" = 405 ] && ok "GET rejected (405)" || bad "GET should be 405"
[ "$(code -X POST "$BASE/api/contact" -H 'Content-Type: application/json' -d '{"name":"A","email":"bad","phone":"1"}')" = 422 ] \
  && ok "invalid email rejected (422)" || bad "invalid email should be 422"

LIVE=$(code -X POST "$BASE/api/contact" -H 'Content-Type: application/json' \
        -d '{"name":"Verify Script","email":"verify@example.com","phone":"000"}')
case "$LIVE" in
  200) ok  "submission accepted (200) - email is being sent" ;;
  500) todo "RESEND_API_KEY not set - form returns 500, no email is sent" ;;
  502) bad "Resend rejected the send (502) - check domain verification in Resend" ;;
  *)   bad "unexpected status $LIVE" ;;
esac

echo "── Third-party images ──────────────────────────"
EXT=$(curl -s --max-time 20 "https://$NETLIFY_HOST" | grep -oE 'https?://[^"'"'"' ]+' \
      | grep -vE "dekoraclean|schema\.org|wa\.me" | sort -u)
[ -z "$EXT" ] && ok "no third-party hosts in HTML" || { bad "external hosts in HTML:"; echo "$EXT" | sed 's/^/          /'; }

echo
[ "$FAILED" = 0 ] && echo "No failures. TODO items are waiting on you." || echo "Failures above need fixing."
exit $FAILED
