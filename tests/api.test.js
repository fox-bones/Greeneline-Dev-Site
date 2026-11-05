import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';
import { createApp } from '../server/app.js';
import { contact, profile } from '../server/data/profile.js';

describe('API', () => {
  let server;
  let base;

  before(async () => {
    server = createApp().listen(0);
    await new Promise((resolve) => server.once('listening', resolve));
    base = `http://127.0.0.1:${server.address().port}`;
  });

  after(() => server.close());

  it('serves the profile under the new name', async () => {
    const res = await fetch(`${base}/api/profile`);
    const body = await res.json();
    assert.equal(res.status, 200);
    assert.equal(body.person.name, 'Cayce Greene');
    assert.equal(res.headers.get('cache-control'), 'no-cache');
  });

  it('revalidates the profile with a 304 when nothing changed', async () => {
    const first = await fetch(`${base}/api/profile`);
    await first.arrayBuffer();
    // Without an explicit Cache-Control, fetch adds "no-cache" whenever If-None-Match
    // is set by hand, and that tells the server to skip the 304. Browsers revalidating
    // from their own cache do not send it, so this mirrors what they do.
    const second = await fetch(`${base}/api/profile`, {
      headers: { 'if-none-match': first.headers.get('etag'), 'cache-control': 'max-age=0' },
    });
    assert.equal(second.status, 304);
  });

  it('keeps contact details out of the profile payload', async () => {
    const text = await (await fetch(`${base}/api/profile`)).text();
    assert.ok(!text.includes(contact.email), 'email leaked into /api/profile');
    assert.ok(!/\d{3}-\d{3}-\d{4}/.test(text), 'a phone number leaked into /api/profile');
  });

  it('serves contact details without allowing caching', async () => {
    const res = await fetch(`${base}/api/contact`);
    const body = await res.json();
    assert.equal(body.email, contact.email);
    assert.equal(res.headers.get('cache-control'), 'no-store');
    assert.equal(res.headers.get('x-robots-tag'), 'noindex');
  });

  it('reports health and reads the edge location from CF-Ray', async () => {
    const local = await (await fetch(`${base}/api/health`)).json();
    assert.equal(local.status, 'ok');
    assert.equal(local.edge, null);
    assert.equal(local.runtime, 'Node.js');

    const edge = await fetch(`${base}/api/health`, { headers: { 'cf-ray': '8a1b2c3d4e5f6a7b-DTW' } });
    assert.equal((await edge.json()).edge, 'DTW');
    assert.equal(edge.headers.get('cache-control'), 'no-store');
  });

  it('answers unknown API routes with JSON 404s', async () => {
    const res = await fetch(`${base}/api/nope`);
    assert.equal(res.status, 404);
    assert.deepEqual(await res.json(), { error: 'not_found' });
  });

  it('does not advertise Express', async () => {
    const res = await fetch(`${base}/api/health`);
    await res.arrayBuffer();
    assert.equal(res.headers.get('x-powered-by'), null);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  });
});

describe('profile data', () => {
  const known = new Set(profile.skills.flatMap((group) => group.items));
  const references = [
    ...profile.experience.flatMap((role) => role.highlights.flatMap((item) => item.skills)),
    ...profile.certifications.flatMap((item) => item.skills),
    ...profile.projects.flatMap((item) => item.skills),
    ...profile.spotlight.skills,
    ...profile.focus.map((item) => item.skill),
    ...profile.featuredSkills,
  ];

  it('only references skills that exist in the skills list', () => {
    const unknown = [...new Set(references)].filter((skill) => !known.has(skill));
    assert.deepEqual(unknown, []);
  });

  it('gives every project a valid group, unique title, and working link format', () => {
    const titles = profile.projects.map((project) => project.title);
    assert.equal(new Set(titles).size, titles.length);
    for (const project of profile.projects) {
      assert.ok(['Tools', 'Web', 'Games'].includes(project.group), `${project.title} has an unknown group`);
      for (const url of [project.repo, project.demo]) {
        if (url) assert.match(url, /^https:\/\//, `${project.title} has a bad link`);
      }
    }
    assert.ok(profile.projects.some((project) => project.featured), 'no featured projects');
  });

  it('points at the permanent domain', () => {
    assert.equal(profile.siteUrl, 'https://greenelinedev.com');
  });

  it('gives every role a unique id', () => {
    const ids = profile.experience.map((role) => role.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it('lists each skill only once', () => {
    const all = profile.skills.flatMap((group) => group.items);
    assert.equal(new Set(all).size, all.length);
  });
});
