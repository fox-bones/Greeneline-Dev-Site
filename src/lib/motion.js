import { MediaQuery } from 'svelte/reactivity';

const reducedMotion = new MediaQuery('(prefers-reduced-motion: reduce)');

/** Svelte transitions run in JavaScript, so the CSS reduced-motion rule cannot reach them. */
export const ms = (duration) => (reducedMotion.current ? 0 : duration);

/** Fades an element in the first time it scrolls into view. */
export function reveal(node, { delay = 0 } = {}) {
  node.classList.add('reveal');
  if (delay) node.style.setProperty('--reveal-delay', `${delay}ms`);

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        node.classList.add('is-visible');
        observer.disconnect();
      }
    },
    { rootMargin: '0px 0px -6% 0px' },
  );
  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}

/** Feeds the pointer position to the glow on .card (see app.css). */
export function spotlight(node) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return {};

  const onMove = (event) => {
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    node.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };
  node.addEventListener('pointermove', onMove, { passive: true });

  return {
    destroy() {
      node.removeEventListener('pointermove', onMove);
    },
  };
}
