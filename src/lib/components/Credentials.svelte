<script>
  import Award from '@lucide/svelte/icons/award';
  import GraduationCap from '@lucide/svelte/icons/graduation-cap';
  import { reveal, spotlight } from '../motion.js';
  import { site } from '../site.svelte.js';
  import SectionHead from './SectionHead.svelte';

  const education = $derived(site.profile.education);
  const certifications = $derived(site.profile.certifications);
</script>

<section id="credentials" class="section wrap" aria-labelledby="credentials-title">
  <SectionHead id="credentials-title" index="04" label="Credentials" title="Education and certifications" />

  <div class="layout">
    <div class="education">
      {#each education as item (item.credential)}
        <article class="card degree" use:reveal use:spotlight>
          <span class="icon"><GraduationCap size={24} /></span>
          <h3>{item.credential}</h3>
          <p class="school">{item.school}</p>
          <p class="date">{item.date}</p>
          {#if item.detail}<p class="detail">{item.detail}</p>{/if}
        </article>
      {/each}
    </div>

    <ul class="certs">
      {#each certifications as certification, index (certification.name)}
        <li use:reveal={{ delay: index * 50 }}>
          <div class="card cert" class:match={site.matchesFocused(certification.skills)} use:spotlight>
            <Award size={18} />
            <span>{certification.name}</span>
          </div>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }

  @media (min-width: 820px) {
    .layout {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
    }
  }

  .education {
    display: grid;
    gap: 14px;
  }

  .degree {
    padding: clamp(20px, 3vw, 30px);
  }

  .icon {
    display: inline-grid;
    place-items: center;
    width: 46px;
    height: 46px;
    margin-bottom: 18px;
    border-radius: var(--radius-sm);
    background: var(--blue-soft);
    color: var(--blue);
  }

  h3 {
    font-size: clamp(20px, 2.4vw, 24px);
    line-height: 1.25;
  }

  .school {
    margin-top: 10px;
    color: var(--blue);
    font-weight: 550;
  }

  .date {
    margin-top: 2px;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 13px;
  }

  .detail {
    margin-top: 10px;
    color: var(--text-2);
    font-size: 15px;
  }

  .certs {
    align-content: start;
    display: grid;
    gap: 10px;
  }

  .cert {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    color: var(--text-2);
    box-shadow: none;
    transition: border-color 0.18s, background 0.18s, color 0.18s;
  }

  .cert :global(svg) {
    flex: none;
    color: var(--orange);
  }

  .cert.match {
    border-color: var(--orange);
    background: var(--orange-soft);
    color: var(--text);
  }
</style>
