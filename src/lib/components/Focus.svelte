<script>
  import Activity from '@lucide/svelte/icons/activity';
  import ArrowRight from '@lucide/svelte/icons/arrow-right';
  import Box from '@lucide/svelte/icons/box';
  import Headset from '@lucide/svelte/icons/headset';
  import Network from '@lucide/svelte/icons/network';
  import Wrench from '@lucide/svelte/icons/wrench';
  import { reveal, spotlight } from '../motion.js';
  import { site } from '../site.svelte.js';

  const icons = { tools: Wrench, monitoring: Activity, network: Network, support: Headset };
</script>

<section class="focus wrap no-print" aria-labelledby="focus-title">
  <h2 id="focus-title" class="sr-only">What I focus on</h2>
  <ul>
    {#each site.profile.focus as item, index (item.title)}
      {@const Icon = icons[item.icon] ?? Box}
      <li use:reveal={{ delay: index * 70 }}>
        <a class="card tile" href="#skills" use:spotlight onclick={() => site.selectSkill(item.skill)}>
          <span class="icon"><Icon size={20} /></span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <span class="more">See the work <ArrowRight size={15} /></span>
        </a>
      </li>
    {/each}
  </ul>
</section>

<style>
  ul {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(245px, 1fr));
    gap: 14px;
  }

  li {
    display: flex;
  }

  .tile {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 20px;
    text-decoration: none;
  }

  .icon {
    display: inline-grid;
    place-items: center;
    width: 38px;
    height: 38px;
    margin-bottom: 14px;
    border-radius: var(--radius-sm);
    background: var(--blue-soft);
    color: var(--blue);
  }

  h3 {
    font-size: 18px;
  }

  p {
    flex: 1;
    margin-top: 8px;
    color: var(--text-2);
    font-size: 15px;
    line-height: 1.55;
  }

  .more {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 14px;
    color: var(--orange);
    font-size: 14px;
    font-weight: 550;
  }

  .more :global(svg) {
    transition: transform 0.2s var(--ease);
  }

  .tile:hover .more :global(svg) {
    transform: translateX(4px);
  }
</style>
