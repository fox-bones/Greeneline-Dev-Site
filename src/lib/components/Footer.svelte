<script>
  import { site } from '../site.svelte.js';

  const year = new Date().getFullYear();
</script>

<footer class="no-print">
  <div class="wrap row">
    <p>© {year} {site.profile.person.name}</p>
    <p class="stack">Built with Svelte, Express, and Cloudflare Workers</p>
  </div>
</footer>

<style>
  footer {
    border-top: 1px solid var(--line);
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 4px 24px;
    padding-block: 22px;
    color: var(--muted);
    font-size: 14px;
  }

  .stack {
    font-family: var(--font-mono);
    font-size: 12.5px;
    line-height: 1.75;
  }
</style>
