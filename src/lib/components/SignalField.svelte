<script>
  /**
   * A stylized Real-Time Location System. A grid of sensors tracks a tag that follows
   * the pointer: the three nearest sensors lock on, and their range circles meet at
   * the tag, which is how trilateration finds a position. When idle, the tag drifts
   * on its own so the field still looks alive on touch screens.
   */
  import { onMount } from 'svelte';
  import { site } from '../site.svelte.js';

  let { readout = $bindable() } = $props();

  const RANGE = 300; // how far a sensor can hear the tag, in CSS pixels
  const LOCK_COUNT = 3;
  const IDLE_MS = 3500; // pointer silence before the tag goes back to autopilot
  const TAU = Math.PI * 2;

  let canvas;
  let onThemeChange = () => {};

  $effect(() => {
    site.theme;
    onThemeChange();
  });

  /** Seeded so the sensors stay put when the window resizes. */
  function seededRandom(seed) {
    return () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  onMount(() => {
    const ctx = canvas.getContext('2d');
    const host = canvas.parentElement;
    const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');

    const tag = { x: 0, y: 0, targetX: 0, targetY: 0, placed: false };
    let colors = {};
    let width = 0;
    let height = 0;
    let sensors = [];
    let edges = [];
    let neighbours = [];
    let packets = [];
    let frameId = 0;
    let running = false;
    let onScreen = true;
    let lastFrame = 0;
    let lastPointer = -Infinity;
    let lastPublish = 0;
    let zone = { left: 0, right: 0, top: 0, bottom: 0 };

    function readColors() {
      const styles = getComputedStyle(document.documentElement);
      const token = (name) => styles.getPropertyValue(name).trim();
      colors = {
        mesh: token('--line-strong'),
        node: token('--muted'),
        orange: token('--orange'),
        orangeFill: token('--orange-fill'),
        blue: token('--blue'),
        label: token('--text-2'),
        mono: token('--font-mono'),
      };
    }

    const pickNeighbour = (index) => {
      const options = neighbours[index];
      return options[Math.floor(Math.random() * options.length)] ?? index;
    };

    function spawnPacket() {
      const from = Math.floor(Math.random() * sensors.length);
      return {
        from,
        to: pickNeighbour(from),
        progress: Math.random(),
        speed: 0.35 + Math.random() * 0.5,
      };
    }

    function layout() {
      const rect = host.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);

      const cell = width < 720 ? 92 : 118;
      const cols = Math.ceil(width / cell) + 1;
      const rows = Math.ceil(height / cell) + 1;
      const random = seededRandom(1042);

      sensors = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          sensors.push({
            id: `S-${String(sensors.length + 1).padStart(2, '0')}`,
            x: (col + 0.5 + (random() - 0.5) * 0.62) * cell,
            y: (row + 0.5 + (random() - 0.5) * 0.62) * cell,
            distance: 0,
          });
        }
      }

      edges = [];
      neighbours = sensors.map(() => []);
      const connect = (a, b) => {
        edges.push([a, b]);
        neighbours[a].push(b);
        neighbours[b].push(a);
      };
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col;
          if (col + 1 < cols) connect(index, index + 1);
          if (row + 1 < rows) connect(index, index + cols);
          if (col + 1 < cols && row + 1 < rows && random() < 0.35) connect(index, index + cols + 1);
        }
      }

      packets = Array.from({ length: Math.max(4, Math.round(edges.length / 18)) }, spawnPacket);
      measureZone();

      if (!tag.placed) {
        autopilot(performance.now() / 1000);
        tag.x = tag.targetX;
        tag.y = tag.targetY;
        tag.placed = true;
      }
    }

    /** Finds the open space around the headline and the readout, using their real positions. */
    function measureZone() {
      const content = host.querySelector('.content');
      const readoutCard = host.querySelector('.hud');
      const contentBottom = content ? content.offsetTop + content.offsetHeight : height * 0.6;
      const cardTop = readoutCard ? readoutCard.offsetTop : height;
      const stacked = width < 1100; // matches the breakpoint in Hero.svelte

      zone = stacked
        ? { left: width * 0.1, right: width * 0.9, top: contentBottom + 28, bottom: cardTop - 28 }
        : { left: width * 0.62, right: width * 0.93, top: height * 0.15, bottom: cardTop - 44 };

      // On narrow screens the field fades in right where the text ends.
      canvas.style.setProperty('--field-start', `${Math.round(contentBottom)}px`);
    }

    /** Drifts the idle tag around that open space. */
    function autopilot(time) {
      const centerX = (zone.left + zone.right) / 2;
      const centerY = (zone.top + zone.bottom) / 2;
      tag.targetX = centerX + ((zone.right - zone.left) / 2) * Math.sin(time * 0.31);
      tag.targetY = centerY + ((zone.bottom - zone.top) / 2) * Math.sin(time * 0.47 + 1);
    }

    function circle(x, y, radius) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, TAU);
    }

    function draw(time, animated) {
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round';

      // The sensor mesh.
      ctx.setLineDash([]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.mesh;
      ctx.globalAlpha = 0.34;
      ctx.beginPath();
      for (const [a, b] of edges) {
        ctx.moveTo(sensors[a].x, sensors[a].y);
        ctx.lineTo(sensors[b].x, sensors[b].y);
      }
      ctx.stroke();

      // Traffic moving across the mesh.
      if (animated) {
        ctx.fillStyle = colors.blue;
        ctx.globalAlpha = 0.75;
        for (const packet of packets) {
          const a = sensors[packet.from];
          const b = sensors[packet.to];
          circle(a.x + (b.x - a.x) * packet.progress, a.y + (b.y - a.y) * packet.progress, 1.7);
          ctx.fill();
        }
      }

      // Lock on to the nearest sensors in range.
      for (const sensor of sensors) sensor.distance = Math.hypot(sensor.x - tag.x, sensor.y - tag.y);
      const locked = sensors
        .filter((sensor) => sensor.distance < RANGE)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, LOCK_COUNT);

      // Range circles, which intersect at the tag.
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.blue;
      for (const sensor of locked) {
        ctx.globalAlpha = 0.26;
        circle(sensor.x, sensor.y, sensor.distance);
        ctx.stroke();
      }

      // Pulses travelling out from each sensor toward the tag.
      if (animated) {
        locked.forEach((sensor, index) => {
          const phase = (time * 0.55 + index / LOCK_COUNT) % 1;
          ctx.globalAlpha = (1 - phase) * 0.4;
          circle(sensor.x, sensor.y, sensor.distance * phase);
          ctx.stroke();
        });
      }

      // Signal lines from the sensors to the tag.
      ctx.strokeStyle = colors.orange;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.lineDashOffset = animated ? -time * 28 : 0;
      for (const sensor of locked) {
        ctx.globalAlpha = 0.25 + 0.7 * (1 - sensor.distance / RANGE);
        ctx.beginPath();
        ctx.moveTo(sensor.x, sensor.y);
        ctx.lineTo(tag.x, tag.y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Sensors.
      ctx.fillStyle = colors.node;
      ctx.globalAlpha = 0.8;
      for (const sensor of sensors) {
        circle(sensor.x, sensor.y, 1.8);
        ctx.fill();
      }

      // Locked sensors and their labels.
      ctx.font = `500 10.5px ${colors.mono}`;
      for (const sensor of locked) {
        ctx.fillStyle = colors.blue;
        ctx.globalAlpha = 0.2;
        circle(sensor.x, sensor.y, 8);
        ctx.fill();
        ctx.globalAlpha = 1;
        circle(sensor.x, sensor.y, 3.5);
        ctx.fill();
        ctx.fillStyle = colors.label;
        ctx.globalAlpha = 0.95;
        ctx.fillText(`${sensor.id}  ${Math.round(sensor.distance)}`, sensor.x + 11, sensor.y - 9);
      }

      // The tag itself.
      ctx.fillStyle = colors.orangeFill;
      ctx.globalAlpha = 0.22;
      circle(tag.x, tag.y, animated ? 15 + Math.sin(time * 3) * 2.5 : 15);
      ctx.fill();
      ctx.globalAlpha = 1;
      circle(tag.x, tag.y, 5);
      ctx.fill();

      return locked;
    }

    function publish(locked, tracking) {
      readout = {
        x: Math.round(tag.x),
        y: Math.round(tag.y),
        sensors: locked.length,
        nearest: locked[0]?.id ?? '--',
        range: locked[0] ? Math.round(locked[0].distance) : 0,
        tracking,
      };
    }

    function advancePackets(delta) {
      for (const packet of packets) {
        packet.progress += packet.speed * delta;
        if (packet.progress >= 1) {
          packet.from = packet.to;
          packet.to = pickNeighbour(packet.from);
          packet.progress = 0;
        }
      }
    }

    function frame(now) {
      if (!running) return;
      const delta = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      const time = now / 1000;
      const tracking = now - lastPointer < IDLE_MS;

      if (!tracking) autopilot(time);
      const ease = 1 - Math.exp(-delta * (tracking ? 9 : 2.2));
      tag.x += (tag.targetX - tag.x) * ease;
      tag.y += (tag.targetY - tag.y) * ease;

      advancePackets(delta);
      const locked = draw(time, true);
      // Ten updates a second is plenty for numbers people read.
      if (now - lastPublish >= 100) {
        lastPublish = now;
        publish(locked, tracking);
      }
      frameId = requestAnimationFrame(frame);
    }

    /** With reduced motion, the field only redraws in direct response to the pointer. */
    function drawStill(tracking = false) {
      tag.x = tag.targetX;
      tag.y = tag.targetY;
      publish(draw(0, false), tracking);
    }

    function syncRunning() {
      const shouldRun = onScreen && !document.hidden && !motionQuery.matches;
      if (shouldRun && !running) {
        running = true;
        lastFrame = performance.now();
        frameId = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(frameId);
      }
      if (motionQuery.matches && onScreen) drawStill();
    }

    function onPointer(event) {
      const rect = host.getBoundingClientRect();
      tag.targetX = event.clientX - rect.left;
      tag.targetY = event.clientY - rect.top;
      lastPointer = performance.now();
      if (motionQuery.matches) drawStill(true);
    }

    onThemeChange = () => {
      readColors();
      if (motionQuery.matches) drawStill();
    };

    readColors();
    layout();

    const resizeObserver = new ResizeObserver(() => {
      layout();
      if (motionQuery.matches) drawStill();
    });
    resizeObserver.observe(host);

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      syncRunning();
    });
    visibilityObserver.observe(host);

    host.addEventListener('pointermove', onPointer, { passive: true });
    host.addEventListener('pointerdown', onPointer, { passive: true });
    document.addEventListener('visibilitychange', syncRunning);
    motionQuery.addEventListener('change', syncRunning);

    // The canvas labels need a redraw if their font finishes loading after the first frame.
    document.fonts?.ready.then(() => {
      if (motionQuery.matches && onScreen) drawStill();
    });
    syncRunning();

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      onThemeChange = () => {};
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      host.removeEventListener('pointermove', onPointer);
      host.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('visibilitychange', syncRunning);
      motionQuery.removeEventListener('change', syncRunning);
    };
  });
</script>

<canvas bind:this={canvas} class="field no-print" aria-hidden="true"></canvas>

<style>
  .field {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    /* Fades the field out behind the text so the headline stays easy to read. */
    mask-image: linear-gradient(100deg, rgba(0, 0, 0, 0.16) 12%, rgba(0, 0, 0, 0.38) 42%, #000 66%);
  }

  @media (max-width: 1099px) {
    .field {
      mask-image: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0.14) 0,
        rgba(0, 0, 0, 0.22) var(--field-start, 60%),
        #000 calc(var(--field-start, 60%) + 44px)
      );
    }
  }
</style>
