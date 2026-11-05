<script>
  /**
   * A small live dashboard for this site. Each reading is a real request from the
   * visitor's browser to the Express API, timed in the browser. It polls only while
   * the panel is on screen and the tab is visible.
   */
  import CircleAlert from '@lucide/svelte/icons/circle-alert';
  import CircleCheck from '@lucide/svelte/icons/circle-check';
  import RefreshCw from '@lucide/svelte/icons/refresh-cw';
  import { onMount } from 'svelte';
  import { api } from '../api.js';

  const MAX_SAMPLES = 24;
  const INTERVAL_MS = 5000;
  const TIMEOUT_MS = 4000;
  const CHART_HEIGHT = 84;
  const PAD_TOP = 10;
  const PAD_BOTTOM = 6;
  const PAD_RIGHT = 7; // room for the marker on the newest reading

  let panel;
  let samples = $state([]);
  let status = $state('checking');
  let runtime = $state('');
  let edge = $state(null);
  let checking = $state(false);
  let chartWidth = $state(320);
  let inspected = $state(null);

  const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);

  const latest = $derived(samples.at(-1) ?? null);
  const summary = $derived.by(() => {
    if (!samples.length) return null;
    const values = samples.map((sample) => sample.ms);
    return {
      low: Math.min(...values),
      high: Math.max(...values),
      average: Math.round(values.reduce((sum, value) => sum + value, 0) / values.length),
    };
  });

  const baseline = CHART_HEIGHT - PAD_BOTTOM;
  const yMax = $derived(Math.max(10, summary?.high ?? 10) * 1.15);
  const step = $derived((chartWidth - PAD_RIGHT) / (MAX_SAMPLES - 1));
  const points = $derived(
    samples.map((sample, index) => ({
      ...sample,
      x: chartWidth - PAD_RIGHT - (samples.length - 1 - index) * step,
      y: baseline - (sample.ms / yMax) * (baseline - PAD_TOP),
    })),
  );
  const line = $derived(points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' '));
  const area = $derived(
    points.length > 1 ? `${line} L${points.at(-1).x.toFixed(1)} ${baseline} L${points[0].x.toFixed(1)} ${baseline} Z` : '',
  );
  const inspectedPoint = $derived(inspected === null ? null : (points[inspected] ?? null));

  const clock = (time) =>
    new Date(time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });

  async function check() {
    if (checking) return;
    checking = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const started = performance.now();
    try {
      const health = await api.health(controller.signal);
      const elapsed = Math.round(performance.now() - started);
      samples = [...samples, { ms: elapsed, time: Date.now() }].slice(-MAX_SAMPLES);
      runtime = health.runtime;
      edge = health.edge;
      status = 'online';
    } catch {
      status = 'offline';
    } finally {
      clearTimeout(timeout);
      checking = false;
    }
  }

  function onPointerMove(event) {
    if (!points.length) return;
    const x = event.clientX - event.currentTarget.getBoundingClientRect().left;
    let nearest = 0;
    points.forEach((point, index) => {
      if (Math.abs(point.x - x) < Math.abs(points[nearest].x - x)) nearest = index;
    });
    inspected = nearest;
  }

  function onKeyDown(event) {
    if (!points.length) return;
    const last = points.length - 1;
    const current = inspected ?? last;
    if (event.key === 'ArrowLeft') inspected = Math.max(0, current - 1);
    else if (event.key === 'ArrowRight') inspected = Math.min(last, current + 1);
    else if (event.key === 'Home') inspected = 0;
    else if (event.key === 'End') inspected = last;
    else if (event.key === 'Escape') inspected = null;
    else return;
    event.preventDefault();
  }

  onMount(() => {
    let onScreen = false;
    const poll = () => {
      if (onScreen && !document.hidden) check();
    };
    const observer = new IntersectionObserver(([entry]) => {
      const wasOnScreen = onScreen;
      onScreen = entry.isIntersecting;
      if (onScreen && !wasOnScreen) poll();
    });
    observer.observe(panel);
    const timer = setInterval(poll, INTERVAL_MS);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  });
</script>

