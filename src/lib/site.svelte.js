import { flushSync } from 'svelte';
import { api } from './api.js';
import { buildEvidence } from './evidence.js';

const THEME_KEY = 'cg-theme';
const THEME_COLORS = { dark: '#0a0e13', light: '#f3f5f8' };

export const SECTIONS = [
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
];

function storedTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

/** The state shared across sections. Picking a skill anywhere updates everything. */
class Site {
  status = $state('loading');
  profile = $state.raw(null);
  activeSection = $state('');
  theme = $state(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

  /** The skill a visitor clicked. It stays selected until they clear it. */
  selectedSkill = $state(null);
  /** The skill under the mouse. It previews without changing the selection. */
  previewSkill = $state(null);
  /** What the page is currently showing. */
  focusedSkill = $derived(this.previewSkill ?? this.selectedSkill);

  evidence = $derived(this.profile ? buildEvidence(this.profile) : new Map());

  async load() {
    this.status = 'loading';
    try {
      this.profile = await api.profile();
      this.status = 'ready';
    } catch (error) {
      console.error(error);
      this.status = 'error';
    }
  }

  selectSkill(skill) {
    this.selectedSkill = skill;
    this.previewSkill = null;
  }

  toggleSkill(skill) {
    this.selectSkill(this.selectedSkill === skill ? null : skill);
  }

  clearSkill() {
    this.selectSkill(null);
  }

  matchesFocused(skills) {
    return this.focusedSkill !== null && skills.includes(this.focusedSkill);
  }

  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
  }

  /** Switches theme with a circular wipe from the click where the browser supports it. */
  toggleTheme(event) {
    const next = this.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage can be blocked. The choice then simply lasts for this visit.
    }

    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!document.startViewTransition || calm) {
      this.applyTheme(next);
      return;
    }

    const origin = event.currentTarget.getBoundingClientRect();
    const x = origin.left + origin.width / 2;
    const y = origin.top + origin.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(() => flushSync(() => this.applyTheme(next)));
    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 480, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
        );
      })
      .catch(() => {});
  }

  /** Follows the operating system's theme until the visitor picks one themselves. */
  watchSystemTheme() {
    const query = matchMedia('(prefers-color-scheme: light)');
    const onChange = (event) => {
      const choice = storedTheme();
      if (choice !== 'light' && choice !== 'dark') this.applyTheme(event.matches ? 'light' : 'dark');
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }
}

export const site = new Site();
