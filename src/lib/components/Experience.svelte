<script>
  import X from '@lucide/svelte/icons/x';
  import { reveal, spotlight } from '../motion.js';
  import { site } from '../site.svelte.js';
  import SectionHead from './SectionHead.svelte';
  import SkillChip from './SkillChip.svelte';

  const roles = $derived(site.profile.experience);
  const skill = $derived(site.focusedSkill);
  const matches = $derived(skill ? (site.evidence.get(skill)?.experience.length ?? 0) : 0);

  const skillsFor = (role) => [...new Set(role.highlights.flatMap((highlight) => highlight.skills))];

  // The timeline fills in as the reader scrolls through it.
  let timeline = $state();
  let viewportHeight = $state(0);
  let fillRatio = $state(0);
  let timelineHeight = $state(0);
  let nodeOffsets = $state([]);
  let frameQueued = false;

  function measureFill() {
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const filled = Math.max(0, Math.min(rect.height, viewportHeight * 0.62 - rect.top));
    fillRatio = rect.height ? filled / rect.height : 0;
  }

  function measureLayout() {
    if (!timeline) return;
    timelineHeight = timeline.offsetHeight;
    nodeOffsets = [...timeline.querySelectorAll('li.role')].map((item) => item.offsetTop + 30);
    measureFill();
  }

  function onScroll() {
    if (frameQueued) return;
    frameQueued = true;
    requestAnimationFrame(() => {
      frameQueued = false;
      measureFill();
    });
  }

  $effect(() => {
    measureLayout();
    const observer = new ResizeObserver(measureLayout);
    observer.observe(timeline);
    return () => observer.disconnect();
  });
</script>

<svelte:window bind:innerHeight={viewportHeight} onscroll={onScroll} />

<section id="experience" class="section wrap" aria-labelledby="experience-title">
  <SectionHead
    id="experience-title"
    index="01"
    label="Experience"
    title="Where I’ve worked"
    lede="Select any skill tag to trace it through the work behind it."
  />

  <div class="trace no-print" role="status">
    <span class="prompt">trace</span>
    {#if skill}
      <strong>{skill}</strong>
      <span class="count">
        {matches === 0 ? 'no role highlights' : `${matches} ${matches === 1 ? 'highlight' : 'highlights'}`}
      </span>
      {#if site.selectedSkill}
        <button type="button" class="clear" onclick={() => site.clearSkill()}>
          Clear <X size={14} />
        </button>
      {/if}
    {:else}
      <span class="count">none selected</span>
    {/if}
  </div>

  <div class="timeline" bind:this={timeline}>
    <span class="rail no-print" aria-hidden="true">
      <span class="rail-fill" style:transform="scaleY({fillRatio})"></span>
    </span>

    <ol class="roles">
    {#each roles as role, index (role.id)}
      <li class="role" id="role-{role.id}" class:lit={fillRatio * timelineHeight >= (nodeOffsets[index] ?? Infinity)}>
        <span class="node no-print" aria-hidden="true"></span>
        <article class="card body" use:reveal use:spotlight>
          <header>
            <div>
              <h3>{role.title}</h3>
              <p class="company">{role.company}<span class="location"><span class="separator">{' · '}</span>{role.location}</span></p>
            </div>
            <p class="period">{role.period}</p>
          </header>

          <ul class="highlights">
            {#each role.highlights as highlight (highlight.text)}
              {@const match = site.matchesFocused(highlight.skills)}
              <li class:match class:dim={skill && !match}>{highlight.text}</li>
            {/each}
          </ul>

          {#if skillsFor(role).length}
            <div class="chips no-print">
              {#each skillsFor(role) as tag (tag)}
                <SkillChip skill={tag} small />
              {/each}
            </div>
          {/if}
        </article>
      </li>
    {/each}
    </ol>
  </div>
</section>

<style>
  .trace {
    position: sticky;
    top: calc(var(--nav-h) + 10px);
    z-index: 5;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 12px;
    min-height: 42px;
    margin-bottom: 18px;
    padding: 6px 12px;
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    background: color-mix(in srgb, var(--surface) 90%, transparent);
    backdrop-filter: blur(10px);
    font-family: var(--font-mono);
    font-size: 13px;
  }

  .prompt {
    color: var(--orange);
  }

  .prompt::after {
    content: ' >';
  }

  .trace strong {
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  .count {
    color: var(--muted);
  }

  .clear {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-left: auto;
    padding: 3px 8px;
    border: 1px solid var(--line-strong);
    border-radius: 6px;
    background: transparent;
    color: var(--text-2);
    font-size: 12px;
    transition: border-color 0.15s, color 0.15s;
  }

  .clear:hover {
    border-color: var(--orange);
    color: var(--text);
  }

  .timeline {
    position: relative;
    padding-left: 34px;
  }

  .roles {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }

  .rail {
    position: absolute;
    inset: 8px auto 8px 9px;
    width: 2px;
    border-radius: 2px;
    background: var(--line);
    overflow: hidden;
  }

  .rail-fill {
    display: block;
    height: 100%;
    background: linear-gradient(180deg, var(--orange-fill), var(--blue));
    transform-origin: top;
  }

  .role {
    position: relative;
    scroll-margin-top: calc(var(--nav-h) + 72px);
  }

  .node {
    position: absolute;
    top: 24px;
    left: -30px;
    width: 12px;
    height: 12px;
    border: 2px solid var(--line-strong);
    border-radius: 50%;
    background: var(--bg);
    transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
  }

  .role.lit .node {
    border-color: var(--orange-fill);
    background: var(--orange-fill);
    box-shadow: 0 0 0 5px var(--orange-soft);
  }

  .body {
    padding: clamp(18px, 3vw, 28px);
  }

  header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 6px 24px;
    margin-bottom: 16px;
  }

  h3 {
    font-size: clamp(20px, 2.6vw, 25px);
  }

  .company {
    margin-top: 4px;
    color: var(--blue);
    font-weight: 550;
  }

  .location {
    color: var(--muted);
    font-weight: 400;
  }

  .period {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.9;
  }

  .highlights {
    display: grid;
    gap: 3px;
  }

  .highlights li {
    position: relative;
    padding: 6px 10px 6px 18px;
    border-radius: 7px;
    color: var(--text-2);
    font-size: 16px;
    line-height: 1.55;
    transition: color 0.18s, background 0.18s;
  }

  .highlights li::before {
    content: '';
    position: absolute;
    top: 16px;
    left: 4px;
    width: 5px;
    height: 5px;
    border-radius: 1px;
    background: var(--line-strong);
    transition: background 0.18s, transform 0.18s;
  }

  .highlights li.dim {
    color: var(--muted);
  }

  .highlights li.match {
    background: var(--orange-soft);
    color: var(--text);
  }

  .highlights li.match::before {
    background: var(--orange);
    transform: scale(1.3);
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--line);
  }

  @media (max-width: 560px) {
    .location {
      display: block;
    }

    .separator {
      display: none;
    }

    .timeline {
      padding-left: 24px;
    }

    .rail {
      left: 4px;
    }

    .node {
      left: -25px;
    }
  }

  @media print {
    .timeline {
      padding-left: 0;
    }
  }
</style>
