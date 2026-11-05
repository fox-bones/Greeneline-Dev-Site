<script>
  import Search from '@lucide/svelte/icons/search';
  import { flip } from 'svelte/animate';
  import { MediaQuery } from 'svelte/reactivity';
  import { fade, slide } from 'svelte/transition';
  import { ms, reveal } from '../motion.js';
  import { site } from '../site.svelte.js';
  import EvidencePanel from './EvidencePanel.svelte';
  import SectionHead from './SectionHead.svelte';
  import SkillChip from './SkillChip.svelte';

  const wide = new MediaQuery('(min-width: 900px)');

  let query = $state('');

  const groups = $derived(site.profile.skills);
  const total = $derived(groups.reduce((sum, group) => sum + group.items.length, 0));
  const needle = $derived(query.trim().toLowerCase());

  function matchesQuery(skill) {
    if (!needle) return true;
    const fullName = site.profile.glossary[skill] ?? '';
    return skill.toLowerCase().includes(needle) || fullName.toLowerCase().includes(needle);
  }

  const visibleGroups = $derived(
    groups
      .map((group) => ({ name: group.group, items: group.items.filter(matchesQuery) }))
      .filter((group) => group.items.length > 0),
  );
  const visibleCount = $derived(visibleGroups.reduce((sum, group) => sum + group.items.length, 0));

  /** On narrow screens the details open right under the group that holds the skill. */
  const inlinePanelGroup = $derived(
    !wide.current && site.selectedSkill
      ? visibleGroups.find((group) => group.items.includes(site.selectedSkill))?.name
      : null,
  );

  function onSearchKey(event) {
    if (event.key === 'Enter' && visibleGroups.length) {
      site.selectSkill(visibleGroups[0].items[0]);
    }
  }
</script>

<section id="skills" class="section wrap" aria-labelledby="skills-title">
  <SectionHead
    id="skills-title"
    index="02"
    label="Skills"
    title="What I work with"
    lede="Filter the list, or select a skill to see where it has been put to work."
  />

  <div class="explorer">
    <div class="list" use:reveal>
      <label class="search no-print">
        <Search size={17} />
        <span class="sr-only">Filter skills</span>
        <input type="search" placeholder="Filter skills, for example sql" bind:value={query} onkeydown={onSearchKey} />
        <span class="count" aria-live="polite">{visibleCount} of {total}</span>
      </label>

      {#each visibleGroups as group (group.name)}
        <div class="group" transition:slide={{ duration: ms(200) }}>
          <h3>{group.name}</h3>
          <div class="chips">
            {#each group.items as skill (skill)}
              <span class="chip-slot" animate:flip={{ duration: ms(220) }} transition:fade={{ duration: ms(120) }}>
                <SkillChip {skill} />
              </span>
            {/each}
          </div>
          {#if inlinePanelGroup === group.name}
            <div
              class="inline-panel"
              transition:slide={{ duration: ms(220) }}
              onintroend={(event) => event.currentTarget.scrollIntoView({ block: 'nearest' })}
            >
              <EvidencePanel />
            </div>
          {/if}
        </div>
      {:else}
        <p class="empty">No skills match “{query.trim()}”. <a href="#contact">Ask me about it</a> instead.</p>
      {/each}
    </div>

    {#if wide.current}
      <aside class="side no-print" use:reveal={{ delay: 80 }}>
        <EvidencePanel />
      </aside>
    {/if}
  </div>
</section>

<style>
  .explorer {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    align-items: start;
  }

  @media (min-width: 900px) {
    .explorer {
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
      gap: 40px;
    }

    .side {
      position: sticky;
      top: calc(var(--nav-h) + 20px);
      max-height: calc(100svh - var(--nav-h) - 40px);
      overflow-y: auto;
      border-radius: var(--radius);
    }
  }

  .search {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 14px;
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-sm);
    background: var(--surface);
    color: var(--muted);
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .search:focus-within {
    border-color: var(--orange);
    box-shadow: 0 0 0 3px var(--orange-soft);
  }

  input {
    flex: 1;
    min-width: 0;
    height: 46px;
    border: 0;
    outline: 0;
    background: transparent;
    color: var(--text);
    font-size: 16px;
  }

  input::placeholder {
    color: var(--muted);
  }

  .count {
    flex: none;
    font-family: var(--font-mono);
    font-size: 12.5px;
  }

  .group {
    padding-top: 22px;
  }

  h3 {
    margin-bottom: 10px;
    color: var(--text-2);
    font-size: 14.5px;
    font-weight: 550;
    letter-spacing: 0;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  }

  .chip-slot {
    display: inline-flex;
    max-width: 100%;
  }

  .inline-panel {
    padding-top: 14px;
  }

  .empty {
    padding-top: 22px;
    color: var(--text-2);
  }

  .empty a {
    color: var(--orange);
    font-weight: 550;
  }
</style>
