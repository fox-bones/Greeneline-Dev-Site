<script>
  import { site } from '../site.svelte.js';
  import LinkedInIcon from './LinkedInIcon.svelte';

  // Comes from the Vite config because the API, its usual source, is unavailable here.
  const linkedin = __LINKEDIN_URL__;
</script>

<div class="error wrap" role="alert">
  <p class="eyebrow"><b>Connection</b> / No response</p>
  <h1>The profile didn’t load.</h1>
  <p class="text">The service behind this page didn’t respond. Trying again usually fixes it.</p>
  <div class="actions">
    <button type="button" class="btn btn--primary" onclick={() => site.load()}>Try again</button>
    <a class="btn" href={linkedin} target="_blank" rel="noopener noreferrer">
      <LinkedInIcon size={15} /> View LinkedIn instead
    </a>
  </div>
</div>

<style>
  .error {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 14px;
    min-height: 100svh;
  }

  h1 {
    font-size: clamp(34px, 6vw, 56px);
    letter-spacing: -0.03em;
  }

  .text {
    color: var(--text-2);
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 8px;
  }
</style>
