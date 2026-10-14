# SafeCampus POSH Awareness Portal (React + SQL)

Live now -> https://posh-awareness-react.vercel.app/

React + Node/Express + SQLite rebuild of the original static-HTML + Firebase version
(https://github.com/imrevolter/Posh_awareness_minip). Same four pages and the same
features — hero carousel, POSH Act info, ICC team, anonymous complaint form, admin
dashboard, FAQ chatbot — with Firestore replaced by a real SQL database and a proper
backend.

## What changed vs the original

- **Firestore -> SQLite.** Complaints are rows in a `complaints` table (see
  `server/src/db.js`), not Firestore documents. Uses Node's built-in `node:sqlite`
  module, so there's nothing to install or configure to get a database — it's just a
  file at `server/data/posh.db`, created automatically on first run.
- **Admin auth is now actually enforced server-side.** The original checked the admin
  password in client-side JavaScript, which meant anyone could open devtools and call
  Firestore directly, bypassing the password entirely. Here, `/api/complaints` (GET) and
  the resolve endpoint require a bearer token issued by `/api/auth/login`, checked
  server-side on every request.
- **The chatbot is a hardcoded FAQ bot, not a live OpenAI call.** The original embedded
  an OpenAI key directly in `index.html` (visible to anyone who views source) to call a
  real LLM. That's unusual for this kind of site anyway — most government/institutional
  portals use a fixed keyword-matched FAQ bot rather than a live AI, so that's what this
  is: `client/src/chatbotRules.js` matches the message against a list of POSH/ICC/complaint
  topics (word-boundary matching, so "hi" doesn't fire on "this" and "complain" doesn't
  fire on "complaint") and falls back to a generic pointer-to-ICC message if nothing
  matches. It runs entirely client-side with no network call and no key to manage, since
  there's no secret involved.
- **Five static HTML files -> one React app with client-side routing** (`react-router-dom`),
  four pages (`Home`, `Posh`, `Icc`, `Admin`), shared `Navbar`/`Footer`/`Chatbot` components.
- **The Swiper.js hero carousel was replaced** with a small custom auto-advancing
  carousel component (`Hero.jsx`) to avoid pulling in a whole carousel library for three
  slides.

## Project layout

```
server/        Express API + SQLite database
  src/
    app.js             entry point, mounts routes
    db.js               opens/creates the SQLite database and schema
    authStore.js         in-memory admin session tokens
    routes/
      complaints.js      POST (submit), GET (list, admin-only), PATCH (resolve, admin-only)
      auth.js            POST /login
    middleware/
      requireAuth.js      bearer-token check for admin routes
  data/            posh.db lives here (gitignored)

client/        React app (Vite)
  src/
    pages/           Home, Posh, Icc, Admin
    components/      Navbar, Footer, Hero, ComplaintForm, Chatbot
    chatbotRules.js   keyword -> reply table for the FAQ chatbot
    api.js            fetch wrapper for the backend
  public/images/     ICC member photos + hero slide image (copied from the original repo)
```

## Running it

Two terminals, both from this folder:

```
cd server
cp .env.example .env     # edit ADMIN_PASSWORD at minimum
npm install
npm run dev               # http://localhost:4000
```

```
cd client
npm install
npm run dev               # http://localhost:5173, proxies /api to localhost:4000
```

Open http://localhost:5173. The admin panel is at `/admin`, gated by the
`ADMIN_PASSWORD` you set in `server/.env`.

## Optional integration

**Email notifications on submit (EmailJS):** copy `client/.env.example` to
`client/.env` and fill in your EmailJS public key, service ID, and template ID. If
left blank, the complaint still saves to the database, it just skips the email step.
The chatbot needs no configuration — it's hardcoded, see above.

## Deploying it publicly

Pushing to GitHub only stores the code — it doesn't give anyone a URL. You need to
actually run both processes somewhere. The frontend is a static build (deploy anywhere
that serves static files); the backend is a long-running Node process (needs an actual
host, not a static host).

1. **Push to GitHub** (see below).
2. **Deploy `server/` to Render** (or Railway/Fly — any host that runs a persistent
   Node process): new Web Service, point it at the repo, set **Root Directory** to
   `server`, **Build Command** to `npm install`, **Start Command** to `npm start`, and
   add the `ADMIN_PASSWORD` environment variable. You'll get a URL like
   `https://your-app.onrender.com`.
3. **Deploy `client/` to Vercel or Netlify**: import the repo, set **Root Directory** to
   `client`, framework preset **Vite**, build command `npm run build`, output directory
   `dist`. Add one environment variable: `VITE_API_BASE` = `https://your-app.onrender.com/api`
   (the backend URL from step 2, with `/api` on the end). Without this, the deployed
   frontend has no dev-server proxy to fall back on and every API call 404s.
4. The Vercel URL you get back is the one-click link — that's what you share.

**Important caveat:** SQLite here is a single file on the backend host's disk. Free
tiers on most platforms (Render's free web service included) wipe the filesystem on
every redeploy and on every restart after the free instance sleeps from inactivity —
so submitted complaints will not survive long-term on a free-tier backend. Fine for a
demo you're actively showing someone; not fine if you want complaints to persist
indefinitely. If you need real persistence, either pay for a host with a persistent
disk/volume, or swap SQLite for a free hosted Postgres (Supabase/Neon both have a free
tier) — that's a backend-only change, the frontend and API shape don't move.

## Known limitation

`npm audit` flags two moderate-severity advisories in `react-router` (6.x) and the
`vite`/`esbuild` dev toolchain. Both require a breaking major-version upgrade to clear
(react-router v7, vite v6+) that hasn't been tested against this code, so they're left
as-is rather than force-upgraded blind. Neither affects a production build served
normally — the esbuild one is dev-server-only, and the react-router one needs a
crafted redirect that this app doesn't construct.

## Verified before shipping

Every backend route was exercised directly with curl (success and failure cases: missing
fields, wrong password, unauthenticated access, resolving a nonexistent complaint) and
again through the Vite dev proxy to confirm the frontend can actually reach it end to
end. `npm run build` was run on the client to catch any JSX/import errors. The chatbot's
keyword matching was run against 15 real test messages across every topic plus
adversarial cases designed to catch substring false-positives — this actually caught and
fixed three real bugs (a bare `report` keyword, `hi` matching inside "this", and
`complain` matching inside "complaint") before shipping. Nothing here was assumed to
work without being run.
