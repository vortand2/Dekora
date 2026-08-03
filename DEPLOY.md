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
| Images | Served from this repo, no external CDN |
| Contact form endpoint | Deployed at `/api/contact` |
| `EMAIL_FROM_NAME`, `EMAIL_FROM_ADDRESS`, `OWNER_EMAIL` | Set on Netlify |
| **`RESEND_API_KEY`** | **Not set — the form cannot send until you add it** |
| Resend domain verification | Not done |
| Custom domain `dekoraclean.com` | Not pointed here yet (parked at Hostinger) |
| Git-triggered deploys | Not connected — deploys are manual for now |

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

## 3. Git-triggered deploys (optional)

The site was created from the CLI, so no repo is connected — pushing to `main` does **not**
redeploy. To change that, open the project's Build & deploy settings and link the GitHub
repo. That authorises Netlify's GitHub app, so it has to be done in a browser.

Until then, deploy with:

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

- **`netlify.toml`**: `publish` is relative to the repo root, **not** to `base` — hence
  `frontend/build`. Verified against the real CLI; setting it to `build` breaks the deploy.
- **`frontend/.npmrc`** sets `legacy-peer-deps=true` and is load-bearing: eslint 9 conflicts
  with the `@typescript-eslint` 5 that react-scripts pulls in, and without it a clean
  `npm ci` fails. Don't delete it without fixing that conflict.
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