<div class="card panel no-print" bind:this={panel}>
  <div class="head">
    <div>
      <h3>This site, live</h3>
      <p>Timed from your browser to the Express API.</p>
    </div>
    <button type="button" class="check" onclick={check} disabled={checking}>
      <span class:spin={checking}><RefreshCw size={14} /></span>
      Check now
    </button>
  </div>

  <p class="status" role="status">
    {#if status === 'online'}
      <span class="good"><CircleCheck size={17} /></span> API online
    {:else if status === 'offline'}
      <span class="bad"><CircleAlert size={17} /></span> API not responding
    {:else}
      Checking the API
    {/if}
  </p>

  <dl class="stats">
    <div>
      <dt>Round trip</dt>
      <dd>{latest ? `${latest.ms} ms` : '--'}</dd>
    </div>
    <div>
      <dt>Served from</dt>
      <dd>{status === 'checking' ? '--' : (edge ?? (isLocal ? 'This computer' : 'Cloudflare edge'))}</dd>
    </div>
    <div>
      <dt>Runtime</dt>
      <dd>{runtime || '--'}</dd>
    </div>
  </dl>

  <div class="chart" bind:clientWidth={chartWidth}>
    <div
      class="plot"
      role="slider"
      tabindex="0"
      aria-label="Round trip time for each recent check"
      aria-valuemin="0"
      aria-valuemax={Math.max(0, samples.length - 1)}
      aria-valuenow={inspected ?? Math.max(0, samples.length - 1)}
      aria-valuetext={inspectedPoint
        ? `${inspectedPoint.ms} milliseconds at ${clock(inspectedPoint.time)}`
        : latest
          ? `Latest: ${latest.ms} milliseconds`
          : 'No readings yet'}
      onpointermove={onPointerMove}
      onpointerleave={() => (inspected = null)}
      onblur={() => (inspected = null)}
      onkeydown={onKeyDown}
    >
      <svg width={chartWidth} height={CHART_HEIGHT} aria-hidden="true">
        <line class="grid" x1="0" x2={chartWidth} y1={baseline} y2={baseline} />
        <line class="grid" x1="0" x2={chartWidth} y1={PAD_TOP} y2={PAD_TOP} />
        {#if area}<path class="area" d={area} />{/if}
        {#if points.length > 1}<path class="line" d={line} />{/if}
        {#if inspectedPoint}
          <line class="crosshair" x1={inspectedPoint.x} x2={inspectedPoint.x} y1={PAD_TOP} y2={baseline} />
        {/if}
        {#if points.length}
          {@const marker = inspectedPoint ?? points.at(-1)}
          <circle class="marker" cx={marker.x} cy={marker.y} r="4.5" />
        {/if}
      </svg>
      {#if inspectedPoint}
        <div class="tip" style:left="{Math.min(Math.max(inspectedPoint.x, 56), chartWidth - 56)}px">
          <strong>{inspectedPoint.ms} ms</strong>
          <span>{clock(inspectedPoint.time)}</span>
        </div>
      {/if}
    </div>
  </div>

  <p class="legend">
    {#if summary}
      Last {samples.length} {samples.length === 1 ? 'check' : 'checks'}: low {summary.low} ms, average {summary.average} ms, high {summary.high} ms
    {:else}
      Waiting for the first reading
    {/if}
  </p>
</div>

<style>
  .panel {
    padding: 20px;
  }

  .head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  h3 {
    font-size: 18px;
  }

  .head p {
    margin-top: 2px;
    color: var(--muted);
    font-size: 14px;
  }

  .check {
    display: inline-flex;
    flex: none;
    align-items: center;
    gap: 6px;
    min-height: 34px;
    padding: 4px 10px;
    border: 1px solid var(--line-strong);
    border-radius: 8px;
    background: transparent;
    color: var(--text-2);
    font-size: 13px;
    transition: border-color 0.15s, color 0.15s;
  }

  .check:hover:enabled {
    border-color: var(--orange);
    color: var(--text);
  }

  .check span {
    display: inline-flex;
  }

  .spin {
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .status {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 16px;
    font-size: 15px;
    font-weight: 550;
  }

  .status span {
    display: inline-flex;
  }

  .good {
    color: var(--blue);
  }

  .bad {
    color: var(--orange);
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(92px, 1fr));
    gap: 12px;
    margin: 14px 0 0;
    padding-top: 14px;
    border-top: 1px solid var(--line);
  }

  dt {
    color: var(--muted);
    font-size: 13px;
  }

  dd {
    margin: 1px 0 0;
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.3;
  }

  .chart {
    margin-top: 16px;
  }

  .plot {
    position: relative;
    height: 84px;
    border-radius: 6px;
    cursor: crosshair;
    touch-action: pan-y;
  }

  /* Taken out of the layout flow so a stale width can never stretch the card. */
  svg {
    position: absolute;
    inset: 0;
    display: block;
    overflow: visible;
  }

  .grid {
    stroke: var(--line);
    stroke-width: 1;
  }

  .area {
    fill: var(--blue-soft);
  }

  .line {
    fill: none;
    stroke: var(--blue);
    stroke-width: 2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .crosshair {
    stroke: var(--line-strong);
    stroke-width: 1;
  }

  .marker {
    fill: var(--orange);
    stroke: var(--surface);
    stroke-width: 2;
  }

  .tip {
    position: absolute;
    top: -12px;
    display: flex;
    gap: 8px;
    padding: 3px 9px;
    border: 1px solid var(--line-strong);
    border-radius: 7px;
    background: var(--surface-2);
    font-size: 12.5px;
    white-space: nowrap;
    transform: translateX(-50%);
    pointer-events: none;
  }

  .tip strong {
    font-weight: 600;
  }

  .tip span {
    color: var(--muted);
  }

  .legend {
    margin-top: 8px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.5;
  }
</style>
