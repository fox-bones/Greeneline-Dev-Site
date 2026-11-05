<script>
  import Check from '@lucide/svelte/icons/check';
  import Copy from '@lucide/svelte/icons/copy';
  import Mail from '@lucide/svelte/icons/mail';
  import MapPin from '@lucide/svelte/icons/map-pin';
  import Phone from '@lucide/svelte/icons/phone';
  import { fly } from 'svelte/transition';
  import { api } from '../api.js';
  import { ms, reveal } from '../motion.js';
  import { site } from '../site.svelte.js';
  import GitHubIcon from './GitHubIcon.svelte';
  import LinkedInIcon from './LinkedInIcon.svelte';
  import SectionHead from './SectionHead.svelte';
  import Telemetry from './Telemetry.svelte';

  const person = $derived(site.profile.person);

  let state = $state('hidden'); // hidden | loading | shown | error
  let details = $state(null);
  let copied = $state(false);
  let copyFailed = $state(false);
  let copiedTimer;

  async function showEmail() {
    state = 'loading';
    try {
      details = await api.contact();
      state = 'shown';
    } catch (error) {
      console.error(error);
      state = 'error';
    }
  }

  async function copyEmail() {
    clearTimeout(copiedTimer);
    try {
      await navigator.clipboard.writeText(details.email);
      copied = true;
      copyFailed = false;
    } catch {
      copied = false;
      copyFailed = true;
    }
    copiedTimer = setTimeout(() => {
      copied = false;
      copyFailed = false;
    }, 2000);
  }
</script>

<section id="contact" class="section wrap" aria-labelledby="contact-title">
  <SectionHead
    id="contact-title"
    index="05"
    label="Contact"
    title="Get in touch"
    lede="Email and LinkedIn are the best ways to reach me. My code is on GitHub."
  />

  <div class="layout">
    <div class="ways" use:reveal>
      {#if state === 'shown' && details}
        <div class="email card" in:fly={{ y: 8, duration: ms(200) }}>
          <a class="address" href="mailto:{details.email}">{details.email}</a>
          <div class="email-actions">
            <a class="btn btn--primary" href="mailto:{details.email}"><Mail size={17} /> Send email</a>
            <button type="button" class="btn" onclick={copyEmail}>
              {#if copied}
                <Check size={17} /> Copied
              {:else}
                <Copy size={17} /> Copy address
              {/if}
            </button>
          </div>
          <p class="sr-only" role="status">{copied ? 'Email address copied' : ''}</p>
          {#if copyFailed}
            <p class="hint">Your browser blocked copying. The address above can be selected by hand.</p>
          {/if}
          {#if details.phone}
            <a class="phone" href="tel:{details.phone}"><Phone size={16} /> {details.phone}</a>
          {/if}
        </div>
      {:else}
        <button type="button" class="btn btn--primary big no-print" onclick={showEmail} disabled={state === 'loading'}>
          <Mail size={18} />
          {state === 'loading' ? 'Loading email' : 'Show email'}
        </button>
        {#if state === 'error'}
          <p class="hint" role="alert">The email address could not be loaded. Please try again, or use LinkedIn.</p>
        {/if}
      {/if}

      <a class="btn big social" href={person.linkedin} target="_blank" rel="noopener noreferrer">
        <LinkedInIcon size={16} /> Connect on LinkedIn
      </a>

      <a class="btn big social" href={person.github} target="_blank" rel="noopener noreferrer">
        <GitHubIcon size={16} /> See my code on GitHub
      </a>

      <p class="place"><MapPin size={16} /> {person.location}</p>
    </div>

    <div use:reveal={{ delay: 80 }}>
      <Telemetry />
    </div>
  </div>
</section>

<style>
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
    align-items: start;
  }

  @media (min-width: 880px) {
    .layout {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
      gap: 48px;
    }
  }

  .ways {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .big {
    min-height: 52px;
    font-size: 16.5px;
  }

  .btn:disabled {
    cursor: progress;
    opacity: 0.75;
  }

  .email {
    padding: 18px;
  }

  .address {
    display: block;
    color: var(--text);
    font-family: var(--font-mono);
    font-size: clamp(15px, 2.2vw, 19px);
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  .email-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  .phone {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    color: var(--text-2);
  }

  .hint {
    margin-top: 10px;
    color: var(--text-2);
    font-size: 14.5px;
  }

  @media print {
    .social {
      justify-content: flex-start;
      min-height: 0;
      padding: 0;
      border: 0;
      font-size: 11pt;
    }

    .social::after {
      content: attr(href);
      font-weight: 400;
    }
  }

  .place {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    color: var(--muted);
    font-size: 15px;
  }
</style>
