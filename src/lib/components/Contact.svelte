<script>
  import MapPin from '@lucide/svelte/icons/map-pin';
  import { reveal } from '../motion.js';
  import { site } from '../site.svelte.js';
  import GitHubIcon from './GitHubIcon.svelte';
  import LinkedInIcon from './LinkedInIcon.svelte';
  import SectionHead from './SectionHead.svelte';
  import Telemetry from './Telemetry.svelte';

  const person = $derived(site.profile.person);
</script>

<section id="contact" class="section wrap" aria-labelledby="contact-title">
  <SectionHead
    id="contact-title"
    index="05"
    label="Contact"
    title="Get in touch"
    lede="LinkedIn is the best way to reach me. My code is on GitHub."
  />

  <div class="layout">
    <div class="ways" use:reveal>
      <a class="btn btn--primary big social" href={person.linkedin} target="_blank" rel="noopener noreferrer">
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

  .place {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    color: var(--muted);
    font-size: 15px;
  }

  /* On paper, these print as plain lines with the full address spelled out. */
  @media print {
    .social {
      justify-content: flex-start;
      min-height: 0;
      padding: 0;
      border: 0;
      background: transparent;
      color: var(--text);
      font-size: 11pt;
    }

    .social::after {
      content: attr(href);
      font-weight: 400;
    }
  }
</style>
