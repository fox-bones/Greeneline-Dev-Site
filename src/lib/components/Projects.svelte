<script>
  import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
  import Bluetooth from '@lucide/svelte/icons/bluetooth';
  import BookOpen from '@lucide/svelte/icons/book-open';
  import Box from '@lucide/svelte/icons/box';
  import CloudSun from '@lucide/svelte/icons/cloud-sun';
  import Cpu from '@lucide/svelte/icons/cpu';
  import Crown from '@lucide/svelte/icons/crown';
  import Gamepad2 from '@lucide/svelte/icons/gamepad-2';
  import Gauge from '@lucide/svelte/icons/gauge';
  import Globe from '@lucide/svelte/icons/globe';
  import Rocket from '@lucide/svelte/icons/rocket';
  import Router from '@lucide/svelte/icons/router';
  import Server from '@lucide/svelte/icons/server';
  import ShieldCheck from '@lucide/svelte/icons/shield-check';
  import Wrench from '@lucide/svelte/icons/wrench';
  import { flip } from 'svelte/animate';
  import { fade } from 'svelte/transition';
  import { ms, reveal, spotlight } from '../motion.js';
  import { site } from '../site.svelte.js';
  import GitHubIcon from './GitHubIcon.svelte';
  import SectionHead from './SectionHead.svelte';
  import SkillChip from './SkillChip.svelte';

  const icons = {
    archive: BookOpen,
    bluetooth: Bluetooth,
    chess: Crown,
    embedded: Cpu,
    games: Gamepad2,
    monitoring: Gauge,
    network: Router,
    rocket: Rocket,
    security: ShieldCheck,
    server: Server,
    tools: Wrench,
    weather: CloudSun,
    web: Globe,
  };

  const shield = $derived(site.profile.spotlight);
  const projects = $derived(site.profile.projects);

  let view = $state('Featured');

  const matchers = {
    Featured: (project) => project.featured,
    Tools: (project) => project.group === 'Tools',
    Web: (project) => project.group === 'Web',
    Games: (project) => project.group === 'Games',
    All: () => true,
  };
  const views = $derived(
    Object.entries(matchers).map(([name, matches]) => ({ name, count: projects.filter(matches).length })),
  );
  const visible = $derived(projects.filter(matchers[view]));
</script>

