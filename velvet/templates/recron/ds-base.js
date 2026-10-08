// Loads this design system into the template. In a consuming project, point
// base at the bound DS folder relative to this file (e.g. '_ds/<folder>' at
// the project root, '../_ds/<folder>' one level down) — one line to edit.
// Loads the flattened styles.bundle.css (one request instead of ~170) and is idempotent across child DCs.
(() => {
  if (window.__vuiDsBase) return;
  window.__vuiDsBase = true;
  const base = '../..';
  const l = document.createElement('link');
  l.rel = 'stylesheet'; l.href = base + '/styles.bundle.css';
  document.head.appendChild(l);
  if (window.VelvetUIDesignSystem_ee2bd8) return;
  const s = document.createElement('script');
  s.src = base + '/_ds_bundle.js';
  s.onerror = () => console.error('ds-base.js: failed to load ' + s.src + ' — point the base line in ds-base.js at the bound _ds/<folder> tree relative to this page');
  document.head.appendChild(s);
})();
