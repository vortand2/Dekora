# Deploy — Dekora Clean

Everything runs on Vercel: the React site is a static build, and the contact form is a
Vercel Edge Function that emails the owner through Resend. **No database, no separate
backend server, no other hosting accounts.**

Live at **https://dekoraclean.vercel.app** (project `dekoraclean`, org `vortand2s-projects`).

> **Migrated from Netlify 2026-08-08.** The Netlify site (`loquacious-kataifi-51dc35`)
> still exists and still builds on push, but nothing points DNS at it anymore — its
> attempt to claim `dekoraclean.com` was blocked by an orphaned domain-uniqueness record
> from an earlier deleted Netlify site, with no self-service API fix available (support
> ticket was explicitly ruled out). Vercel's domain claim on `dekoraclean.com` is clean.
> `netlify.toml` and `netlify/functions/contact.mjs` are left in the repo as a reference/
> fallback; they are not part of the live path. `frontend/api/contact.js` is the live
> function — same validation/escaping/Resend logic, same Web `Request`/`Response`
> contract, just under Vercel's Edge runtime (`export const config = { runtime: "edge" }`).

---

## Status

| Piece | State |
|---|---|
| Site build + deploy | Done — live on Vercel |
| Contact form endpoint | Deployed at `/api/contact` (Vercel Edge Function) |
| All images | Self-hosted — no third-party image CDN |
| `EMAIL_FROM_NAME`, `EMAIL_FROM_ADDRESS`, `OWNER_EMAIL`, `CI=false` | Set on Vercel (Production; `CI` also on Preview/Development) |
| **`RESEND_API_KEY`** | **Not set — the form cannot send until you add it** |
| Resend domain verification | Not done |
| Custom domain `dekoraclean.com` + `www` | Registered on Vercel — awaiting the DNS change at Hostinger |
| Git-triggered deploys | Working — push to `main` rebuilds and publishes (verified live with a real push) |

---

## 0. One trip to Hostinger covers everything

Both remaining items — the domain and email delivery — need DNS records at **Hostinger**
(hPanel → Domains → DNS Zone). Do Resend's step 1 *first* so you can enter every record in
a single visit:

