<script>
  let { size = 28 } = $props();
</script>

<svg class="mark" viewBox="0 0 32 32" width={size} height={size} fill="none" aria-hidden="true">
  <circle class="arcs" cx="16" cy="16" r="11" stroke-width="3" stroke-dasharray="17.28 5.76" />
  <circle cx="16" cy="16" r="4.5" fill="var(--orange-fill)" />
</svg>

<style>
  .mark {
    flex: none;
  }

  .arcs {
    stroke: var(--blue);
    transform-origin: center;
    transform: rotate(-70deg);
    transition: transform 0.7s var(--ease);
  }

  :global(a:hover) > .mark .arcs {
    transform: rotate(50deg);
  }
</style>
