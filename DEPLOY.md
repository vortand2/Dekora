# Deploy — Dekora Clean

Everything runs on Netlify: the React site is a static build, and the contact form is a
Netlify Function that emails the owner through Resend. **No database, no separate backend
server, no other hosting accounts.**

Live at **https://dekoraclean.netlify.app** (project `dekoraclean`).

---

## Status

| Piece | State |
|---|---|
| Site build + deploy | Done — live |
| Contact form endpoint | Deployed at `/api/contact` |
| All images | Self-hosted — no third-party image CDN |
| `EMAIL_FROM_NAME`, `EMAIL_FROM_ADDRESS`, `OWNER_EMAIL` | Set on Netlify |
| **`RESEND_API_KEY`** | **Not set — the form cannot send until you add it** |
| Resend domain verification | Not done |
| Custom domain `dekoraclean.com` | Not pointed here yet (parked at Hostinger) |
| Git-triggered deploys | Working — push to `main` rebuilds and publishes |

---

## 1. Resend — the one thing blocking the form

1. Resend → Domains → Add Domain → `dekoraclean.com`.
2. Resend gives you DNS records unique to your account (a DKIM `TXT`, plus an SPF/`MX`
   pair for the sending subdomain). **DNS for this domain is at Hostinger** — add them
   there, then hit Verify. Usually propagates in minutes.
3. API Keys → create one with **Sending access**.
4. Set it on Netlify:

   ```bash
   netlify env:set RESEND_API_KEY re_your_key_here
   ```

   Then redeploy so the function picks it up: `netlify deploy --build --prod`.

> `EMAIL_FROM_ADDRESS` is already set to `no-reply@dekoraclean.com`. Until step 2 is
> verified, Resend will reject sends from that address with a 422 and the form will return
> a 502 — a visible failure, not a silent one. That is deliberate: with no database, a
> lead that fails to email is a lead that is gone, so the form must fail loudly.

## 2. Custom domain

Netlify → Domain management → add `dekoraclean.com`, then point the Hostinger DNS at
Netlify. The domain is currently a parked Hostinger placeholder, so nothing is lost by
switching it.

## 3. Auto-deploy — already working

Pushing to `main` rebuilds and publishes automatically. Verified end to end.

How it is wired, in case it ever needs rebuilding:

- Netlify clones over SSH (`ssh://git@github.com/vortand2/Dekora.git`) using a **read-only
  deploy key** registered on the GitHub repo.
- A GitHub `push` webhook calls a Netlify **build hook**.

> The generic `https://api.netlify.com/hooks/github` endpoint does **not** work for this
> site. It only serves sites connected through Netlify's GitHub app. GitHub still returns
> 204 OK and the build silently never runs — indistinguishable from a healthy webhook
> unless you check whether a deploy actually appeared.

Manual deploys still work any time:

```bash
netlify deploy --build --prod
```

## 4. Verify

Submit a real enquiry on the live site and confirm:
- the success toast appears,
- the email arrives at `OWNER_EMAIL` (check spam on the first one),
- replying to it addresses the customer, not yourself.

If the form fails, check the function log: Netlify → Logs → Functions → `contact`.

---

## Notes

- **`netlify.toml` deliberately sets no `base`.** Netlify's docs say both `publish` and
  the functions directory resolve relative to `base`, but two independent `netlify build`
  runs in a clean clone behaved asymmetrically — `publish` acted root-relative while the
  functions directory acted base-relative, giving "targets a non-existing directory" and a
  CI deploy with no contact endpoint (CLI deploys from the root kept working, hiding it).
  Treat that as an unconfirmed CLI quirk, not settled fact. With no `base` the two
  interpretations coincide, so the config is correct either way — which is why it's set up
  this way. Don't reintroduce `base` without re-testing a git-triggered build.
- **`SECRETS_SCAN_OMIT_KEYS`** is required, not cosmetic. Netlify fails a build when an
  env var's value appears in the output, and `EMAIL_FROM_NAME` is "Dekora Clean S.A.S",
  which is all over the page. `RESEND_API_KEY` is intentionally still scanned.
- **`frontend/.npmrc`** sets `legacy-peer-deps=true` and is load-bearing: eslint 9 conflicts
  with the `@typescript-eslint` 5 that react-scripts pulls in, and without it a clean
  `npm ci` fails. Don't delete it without fixing that conflict.
- **`OWNER_EMAIL` is public**, and not because of the secrets-scan exemption: it is a
  hardcoded fallback in `netlify/functions/contact.mjs` in this public repo. The scanner
  was never what protected it.
- **When verifying, check the raw HTML too, not just the JS bundle.** The social/JSON-LD
  image tags in `frontend/public/index.html` are invisible to a bundle scan — a hotlinked
  Unsplash `og:image` survived a "no third-party images" sweep that way:
  `curl -s https://dekoraclean.netlify.app | grep -oE 'https?://[^"]+' | grep -v dekoraclean`
- **Function self-check**: `node netlify/contact.test.mjs` — covers validation, HTML
  escaping, the Resend request shape, and the failure paths. Keep it passing.
- **Watch `frontend/.env` when deploying from the CLI.** It is gitignored, so it never
  shows up in a diff, but CRA reads it at build time — it still held the old emergent
  preview URL and silently baked it into the first deploy, pointing the live form at a
  dead host. It is now empty, and `REACT_APP_BACKEND_URL` is pinned to empty on Netlify so
  no local file can override a deploy again.
- **The `backend/` FastAPI app and `render.yaml` are no longer used.** They implemented the
  same form with a MongoDB record behind it. They're kept in the repo in case you ever want
  the submissions database; nothing deploys them. Safe to delete otherwise.
- The site has no dependency on emergent.sh.
