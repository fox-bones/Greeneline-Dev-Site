<script>
  import ArrowDown from '@lucide/svelte/icons/arrow-down';
  import { MediaQuery } from 'svelte/reactivity';
  import { site } from '../site.svelte.js';
  import GitHubIcon from './GitHubIcon.svelte';
  import LinkedInIcon from './LinkedInIcon.svelte';
  import SignalField from './SignalField.svelte';

  const person = $derived(site.profile.person);
  const hasCursor = new MediaQuery('(hover: hover) and (pointer: fine)');

  let readout = $state({ x: 0, y: 0, sensors: 0, nearest: '--', range: 0, tracking: false });

  const coordinate = (value) => String(value).padStart(4, '0');
</script>

<section class="hero" id="top" aria-labelledby="hero-name">
  <SignalField bind:readout />

  <div class="content wrap">
    <p class="eyebrow rise" style:--i="0"><b>{person.title}</b> / {person.location}</p>
    <h1 id="hero-name" class="rise" style:--i="1">
      {person.name}<span class="cursor" aria-hidden="true"></span>
    </h1>
    <p class="lead rise" style:--i="2">{person.summary[0]}</p>
    <p class="sub rise" style:--i="3">{person.summary[1]}</p>
    <div class="actions rise" style:--i="4">
      <a class="btn btn--primary" href="#experience">View experience <ArrowDown size={17} /></a>
      <a class="btn" href="#contact">Get in touch</a>
      <a class="btn" href={person.linkedin} target="_blank" rel="noopener noreferrer">
        <LinkedInIcon size={15} /> LinkedIn
      </a>
      <a class="btn" href={person.github} target="_blank" rel="noopener noreferrer">
        <GitHubIcon size={15} /> GitHub
      </a>
    </div>
  </div>

  <aside class="hud no-print rise" style:--i="5" aria-hidden="true">
    <div class="hud-head">
      <span>RTLS demo</span>
      <span class="state" class:live={readout.tracking}>{readout.tracking ? 'Tracking you' : 'Autopilot'}</span>
    </div>
    <dl>
      <div><dt>Tag x / y</dt><dd>{coordinate(readout.x)} / {coordinate(readout.y)}</dd></div>
      <div><dt>Nearest</dt><dd>{readout.nearest} at {readout.range}</dd></div>
      <div><dt>Locked</dt><dd>{readout.sensors} sensors</dd></div>
    </dl>
    <p>
      {hasCursor.current ? 'Move your cursor.' : 'Touch the field.'} The nearest sensors locate it, the way a
      location system finds a tag.
    </p>
  </aside>
</section>

<style>
  .hero {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 100svh;
    padding-block: calc(var(--nav-h) + 40px) 72px;
    overflow: hidden;
  }

  /* A wash of the two accent colors, plus a fade into the page below. */
  .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(760px 520px at 86% 18%, var(--blue-glow), transparent 70%),
      radial-gradient(620px 460px at 6% 88%, var(--orange-glow), transparent 70%);
  }

  .hero::after {
    content: '';
    position: absolute;
    inset: auto 0 0;
    height: 96px;
    background: linear-gradient(transparent, var(--bg));
    pointer-events: none;
  }

  .content {
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  .content a {
    pointer-events: auto;
  }

  h1 {
    margin-top: 14px;
    font-size: clamp(50px, 10.5vw, 112px);
    line-height: 0.98;
    letter-spacing: -0.045em;
  }

  .cursor {
    display: inline-block;
    width: 0.09em;
    height: 0.74em;
    margin-left: 0.1em;
    background: var(--orange-fill);
    animation: blink 1.15s steps(1) infinite;
  }

  .lead {
    max-width: 30em;
    margin-top: 24px;
    font-size: clamp(19px, 2.3vw, 24px);
    line-height: 1.4;
    letter-spacing: -0.012em;
  }

  .sub {
    max-width: 39em;
    margin-top: 14px;
    color: var(--text-2);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 30px;
  }

  .rise {
    animation: rise 0.8s var(--ease) both;
    animation-delay: calc(var(--i) * 70ms);
  }

  .hud {
    position: absolute;
    right: max(var(--gutter), calc((100vw - var(--wrap)) / 2));
    bottom: 56px;
    z-index: 1;
    width: 280px;
    padding: 13px 15px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: color-mix(in srgb, var(--surface) 84%, transparent);
    backdrop-filter: blur(8px);
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.5;
    pointer-events: none;
  }

  .hud-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--line);
    color: var(--text);
    font-weight: 500;
  }

  .state {
    color: var(--muted);
  }

  .state.live {
    color: var(--orange);
  }

  dl {
    margin: 8px 0;
  }

  dl div {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  dt {
    color: var(--muted);
  }

  dd {
    margin: 0;
    color: var(--text);
  }

  .hud p {
    color: var(--muted);
    font-size: 11.5px;
  }

  @keyframes rise {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
  }

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  /* Below this width the text sits on top and the live field gets its own space. */
  @media (max-width: 1099px) {
    .hero {
      align-items: flex-start;
      padding-block: calc(var(--nav-h) + 28px) 390px;
    }

    .hero::after {
      height: 32px;
    }

    .hud {
      right: var(--gutter);
      bottom: 24px;
      width: min(100% - var(--gutter) * 2, 380px);
    }
  }

  @media (max-width: 480px) {
    .actions .btn {
      flex: 1 1 auto;
    }

    .actions .btn {
      padding-inline: 12px;
      font-size: 15px;
    }

    .actions .btn--primary {
      flex-basis: 100%;
    }
  }

  @media print {
    .hero {
      min-height: 0;
      padding-block: 0 12pt;
    }

    .hero::before,
    .hero::after,
    .actions,
    .cursor {
      display: none;
    }

    h1 {
      font-size: 32pt;
    }

    .lead {
      font-size: 13pt;
    }
  }
</style>
