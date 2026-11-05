<script>
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import X from '@lucide/svelte/icons/x';
  import { fly } from 'svelte/transition';
  import { ms } from '../motion.js';
  import { site } from '../site.svelte.js';
  import SkillChip from './SkillChip.svelte';

  const skill = $derived(site.focusedSkill);
  const record = $derived(skill ? site.evidence.get(skill) : null);
  const fullName = $derived(skill ? site.profile.glossary[skill] : null);
  const hasEvidence = $derived(
    !!record && record.experience.length + record.certifications.length + record.projects.length > 0,
  );
</script>

<div class="panel card" aria-live="polite">
  {#key skill}
    <div in:fly={{ y: 8, duration: ms(180) }}>
      {#if !skill}
        <p class="eyebrow">Skill explorer</p>
        <h3>Pick a skill to see the work behind it.</h3>
        <p class="note">Its related roles, certifications, and projects appear here. Try one of these:</p>
        <div class="picks">
          {#each site.profile.featuredSkills as pick (pick)}
            <SkillChip skill={pick} />
          {/each}
        </div>
      {:else}
        <div class="top">
          <div>
            <p class="eyebrow">Where it shows up</p>
            <h3>{skill}</h3>
            {#if fullName}<p class="full">{fullName}</p>{/if}
          </div>
          {#if site.selectedSkill}
            <button type="button" class="close" aria-label="Clear selected skill" onclick={() => site.clearSkill()}>
              <X size={16} />
            </button>
          {/if}
        </div>

        {#if hasEvidence}
          {#if record.experience.length}
            <h4>Experience</h4>
            <ul class="items">
              {#each record.experience as item (item.text)}
                <li>
                  <a href="#role-{item.roleId}">
                    <span class="where">{item.title}, {item.company}</span>
                    <span class="what">{item.text}</span>
                    <span class="jump">Go to this role <ArrowRight size={13} /></span>
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
          {#if record.certifications.length}
            <h4>Certifications</h4>
            <ul class="flat">
              {#each record.certifications as name (name)}<li>{name}</li>{/each}
            </ul>
          {/if}
          {#if record.projects.length}
            <h4>Projects</h4>
            <ul class="flat">
              {#each record.projects as project (project.title)}
                <li>
                  {#if project.url}
                    <a class="code" href={project.url} target="_blank" rel="noopener noreferrer">
                      {project.title} <ArrowUpRight size={13} />
                    </a>
                  {:else}
                    {project.title}
                  {/if}
                </li>
              {/each}
            </ul>
          {/if}
        {:else}
          <p class="note">
            This is part of my toolkit, but I haven’t written up a project for it here yet.
            <a href="#contact">Ask me about it</a>.
          </p>
        {/if}
      {/if}
    </div>
  {/key}
</div>

<style>
  .panel {
    padding: 22px;
  }

  h3 {
    margin-top: 8px;
    font-size: 22px;
    overflow-wrap: anywhere;
  }

  .full {
    margin-top: 2px;
    color: var(--muted);
    font-size: 14.5px;
  }

  .top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .close {
    display: inline-grid;
    flex: none;
    place-items: center;
    width: 32px;
    height: 32px;
    border: 1px solid var(--line-strong);
    border-radius: 8px;
    background: transparent;
    color: var(--text-2);
    transition: border-color 0.15s, color 0.15s;
  }

  .close:hover {
    border-color: var(--orange);
    color: var(--text);
  }

  .note {
    margin-top: 10px;
    color: var(--text-2);
    font-size: 15.5px;
  }

  .note a {
    color: var(--orange);
    font-weight: 550;
  }

  .picks {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-top: 16px;
  }

  h4 {
    margin-top: 20px;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .items {
    display: grid;
    gap: 8px;
    margin-top: 8px;
  }

  .items a {
    display: block;
    padding: 11px 13px;
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    text-decoration: none;
    transition: border-color 0.15s;
  }

  .items a:hover {
    border-color: var(--orange);
  }

  .where {
    display: block;
    color: var(--blue);
    font-size: 13.5px;
    font-weight: 550;
  }

  .what {
    display: block;
    margin-top: 3px;
    color: var(--text-2);
    font-size: 14.5px;
    line-height: 1.5;
  }

  .jump {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-top: 6px;
    color: var(--orange);
    font-size: 13px;
    font-weight: 550;
  }

  .code {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--blue);
    font-weight: 550;
    text-decoration: none;
  }

  .code:hover {
    text-decoration: underline;
  }

  .flat {
    display: grid;
    gap: 4px;
    margin-top: 8px;
    color: var(--text-2);
    font-size: 15px;
  }
</style>