| Type | Name | Value | For |
|---|---|---|---|
| `A` | `@` | `76.76.21.21` | the website (**edit** the existing `2.57.91.91` record) |
| `A` | `www` | `76.76.21.21` | www (Vercel's own recommended record for this domain — see note below) |
| `TXT` + `MX` | *(given by Resend)* | *(given by Resend)* | email delivery |

> **Edit the existing `A` record — do not add a second one.** DNS round-robins between
> multiple `A` records, so leaving `2.57.91.91` in place makes the site load the parking
> page part of the time. That is harder to diagnose than a site that is plainly down.
>
> **`www` also uses an `A` record, not a `CNAME`.** Vercel's own domain-inspect output for
> this exact project recommended `A www.dekoraclean.com 76.76.21.21` over the usual
> `CNAME → cname.vercel-dns.com` pattern — both work, this is what Vercel itself suggested,
> so it's what's documented here. If a `CNAME` record for `www` already exists at
> Hostinger, delete it before adding this `A` record (can't have both).

Then check everything at once:

```bash
./scripts/verify-live.sh
```

(the script still has the old Netlify hostname/IP baked in — update `NETLIFY_HOST` /
`NETLIFY_APEX_IP` to `dekoraclean.vercel.app` / `76.76.21.21` before relying on it, or just
run the `curl`/`dig` checks in section 2 by hand.)

## 1. Resend — the one thing blocking the form

1. Resend → Domains → Add Domain → `dekoraclean.com`.
2. Resend gives you DNS records unique to your account (a DKIM `TXT`, plus an SPF/`MX`
   pair for the sending subdomain). **DNS for this domain is at Hostinger** — add them
   there, then hit Verify. Usually propagates in minutes.
3. API Keys → create one with **Sending access**.
4. Set it on Vercel:

   ```bash
   cd frontend && vercel env add RESEND_API_KEY production
   ```

   Then redeploy so the function picks it up: `vercel --prod` (from `frontend/`), or just
   push to `main` — git-triggered deploys are wired up.

> `EMAIL_FROM_ADDRESS` is already set to `no-reply@dekoraclean.com`. Until the domain is
> verified, Resend rejects sends from that address and the form returns 502 — a visible
> failure, not a silent one. That is deliberate: with no database, a lead that fails to
> email is a lead that is gone, so the form must fail loudly.
>
> There is **no shortcut around verification.** Resend's shared `onboarding@resend.dev`
> sender only delivers to the address the Resend account was registered with, and returns
> 403 for anyone else — so it cannot receive customer enquiries.
> See https://resend.com/docs/knowledge-base/403-error-resend-dev-domain

## 2. Custom domain — Vercel side done, DNS change is yours

`dekoraclean.com` and `www.dekoraclean.com` are both already registered on the Vercel
project (`vercel domains add`, confirmed clean — no conflicting claim like the old Netlify
one). All that's left is repointing DNS at **Hostinger** (hPanel → Domains → DNS /
Nameservers → DNS Zone):

| Type | Name | Current value | Change to |
|---|---|---|---|
| `A` | `@` | `2.57.91.91` (Hostinger parking) | `76.76.21.21` |
| `A` | `www` | *(whatever it is now — delete if `CNAME`)* | `76.76.21.21` |

`76.76.21.21` is what `vercel domains inspect dekoraclean.com` and
`vercel domains inspect www.dekoraclean.com` both returned directly for this project — not
copied from memory, and it's Vercel's own recommended record over the alternative
nameserver-delegation option.

The domain currently has **no MX records**, so it carries no email and this change breaks
nothing. If you ever add email on this domain, leave the MX records alone when editing.

Once DNS propagates, Vercel provisions a Let's Encrypt certificate automatically — no
action needed. Check progress with:

```bash
dig +short A dekoraclean.com && curl -sI https://dekoraclean.com | head -1
```

Expect `76.76.21.21` and `HTTP/2 200`. Propagation is usually minutes but can take hours.
You'll also get a Vercel email once the domain verifies.

> Until this is done the site's social preview stays broken: `og:image` points at
> `https://dekoraclean.com/images/hero-bg.jpg`, which only resolves once the domain is live.

## 3. Auto-deploy — already working

Pushing to `main` rebuilds and publishes automatically — verified end to end with a real
push (commit `ae39f48`) that triggered a build and re-aliased production without any
manual step.

How it is wired, in case it ever needs rebuilding:

- The Vercel project is connected to `github.com/vortand2/Dekora` via `vercel git connect`
  (GitHub App, not a manual deploy key/webhook — simpler than the Netlify setup this
  replaced).
- **Root Directory is set to `frontend`** on the Vercel project (`rootDirectory: "frontend"`
  via the Vercel API, since the CLI has no flag for it) — required because the repo root
  isn't the app root. Without it, git-triggered builds look for `package.json` in the wrong
  place and fail.

Manual deploys still work any time:

```bash
cd frontend && vercel --prod
```

## 4. Verify

Submit a real enquiry on the live site and confirm:
- the success toast appears,
- the email arrives at `OWNER_EMAIL` (check spam on the first one),
- replying to it addresses the customer, not yourself.

If the form fails, check the function log: Vercel dashboard → project `dekoraclean` →
Logs (or `vercel logs dekoraclean.vercel.app`).

---

## Notes

- **Why Vercel and not Netlify, despite the Netlify site being fully built and working**:
  a Netlify site deleted before this project started (`dekoraclean.netlify.app`, id
  `55d36de8-...`) left an orphaned domain-uniqueness record on `dekoraclean.com` /
  `www.dekoraclean.com`. Every attempt to attach either domain to the new Netlify site
  (`74e9e9d9-...`, `loquacious-kataifi-51dc35`) returned `422 Unprocessable Entity` —
  tried `custom_domain` alone, `domain_aliases` alone, `www` alone, a fresh DNS zone, and
  an account-level domain field check; none exposed a fix. No API-level undelete/restore
  exists for the old site either. The only listed options were: wait for an unknown async
  cleanup, file a support ticket, or move host — support was explicitly ruled out, so this
  migrated to Vercel instead, whose domain claim on this exact domain came back clean.
  The Netlify project (and `netlify.toml` / `netlify/functions/contact.mjs`) is left in
  place as a working fallback, not deleted.
- **Vercel Root Directory = `frontend`** (set via API, `rootDirectory` field — no CLI flag
  exists for it) because the repo root isn't the app root. Get this wrong and git-triggered
  builds fail looking for `package.json` at the repo root.
- **`frontend/api/contact.js` runs as an Edge Function** (`export const config = { runtime:
  "edge" }`), not a Node serverless function — it reuses the exact validation/escaping/
  Resend-call code from the Netlify version because both platforms hand the handler a Web
  `Request` and expect a Web `Response` back. `netlify/functions/contact.mjs` is the
  original; keep the two in sync if the form logic ever changes, or delete the Netlify one
  once the migration is confirmed permanent.
- **`frontend/.npmrc`** sets `legacy-peer-deps=true` and is load-bearing: eslint 9 conflicts
  with the `@typescript-eslint` 5 that react-scripts pulls in, and without it a clean
  `npm ci` fails. Don't delete it without fixing that conflict. (This bit Netlify the same
  way it would bite Vercel — kept for both.)
- **`OWNER_EMAIL` is public**, not just exempted from a secrets scanner: it's a hardcoded
  fallback in both `contact.js` and `contact.mjs`, in this public repo.
- **When verifying, check the raw HTML too, not just the JS bundle.** The social/JSON-LD
  image tags in `frontend/public/index.html` are invisible to a bundle scan — a hotlinked
  Unsplash `og:image` survived a "no third-party images" sweep that way:
  `curl -s https://dekoraclean.vercel.app | grep -oE 'https?://[^"]+' | grep -v dekoraclean`
- **Function self-check**: `node netlify/contact.test.mjs` — covers validation, HTML
  escaping, the Resend request shape, and the failure paths. It exercises the shared logic
  both `contact.mjs` and `contact.js` are built from; keep it passing.
- **Watch `frontend/.env` when deploying from the CLI.** It is gitignored, so it never
  shows up in a diff, but CRA reads it at build time — it once held a dead emergent
  preview URL and silently baked it into a deploy. It is now empty, and
  `REACT_APP_BACKEND_URL` is unset on Vercel (the code defaults to `""` either way) so no
  local file can override a deploy again.
- **`CI=false` is set on Vercel** (Production, Preview, and Development) for the same
  reason it was needed on Netlify: CRA/craco treats warnings as build-failing errors when
  `CI` is truthy, and Vercel sets `CI=1` by default.
- **The `backend/` FastAPI app and `render.yaml` are no longer used.** They implemented the
  same form with a MongoDB record behind it. They're kept in the repo in case you ever want
  the submissions database; nothing deploys them. Safe to delete otherwise.
- The site has no dependency on emergent.sh.
