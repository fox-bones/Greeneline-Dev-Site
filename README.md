# Cayce Greene: professional website

A one-page professional site with a Svelte 5 frontend and an Express 5 API, hosted on
Cloudflare Workers. It has no database and depends on no outside services.

## Run it locally

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Open <http://localhost:5173>. Nothing needs to be deployed to test the site.

`npm run dev` starts Vite. Cloudflare's Vite plugin runs the Express API inside `workerd`,
the same runtime Cloudflare uses in production, so local behavior matches the real thing.

- Editing a Svelte file updates the open page without a reload.
- Editing `server/data/profile.js` restarts the server and refreshes the page in about a second.

## Commands

| Command                | What it does                                                        |
| ---------------------- | ------------------------------------------------------------------- |
| `npm run dev`          | Development server with live updates, at <http://localhost:5173>    |
| `npm run preview`      | Builds and serves the production version, at <http://localhost:4173> |
| `npm test`             | Tests the API and checks the resume data for mistakes               |
| `npm run check:deploy` | Builds and validates the upload without publishing anything         |
| `npm run deploy`       | Runs the tests, builds, and publishes to Cloudflare                 |

## Edit the content

Everything the site says lives in one file: `server/data/profile.js`. The page, the API,
the search-engine tags, and the no-JavaScript fallback all read from it.

- **Add or edit a project:** each entry in `projects` takes a `title`, `category`, `group`
  (Tools, Web, or Games), `kind` (its icon), and `description`. Set `featured: true` to show it in
  the default view, and `repo` or `demo` to add links.
- **Connect a skill to your work:** add the skill's exact name to the `skills` array on a job
  highlight, certification, or project. It then appears in the Skills explorer. `npm test`
  catches names that do not match.
- **Show a phone number:** set `phone` in the `contact` object. It is blank on purpose.
- **Change your email or LinkedIn address:** update `contact.email` or `person.linkedin`.

## Deploy to Cloudflare

The site is configured for `greenelinedev.com` and `www.greenelinedev.com`.

```bash
npx wrangler whoami   # confirms which Cloudflare account will receive the site
npm run deploy
```

The domain must be on the Cloudflare account that Wrangler is logged in to. Cloudflare creates
the DNS records and certificates during the deploy. To use a different account, run
`npx wrangler logout` and then `npx wrangler login`.

On the free plan, static files are free and unlimited. API requests are limited to 100,000
per day. The live panel on the Contact section only polls while it is on screen, and each
visitor's page load uses one profile request.

To change the domain later, update `routes` in `wrangler.jsonc` and `siteUrl` in
`server/data/profile.js`, then redeploy.

## How it works

```text
Browser ──> Cloudflare ─┬─ /api/*          ──> Worker ──> Express (server/app.js)
                        └─ everything else ──> static files from the Vite build
```

Static files never wake the Worker, which is why they do not count against the request limit.

| Endpoint           | Purpose                                                                 |
| ------------------ | ----------------------------------------------------------------------- |
| `GET /api/profile` | All resume content. Unchanged content returns a small 304 response.     |
| `GET /api/contact` | The email address, requested only when a visitor clicks "Show email".   |
| `GET /api/health`  | Status, runtime, and data center, shown in the live panel on the page.  |

```text
server/data/profile.js   Everything the site says
server/app.js            Express routes
server/worker.js         Connects Express to Cloudflare Workers
src/App.svelte           Page layout and scroll tracking
src/lib/site.svelte.js   Shared state: the selected skill, theme, and loaded profile
src/lib/components/      One file per section or control
tools/seo-plugin.js      Builds page metadata and the no-JavaScript resume at build time
public/                  Copied as is, including security headers (_headers) and the 404 page
tests/api.test.js        API and data checks
```

The page respects reduced-motion settings, works from a keyboard, and prints as a clean resume.
