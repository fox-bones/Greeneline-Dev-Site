import { profile } from '../server/data/profile.js';

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function structuredData() {
  const { person, education, skills } = profile;
  const [city, region] = person.location.split(', ');
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    jobTitle: person.title,
    description: person.metaDescription,
    address: { '@type': 'PostalAddress', addressLocality: city, addressRegion: region },
    sameAs: [person.linkedin, person.github],
    alumniOf: education.map((item) => ({ '@type': 'CollegeOrUniversity', name: item.school })),
    knowsAbout: skills.flatMap((group) => group.items),
    ...(profile.siteUrl ? { url: profile.siteUrl } : {}),
  };
  // "<" is escaped so the JSON can never close its surrounding script tag.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** A readable plain-HTML resume for visitors and crawlers that do not run JavaScript. */
function noscriptResume() {
  const { person, experience, skills, education, certifications, projects } = profile;
  const list = (items) => `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
  return [
    '<div class="noscript-resume">',
    `<h1>${escapeHtml(person.name)}</h1>`,
    `<p>${escapeHtml(person.title)}, ${escapeHtml(person.location)}</p>`,
    ...person.summary.map((text) => `<p>${escapeHtml(text)}</p>`),
    `<p><a href="${escapeHtml(person.linkedin)}">LinkedIn profile</a> and <a href="${escapeHtml(person.github)}">GitHub</a></p>`,
    '<h2>Experience</h2>',
    ...experience.map(
      (role) =>
        `<h3>${escapeHtml(role.title)}</h3><p>${escapeHtml(role.company)}, ${escapeHtml(role.location)}. ${escapeHtml(role.period)}</p>` +
        list(role.highlights.map((item) => item.text)),
    ),
    '<h2>Skills</h2>',
    ...skills.map((group) => `<p><strong>${escapeHtml(group.group)}:</strong> ${escapeHtml(group.items.join(', '))}</p>`),
    '<h2>Education</h2>',
    list(education.map((item) => [`${item.credential}, ${item.school}, ${item.date}.`, item.detail].filter(Boolean).join(' '))),
    '<h2>Certifications</h2>',
    list(certifications.map((item) => item.name)),
    '<h2>Projects</h2>',
    list(projects.map((item) => (item.description ? `${item.title}: ${item.description}` : item.title))),
    '</div>',
  ].join('');
}

/** Builds the title, metadata, and fallback content in index.html from the profile data. */
export function seoPlugin() {
  return {
    name: 'profile-seo',
    transformIndexHtml() {
      const { person, siteUrl } = profile;
      const title = `${person.name} | ${person.title}`;
      const meta = (attrs) => ({ tag: 'meta', attrs, injectTo: 'head' });
      const [firstName, ...rest] = person.name.split(' ');

      return [
        // Runs before first paint so the page never flashes the wrong theme.
        { tag: 'script', attrs: { src: '/theme-init.js' }, injectTo: 'head-prepend' },
        { tag: 'title', children: escapeHtml(title), injectTo: 'head' },
        meta({ name: 'description', content: person.metaDescription }),
        meta({ name: 'author', content: person.name }),
        meta({ property: 'og:type', content: 'profile' }),
        meta({ property: 'og:title', content: title }),
        meta({ property: 'og:description', content: person.metaDescription }),
        meta({ property: 'profile:first_name', content: firstName }),
        meta({ property: 'profile:last_name', content: rest.join(' ') }),
        meta({ name: 'twitter:title', content: title }),
        meta({ name: 'twitter:description', content: person.metaDescription }),
        ...(siteUrl
          ? [
              { tag: 'link', attrs: { rel: 'canonical', href: siteUrl }, injectTo: 'head' },
              meta({ property: 'og:url', content: siteUrl }),
              meta({ property: 'og:image', content: `${siteUrl}/og.png` }),
              meta({ property: 'og:image:width', content: '1200' }),
              meta({ property: 'og:image:height', content: '630' }),
              meta({ name: 'twitter:card', content: 'summary_large_image' }),
              meta({ name: 'twitter:image', content: `${siteUrl}/og.png` }),
            ]
          : []),
        { tag: 'script', attrs: { type: 'application/ld+json' }, children: structuredData(), injectTo: 'head' },
        { tag: 'noscript', children: noscriptResume(), injectTo: 'body' },
      ];
    },
  };
}
