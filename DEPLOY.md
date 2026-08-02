# Deploy — Dekora Clean

Backend on Render, frontend on Netlify, database on MongoDB Atlas, email via Resend.
Both hosts read config from this repo (`render.yaml`, `netlify.toml`), so the only manual
work is creating accounts and pasting environment variables.

Do the steps in order — the frontend needs the backend's URL before it can build.

---

## 1. MongoDB Atlas

1. Create a free M0 cluster.
2. Database Access → add a user, save the password.
3. **Network Access → allow `0.0.0.0/0`.** Render's free tier has no static outbound IP,
   so an IP allowlist will silently block every connection.
4. Copy the connection string (`mongodb+srv://...`) → this is `MONGO_URL`.

## 2. Resend

1. Sign up, then Domains → Add Domain → `dekoraclean.com`.
2. Resend generates DNS records unique to your account (one DKIM `TXT`, an SPF/`MX` pair
   for the sending subdomain). Add them at whoever hosts the DNS for dekoraclean.com,
   then hit Verify. Propagation is usually minutes.
3. API Keys → create one with **Sending access** → this is `RESEND_API_KEY`.

> Do not skip the domain verification. Without it you can only send from
> `onboarding@resend.dev`, which Resend delivers **only to your own signup address** —
> client leads then vanish with a logged 422 and no visible error on the site.

## 3. Render (backend)

1. New → Blueprint → connect this repo. It reads `render.yaml` and creates
   `dekoraclean-api` automatically.
2. Set the environment variables (dashboard, not the repo):

   | Variable | Value |
   |---|---|
   | `MONGO_URL` | Atlas connection string from step 1 |
   | `DB_NAME` | `dekoraclean` |
   | `CORS_ORIGINS` | fill in after step 4 |
   | `RESEND_API_KEY` | key from step 2 |
   | `EMAIL_FROM_ADDRESS` | `no-reply@dekoraclean.com` |
   | `EMAIL_FROM_NAME` | `Dekora Clean S.A.S` |
   | `OWNER_EMAIL` | where quote requests should land |

3. Deploy, then confirm `https://<your-service>.onrender.com/api/` returns
   `{"message":"Dekora Clean API"}`.

> Free tier sleeps after ~15 min idle, so the first form submit after a quiet period takes
> ~30s to respond. Upgrade to a paid instance if that's not acceptable.

## 4. Netlify (frontend)

1. Add new site → import this repo. It reads `netlify.toml` (base `frontend`,
   publish `frontend/build`).
2. Site settings → Environment variables → `REACT_APP_BACKEND_URL` =
   the Render URL from step 3, no trailing slash.
3. Deploy, then add `dekoraclean.com` under Domain management and point the DNS at Netlify.

> `REACT_APP_BACKEND_URL` is compiled into the JS bundle at build time, not read at
> runtime. Changing it later requires a redeploy, not just a restart.

## 5. Close the loop

1. Back in Render, set `CORS_ORIGINS` to your live origins, comma-separated, no spaces:
   `https://dekoraclean.com,https://www.dekoraclean.com,https://<site>.netlify.app`
   Redeploy the backend.
2. Submit a real test enquiry on the live site. Confirm:
   - the success message appears,
   - the email arrives at `OWNER_EMAIL` (check spam on the first one),
   - replying to that email addresses the customer, not yourself.

If the form succeeds but no email arrives, the submission is still saved — email failures
are non-fatal by design. Check the Render logs for `Email send failed`.

---

## Notes

- `backend/.env.example` lists the same variables for local development.
- Never commit a real `.env`; only `.env.example` is tracked.
- The site no longer depends on emergent.sh for images or email. The one remaining
  reference, `@emergentbase/visual-edits` in `frontend/package.json`, is a build-time
  editing plugin that is already guarded — the build succeeds without it.
