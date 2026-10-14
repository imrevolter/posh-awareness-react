# SafeCampus POSH Awareness Portal (React + SQL)

React + Node/Express + SQLite rebuild of the original static-HTML + Firebase version
(https://github.com/imrevolter/Posh_awareness_minip). Same four pages and the same
features — hero carousel, POSH Act info, ICC team, anonymous complaint form, admin
dashboard, AI chatbot — with Firestore replaced by a real SQL database and a proper
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
- **The OpenAI key is no longer shipped to the browser.** The original embedded the key
  directly in `index.html` (visible to anyone who views source). Here the frontend calls
  `/api/chat`, and only the backend holds the key, read from `server/.env`. If you don't
  set one, the chatbot replies with a message saying it isn't configured yet, instead of
  failing.
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
      chat.js            POST /chat, proxies to OpenAI server-side
    middleware/
      requireAuth.js      bearer-token check for admin routes
  data/            posh.db lives here (gitignored)

client/        React app (Vite)
  src/
    pages/           Home, Posh, Icc, Admin
    components/      Navbar, Footer, Hero, ComplaintForm, Chatbot
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

## Optional integrations

Both are optional — the app works fully without them, just with that one feature
degraded gracefully:

- **Email notifications on submit (EmailJS):** copy `client/.env.example` to
  `client/.env` and fill in your EmailJS public key, service ID, and template ID. If
  left blank, the complaint still saves to the database, it just skips the email step.
- **AI chatbot (OpenAI):** set `OPENAI_API_KEY` in `server/.env`. If left blank, the
  chatbot stays functional but replies that it isn't configured yet.

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
end. `npm run build` was run on the client to catch any JSX/import errors. Nothing here
was assumed to work without being run.
