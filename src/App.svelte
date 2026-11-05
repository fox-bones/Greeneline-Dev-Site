<script>
  import { onMount } from 'svelte';
  import { SECTIONS, site } from './lib/site.svelte.js';
  import Contact from './lib/components/Contact.svelte';
  import Credentials from './lib/components/Credentials.svelte';
  import Experience from './lib/components/Experience.svelte';
  import Focus from './lib/components/Focus.svelte';
  import Footer from './lib/components/Footer.svelte';
  import Hero from './lib/components/Hero.svelte';
  import LoadError from './lib/components/LoadError.svelte';
  import LoadingShell from './lib/components/LoadingShell.svelte';
  import Nav from './lib/components/Nav.svelte';
  import Projects from './lib/components/Projects.svelte';
  import Skills from './lib/components/Skills.svelte';

  onMount(() => {
    site.load();
    return site.watchSystemTheme();
  });

  // Highlights the nav link for whichever section crosses the middle of the screen.
  $effect(() => {
    if (site.status !== 'ready') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) site.activeSection = entry.target.id;
          else if (site.activeSection === entry.target.id) site.activeSection = '';
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const { id } of SECTIONS) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  });

  // Content arrives from the API after the page loads, so the browser cannot follow
  // a link like /#skills by itself. This finishes the job once the section exists.
  $effect(() => {
    if (site.status !== 'ready' || !location.hash) return;
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' });
  });
</script>

<a class="skip-link" href="#main">Skip to content</a>
<Nav />

<main id="main">
  {#if site.status === 'ready'}
    <Hero />
    <Focus />
    <Experience />
    <Skills />
    <Projects />
    <Credentials />
    <Contact />
  {:else if site.status === 'error'}
    <LoadError />
  {:else}
    <LoadingShell />
  {/if}
</main>

{#if site.status === 'ready'}
  <Footer />
{/if}
