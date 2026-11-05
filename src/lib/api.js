async function getJson(path, options) {
  const response = await fetch(path, options);
  if (!response.ok) throw new Error(`${path} responded with ${response.status}`);
  return response.json();
}

export const api = {
  // No custom options here. index.html preloads this exact request, and a
  // mismatched fetch would make the browser download it a second time.
  profile: () => getJson('/api/profile'),
  health: (signal) => getJson('/api/health', { signal }),
};
