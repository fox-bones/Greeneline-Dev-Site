<script>
  import { reveal } from '../motion.js';

  let { id, index, label, title, lede = '' } = $props();
</script>

<header class="head" use:reveal>
  <p class="eyebrow"><b>{index}</b> / {label}</p>
  <h2 {id}>{title}</h2>
  {#if lede}
    <p class="lede">{lede}</p>
  {/if}
</header>

<style>
  .head {
    margin-bottom: clamp(28px, 5vw, 48px);
  }

  h2 {
    margin-top: 10px;
    font-size: clamp(30px, 5vw, 46px);
    letter-spacing: -0.03em;
  }

  .lede {
    max-width: 62ch;
    margin-top: 12px;
    color: var(--text-2);
  }

  /* These lines explain on-screen controls, which do nothing on paper. */
  @media print {
    .lede {
      display: none;
    }
  }
</style>
