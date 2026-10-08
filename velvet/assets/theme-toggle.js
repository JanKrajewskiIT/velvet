// Global theme + frame for all specimen cards. One switch (guidelines/theme-switch.html) writes localStorage['vui-theme'];
// every card listens and re-themes live. Values: 'light' | 'dark' | 'system' (default, follows OS).
// Frame: one flat background, one 18/20 gutter, content stretched to 100% width, never scrolls inside the card (the host page scrolls), no scaling. Card viewport heights must fit content.
(() => {
  const KEY = 'vui-theme';
  const root = document.documentElement;
  const mq = matchMedia('(prefers-color-scheme: dark)');
  const resolve = (v) => (v === 'dark' || v === 'light' ? v : mq.matches ? 'dark' : 'light');
  const apply = () => { root.dataset.theme = resolve(localStorage.getItem(KEY)); };
  apply();
  addEventListener('storage', (e) => { if (e.key === KEY) apply(); });
  mq.addEventListener('change', apply);
  window.vuiSetTheme = (v) => { localStorage.setItem(KEY, v); apply(); };
  window.vuiGetTheme = () => localStorage.getItem(KEY) || 'system';

  const st = document.createElement('style');
  st.textContent =
    'html{background:var(--bg-raised)!important;overflow:hidden!important;scrollbar-width:none;width:100%;height:100%}html::-webkit-scrollbar{display:none}' +
    'body{background:var(--bg-raised)!important;overflow:visible!important;height:auto!important;margin:0!important;padding:18px 20px!important;box-sizing:border-box;width:100%!important;max-width:none!important;min-height:100vh;zoom:1!important}' +
    '#root,.pane{background:var(--bg-raised)!important}' +
    '#root{display:contents}' +
    '#root>.pane[style*="100vh"]{height:calc(100vh - 36px)!important;min-height:0!important}' +
    '#root>.pane{width:100%!important;box-sizing:border-box;padding:0!important;margin:0!important;max-width:none!important;background:transparent!important;border:0!important;box-shadow:none!important;border-radius:0!important}' +
    '#root>.pane>:not(button):not(.vui-btn):not(script){flex:1 1 auto;width:auto!important;max-width:none!important;min-width:0;align-self:stretch!important}' +
    '#root>.pane.vui-row>:not(button):not(.vui-btn){flex:1 1 0;min-width:min-content}';
  const tagRows = () => document.querySelectorAll('#root>.pane').forEach((p) => p.classList.toggle('vui-row', getComputedStyle(p).flexDirection === 'row'));
  new MutationObserver(tagRows).observe(document.documentElement, { childList: true, subtree: true });
  // Card frame only — never on templates / Design Components (they own their page scroll and background).
  const isDC = () => !!document.querySelector('x-dc,#dc-root,script[data-dc-script]');
  const mount = () => { if (isDC()) { st.remove(); return; } document.head.appendChild(st); };
  mount();
  document.addEventListener('DOMContentLoaded', mount);
})();