<section id="projects" class="section wrap" aria-labelledby="projects-title">
  <SectionHead
    id="projects-title"
    index="03"
    label="Projects"
    title="What I’ve built"
    lede={site.profile.projectsIntro}
  />

  <article class="card shield" use:reveal use:spotlight>
    <div class="intro">
      <div>
        <p class="eyebrow"><b>Spotlight</b> / {shield.organization}</p>
        <h3>{shield.name}</h3>
      </div>
      <div class="copy">
        <p>{shield.summary}</p>
        <p class="contribution">{shield.contribution}</p>
      </div>
    </div>

    <ol class="pipeline">
      {#each shield.pipeline as step, index (step.label)}
        <li class="step" style:--i={index}>
          <span class="number">{String(index + 1).padStart(2, '0')}</span>
          <strong>{step.label}</strong>
          <span class="detail">{step.detail}</span>
          {#if index < shield.pipeline.length - 1}
            <span class="wire no-print" aria-hidden="true"><i></i></span>
          {/if}
        </li>
      {/each}
    </ol>

    <div class="chips no-print">
      {#each shield.skills as skill (skill)}
        <SkillChip {skill} small />
      {/each}
    </div>
  </article>

  <div class="toolbar no-print" use:reveal>
    <div class="views" role="group" aria-label="Filter projects">
      {#each views as option (option.name)}
        <button type="button" class="view" aria-pressed={view === option.name} onclick={() => (view = option.name)}>
          {option.name}
          <span class="count">{option.count}</span>
        </button>
      {/each}
    </div>
    <a class="all-repos" href={site.profile.person.github} target="_blank" rel="noopener noreferrer">
      <GitHubIcon size={15} /> All repositories <ArrowUpRight size={14} />
    </a>
  </div>

  <ul class="grid no-print">
    {#each visible as project (project.title)}
      {@const Icon = icons[project.kind] ?? Box}
      <li
        class="card tile"
        class:match={site.matchesFocused(project.skills)}
        use:spotlight
        animate:flip={{ duration: ms(240) }}
        in:fade={{ duration: ms(180), delay: ms(70) }}
        out:fade={{ duration: ms(90) }}
      >
        <div class="tile-head">
          <span class="icon"><Icon size={20} /></span>
          <div class="text">
            <h3>{project.title}</h3>
            <p class="category">{project.category}</p>
          </div>
        </div>

        {#if project.description}<p class="description">{project.description}</p>{/if}

        {#if project.skills.length}
          <div class="chips tile-chips">
            {#each project.skills as skill (skill)}
              <SkillChip {skill} small />
            {/each}
          </div>
        {/if}

        {#if project.repo || project.demo}
          <div class="links">
            {#if project.repo}
              <a href={project.repo} target="_blank" rel="noopener noreferrer" aria-label="{project.title}: code on GitHub">
                <GitHubIcon size={14} /> Code <ArrowUpRight size={13} />
              </a>
            {/if}
            {#if project.demo}
              <a href={project.demo} target="_blank" rel="noopener noreferrer" aria-label="{project.title}: live demo">
                Live demo <ArrowUpRight size={13} />
              </a>
            {/if}
          </div>
        {/if}
      </li>
    {/each}
  </ul>

  <!-- The filters mean nothing on paper, so printing always lists every project. -->
  <ul class="print-list">
    {#each projects as project (project.title)}
      <li><strong>{project.title}</strong>{project.description ? `: ${project.description}` : ''}</li>
    {/each}
  </ul>
</section>

<style>
  .shield {
    padding: clamp(20px, 3.5vw, 36px);
  }

  .intro {
    display: grid;
    gap: 14px 40px;
  }

  @media (min-width: 800px) {
    .intro {
      grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
    }
  }

  .shield h3 {
    margin-top: 10px;
    font-family: var(--font-mono);
    font-size: clamp(34px, 5vw, 50px);
    font-weight: 600;
    letter-spacing: -0.03em;
    color: var(--orange);
  }

  .copy {
    color: var(--text-2);
  }

  .contribution {
    margin-top: 8px;
    color: var(--muted);
    font-size: 15.5px;
  }

  .pipeline {
    --wire: 30px;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--wire);
    margin-top: 28px;
  }

  .step {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 14px;
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-sm);
    background: var(--surface-2);
    transition: border-color 0.18s, transform 0.18s var(--ease);
  }

  .step:hover {
    border-color: var(--blue);
    transform: translateY(-2px);
  }

  .number {
    color: var(--blue);
    font-family: var(--font-mono);
    font-size: 12px;
  }

  .step strong {
    font-size: 15.5px;
    font-weight: 600;
    line-height: 1.3;
  }

  .step .detail {
    color: var(--muted);
    font-size: 13.5px;
  }

  .wire {
    position: absolute;
    top: 50%;
    left: 100%;
    width: var(--wire);
    height: 2px;
    margin-top: -1px;
    background: var(--line-strong);
  }

  .wire i {
    position: absolute;
    top: -2px;
    left: 0;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--orange-fill);
    animation: flow 1.5s linear infinite;
    animation-delay: calc(var(--i) * 0.28s);
  }

  @keyframes flow {
    from {
      left: -3px;
      opacity: 0;
    }
    20%,
    80% {
      opacity: 1;
    }
    to {
      left: calc(100% - 3px);
      opacity: 0;
    }
  }

  @keyframes flow-down {
    from {
      top: -3px;
      opacity: 0;
    }
    20%,
    80% {
      opacity: 1;
    }
    to {
      top: calc(100% - 3px);
      opacity: 0;
    }
  }

  @media (max-width: 759px) {
    .pipeline {
      --wire: 24px;
      grid-template-columns: minmax(0, 1fr);
    }

    .wire {
      top: 100%;
      left: 50%;
      width: 2px;
      height: var(--wire);
      margin: 0 0 0 -1px;
    }

    .wire i {
      top: 0;
      left: -2px;
      animation-name: flow-down;
    }
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 20px;
  }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px 20px;
    margin-top: 28px;
  }

  .views {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .view {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    min-height: 38px;
    padding: 6px 13px;
    border: 1px solid var(--line-strong);
    border-radius: var(--radius-sm);
    background: var(--surface);
    color: var(--text-2);
    font-size: 14.5px;
    font-weight: 550;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }

  .view:hover {
    border-color: var(--orange);
    color: var(--text);
  }

  .view[aria-pressed='true'] {
    border-color: var(--orange-fill);
    background: var(--orange-fill);
    color: var(--on-orange);
  }

  .count {
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 400;
  }

  .view[aria-pressed='true'] .count {
    color: var(--on-orange);
  }

  .all-repos {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--blue);
    font-size: 14.5px;
    font-weight: 550;
    text-decoration: none;
  }

  .all-repos:hover {
    text-decoration: underline;
  }

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
    gap: 14px;
    margin-top: 14px;
  }

  .tile {
    display: flex;
    flex-direction: column;
    padding: 18px;
    box-shadow: none;
    transition: border-color 0.18s, background 0.18s;
  }

  .tile.match {
    border-color: var(--orange);
    background: var(--orange-soft);
  }

  .tile-head {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .icon {
    display: inline-grid;
    flex: none;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--radius-sm);
    background: var(--orange-soft);
    color: var(--orange);
  }

  .text {
    min-width: 0;
  }

  .tile h3 {
    font-size: 17px;
    line-height: 1.3;
  }

  .category {
    margin-top: 2px;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 12.5px;
  }

  .description {
    margin-top: 12px;
    color: var(--text-2);
    font-size: 15px;
    line-height: 1.55;
  }

  .tile-chips {
    margin-top: 12px;
  }

  .links {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 16px;
    margin-top: auto;
    padding-top: 14px;
  }

  .links a {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    min-height: 26px;
    color: var(--blue);
    font-size: 14px;
    font-weight: 550;
    text-decoration: none;
  }

  .links a:hover {
    text-decoration: underline;
  }

  .print-list {
    display: none;
  }

  @media print {
    .print-list {
      display: grid;
      gap: 6pt;
      margin-top: 12pt;
    }
  }
</style>
