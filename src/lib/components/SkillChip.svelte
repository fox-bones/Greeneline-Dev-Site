<script>
  import { site } from '../site.svelte.js';

  let { skill, small = false } = $props();

  const pressed = $derived(site.selectedSkill === skill);
  const previewing = $derived(site.previewSkill === skill);

  // Hover previews are mouse only. On touch, a tap goes straight to selecting.
  function onEnter(event) {
    if (event.pointerType === 'mouse') site.previewSkill = skill;
  }

  function onLeave() {
    if (site.previewSkill === skill) site.previewSkill = null;
  }
</script>

<button
  type="button"
  class="chip"
  class:small
  class:previewing
  aria-pressed={pressed}
  onclick={() => site.toggleSkill(skill)}
  onpointerenter={onEnter}
  onpointerleave={onLeave}
>
  {skill}
</button>

<style>
  .chip {
    display: inline-block;
    max-width: 100%;
    min-height: 34px;
    padding: 5px 11px;
    border: 1px solid var(--line-strong);
    border-radius: 8px;
    background: var(--surface-2);
    color: var(--text-2);
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.5;
    text-align: left;
    transition: border-color 0.15s, background 0.15s, color 0.15s, transform 0.15s var(--ease);
  }

  .chip.small {
    min-height: 28px;
    padding: 2px 9px;
    font-size: 12px;
  }

  .chip:hover,
  .chip.previewing {
    border-color: var(--orange);
    color: var(--text);
    transform: translateY(-1px);
  }

  .chip[aria-pressed='true'] {
    border-color: var(--orange-fill);
    background: var(--orange-fill);
    color: var(--on-orange);
  }
</style>
