<script>
  import Menu from '@lucide/svelte/icons/menu';
  import Moon from '@lucide/svelte/icons/moon';
  import Sun from '@lucide/svelte/icons/sun';
  import X from '@lucide/svelte/icons/x';
  import { slide } from 'svelte/transition';
  import { ms } from '../motion.js';
  import { SECTIONS, site } from '../site.svelte.js';
  import BrandMark from './BrandMark.svelte';

  let scrollY = $state(0);
  let innerHeight = $state(0);
  let menuOpen = $state(false);

  const scrolled = $derived(scrollY > 8 || menuOpen);
  const progress = $derived.by(() => {
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    return scrollable > 0 ? Math.min(1, scrollY / scrollable) : 0;
  });
  // Section links would lead nowhere until the content has loaded.
  const ready = $derived(site.status === 'ready');
  const name = $derived(site.profile?.person.name ?? '');
  const nextTheme = $derived(site.theme === 'dark' ? 'light' : 'dark');
</script>

<svelte:window
  bind:scrollY
  bind:innerHeight
  onkeydown={(event) => {
    if (event.key === 'Escape') menuOpen = false;
  }}
/>

<header class="nav no-print" class:scrolled>
  <div class="bar wrap">
    <a class="brand" href="#top" aria-label={name ? `${name}, back to top` : 'Back to top'}>
      <BrandMark />
      {#if name}<span>{name}</span>{/if}
    </a>

    {#if ready}
      <nav class="links" aria-label="Main">
        {#each SECTIONS as section (section.id)}
          <a href="#{section.id}" aria-current={site.activeSection === section.id ? 'true' : undefined}>{section.label}</a>
        {/each}
      </nav>
    {/if}

    <div class="tools">
      <button
        type="button"
        class="icon-btn"
        aria-label="Switch to {nextTheme} theme"
        onclick={(event) => site.toggleTheme(event)}
      >
        {#if site.theme === 'dark'}<Sun size={18} />{:else}<Moon size={18} />{/if}
      </button>
      {#if ready}
        <button
          type="button"
          class="icon-btn menu-btn"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onclick={() => (menuOpen = !menuOpen)}
        >
          {#if menuOpen}<X size={20} />{:else}<Menu size={20} />{/if}
        </button>
      {/if}
    </div>
  </div>

  {#if menuOpen}
    <nav id="mobile-menu" class="sheet" aria-label="Mobile" transition:slide={{ duration: ms(200) }}>
      {#each SECTIONS as section (section.id)}
        <a
          href="#{section.id}"
          aria-current={site.activeSection === section.id ? 'true' : undefined}
          onclick={() => (menuOpen = false)}>{section.label}</a
        >
      {/each}
    </nav>
  {/if}

  <span class="progress" style:transform="scaleX({progress})" aria-hidden="true"></span>
</header>

<style>
  .nav {
    position: fixed;
    inset: 0 0 auto;
    z-index: 50;
    border-bottom: 1px solid transparent;
    transition: background 0.25s, border-color 0.25s;
  }

  .nav.scrolled {
    background: color-mix(in srgb, var(--bg) 82%, transparent);
    border-bottom-color: var(--line);
    backdrop-filter: blur(14px) saturate(1.3);
  }

  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    height: var(--nav-h);
  }

  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
    letter-spacing: -0.015em;
    text-decoration: none;
  }

  .links {
    display: flex;
    gap: 2px;
  }

  .links a {
    position: relative;
    padding: 8px 13px;
    border-radius: 8px;
    color: var(--text-2);
    font-size: 14.5px;
    text-decoration: none;
    transition: color 0.15s, background 0.15s;
  }

  .links a:hover {
    color: var(--text);
    background: var(--surface-2);
  }

  .links a[aria-current='true'] {
    color: var(--text);
  }

  .links a::after {
    content: '';
    position: absolute;
    inset: auto 13px 3px;
    height: 2px;
    border-radius: 2px;
    background: var(--orange-fill);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.28s var(--ease);
  }

  .links a[aria-current='true']::after {
    transform: scaleX(1);
  }

  .tools {
    display: flex;
    gap: 6px;
  }

  .icon-btn {
    display: inline-grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--line);
    border-radius: var(--radius-sm);
    background: var(--surface);
    color: var(--text-2);
    transition: border-color 0.15s, color 0.15s;
  }

  .icon-btn:hover {
    border-color: var(--orange);
    color: var(--text);
  }

  .menu-btn {
    display: none;
  }

  .sheet {
    display: flex;
    flex-direction: column;
    padding: 4px var(--gutter) 14px;
  }

  .sheet a {
    padding: 11px 4px;
    border-top: 1px solid var(--line);
    color: var(--text-2);
    text-decoration: none;
  }

  .sheet a[aria-current='true'] {
    color: var(--orange);
  }

  .progress {
    position: absolute;
    inset: auto 0 -1px;
    height: 2px;
    background: linear-gradient(90deg, var(--orange-fill), var(--blue));
    transform-origin: left;
  }

  @media (max-width: 759px) {
    .links {
      display: none;
    }

    .menu-btn {
      display: inline-grid;
    }
  }
</style>
