import express from 'express';
import { contact, profile } from './data/profile.js';

function runtimeName() {
  const agent = globalThis.navigator?.userAgent ?? '';
  if (agent === 'Cloudflare-Workers') return 'Cloudflare Workers';
  if (agent.startsWith('Node.js')) return 'Node.js';
  return 'Unknown';
}

/** CF-Ray looks like "8a1b2c3d4e5f6a7b-DTW". The suffix is the data center that answered. */
function edgeLocation(req) {
  return req.get('cf-ray')?.split('-').pop() || null;
}

export function createApp() {
  const app = express();
  app.disable('x-powered-by');

  const api = express.Router();

  // public/_headers only covers static files, so API responses set their own headers.
  api.use((req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'X-Robots-Tag': 'noindex',
    });
    next();
  });

  // no-cache means "revalidate first". Unchanged content comes back as a tiny 304
  // through Express's ETag, and a redeploy shows up on the very next page load.
  api.get('/profile', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.json(profile);
  });

  // Requested only when a visitor clicks "Show email", which keeps the address
  // out of the page source where simple scrapers look.
  api.get('/contact', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json(contact);
  });

  api.get('/health', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({
      status: 'ok',
      runtime: runtimeName(),
      edge: edgeLocation(req),
      time: new Date().toISOString(),
    });
  });

  api.use((req, res) => {
    res.status(404).json({ error: 'not_found' });
  });

  app.use('/api', api);

  // Express identifies error handlers by their four arguments, so `next` must stay.
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  });

  return app;
}
