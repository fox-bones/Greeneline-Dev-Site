/**
 * Indexes every place a skill is mentioned so the UI can answer
 * "where has this been used?" without searching on each interaction.
 */
export function buildEvidence(profile) {
  const index = new Map();
  const entry = (skill) => {
    if (!index.has(skill)) index.set(skill, { experience: [], certifications: [], projects: [] });
    return index.get(skill);
  };

  for (const role of profile.experience) {
    for (const highlight of role.highlights) {
      for (const skill of highlight.skills) {
        entry(skill).experience.push({
          roleId: role.id,
          title: role.title,
          company: role.company,
          text: highlight.text,
        });
      }
    }
  }
  for (const certification of profile.certifications) {
    for (const skill of certification.skills) entry(skill).certifications.push(certification.name);
  }
  for (const project of profile.projects) {
    for (const skill of project.skills) {
      entry(skill).projects.push({ title: project.title, url: project.repo || project.demo || '' });
    }
  }
  return index;
}
