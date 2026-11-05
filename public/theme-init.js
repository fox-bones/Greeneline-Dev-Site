(function () {
  var theme = null;
  try {
    theme = localStorage.getItem('cg-theme');
  } catch (error) {
    // Storage can be blocked. Falling back to the system preference is fine.
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.dataset.theme = theme;
})();
