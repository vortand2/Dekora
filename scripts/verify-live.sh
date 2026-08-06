#!/usr/bin/env bash
# One-shot health check for the live site. Run after any DNS or env-var change:
#   ./scripts/verify-live.sh
#
# By default this sends NO email. The contact form delivers straight to the client
# owner's real inbox, so a check that ran a real submission would put a fake enquiry
# there every time it ran. To prove Resend delivery end to end, opt in explicitly:
#   VERIFY_SEND_LIVE=1 ./scripts/verify-live.sh
#
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
A_RECORDS=$(dig +short A "$APEX" | grep '^[0-9]' || true)
COUNT=$(printf '%s' "$A_RECORDS" | grep -c '^[0-9]' || true)
COUNT=${COUNT:-0}
AMBIGUOUS=0

if [ "$COUNT" -eq 0 ]; then
  bad "$APEX has no A record"
elif [ "$COUNT" -gt 1 ]; then
  # Multiple A records have no guaranteed order: visitors and caches land on different
  # ones, so the old parking IP would still serve part of the traffic. Never report a
  # single resolved address as OK here - which one we happened to see is a coin flip.
  AMBIGUOUS=1
  bad "$APEX has $COUNT A records - edit the existing one, don't add alongside:"
  printf '%s\n' "$A_RECORDS" | sed 's/^/          /'
elif [ "$A_RECORDS" = "$NETLIFY_APEX_IP" ]; then
  ok "$APEX -> $A_RECORDS (Netlify)"
else
  todo "$APEX -> $A_RECORDS (not Netlify; expected $NETLIFY_APEX_IP)"
fi

WWW=$(dig +short CNAME "www.$APEX" | tail -1)
case "${WWW%.}" in
  "$NETLIFY_HOST") ok "www -> $WWW" ;;
  "")              todo "www has no CNAME" ;;
  *)               todo "www -> $WWW (expected $NETLIFY_HOST)" ;;
esac

echo "── Site ────────────────────────────────────────"
N=$(code "https://$NETLIFY_HOST")
[ "$N" = 200 ] && ok "https://$NETLIFY_HOST -> 200" || bad "https://$NETLIFY_HOST -> $N"

if [ "$AMBIGUOUS" = 1 ]; then
  todo "skipping $APEX checks - DNS is ambiguous, curl may resolve either record"
elif [ "$A_RECORDS" = "$NETLIFY_APEX_IP" ]; then
  A=$(code "https://$APEX")
  # A 200 alone isn't proof: the parking page returns 200 too. Check it's our page.
  if [ "$A" = 200 ] && curl -s --max-time 20 "https://$APEX" | grep -q "Dekora Clean S.A.S"; then
    ok "https://$APEX -> 200 and serving the site (cert is live)"
  elif [ "$A" = 200 ]; then
    bad "https://$APEX -> 200 but not our page (parking page still being served?)"
  else
    bad "https://$APEX -> $A (DNS points here; cert may still be issuing)"
  fi
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

# Honeypot submission: the handler returns 200 and drops it before contacting Resend,
# so this proves the route and handler are alive without sending anything.
[ "$(code -X POST "$BASE/api/contact" -H 'Content-Type: application/json' \
     -d '{"name":"A","email":"a@b.co","phone":"1","website":"bot"}')" = 200 ] \
  && ok "handler reachable (honeypot path, no email sent)" || bad "handler did not answer honeypot with 200"

# Config state without sending: ask Netlify whether the key exists, if the CLI is linked.
if command -v netlify >/dev/null 2>&1 && netlify env:list </dev/null >/dev/null 2>&1; then
  if netlify env:list --plain </dev/null 2>/dev/null | grep -q '^RESEND_API_KEY='; then
    ok "RESEND_API_KEY is set on Netlify"
  else
    todo "RESEND_API_KEY not set - the form returns 500 and sends nothing"
  fi
else
  todo "RESEND_API_KEY state unknown (netlify CLI not linked here)"
fi

if [ "${VERIFY_SEND_LIVE:-0}" = "1" ]; then
  printf "  \033[33m!!\033[0m    VERIFY_SEND_LIVE=1 - sending a REAL enquiry to the owner's inbox\n"
  LIVE=$(code -X POST "$BASE/api/contact" -H 'Content-Type: application/json' \
          -d '{"name":"Verify Script","email":"verify@example.com","phone":"000","message":"Automated delivery check - please ignore."}')
  case "$LIVE" in
    200) ok  "real submission accepted (200) - check the owner inbox" ;;
    500) todo "RESEND_API_KEY not set - nothing sent" ;;
    502) bad "Resend rejected the send (502) - is the domain verified?" ;;
    *)   bad "unexpected status $LIVE" ;;
  esac
else
  todo "delivery not proven - run VERIFY_SEND_LIVE=1 $0 to send one real test email"
fi

echo "── Third-party images ──────────────────────────"
EXT=$(curl -s --max-time 20 "https://$NETLIFY_HOST" | grep -oE 'https?://[^"'"'"' ]+' \
      | grep -vE "dekoraclean|schema\.org|wa\.me" | sort -u)
[ -z "$EXT" ] && ok "no third-party hosts in HTML" || { bad "external hosts in HTML:"; echo "$EXT" | sed 's/^/          /'; }

echo
[ "$FAILED" = 0 ] && echo "No failures. TODO items are waiting on you." || echo "Failures above need fixing."
exit $FAILED
