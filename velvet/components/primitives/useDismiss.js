import React from 'react';
// Closes a popover-like surface on outside mousedown and Escape. Escape returns focus to refocus (selector inside ref) — the trigger.
export function useDismiss(open, onDismiss, ref, { outside = true, escape = true, refocus = '[aria-expanded]' } = {}) {
  const cb = React.useRef(onDismiss); cb.current = onDismiss;
  React.useEffect(() => {
    if (!open) return;
    const d = (e) => { if (outside && ref.current && !ref.current.contains(e.target)) cb.current(false, 'outside'); };
    const k = (e) => { if (!escape || e.key !== 'Escape') return; cb.current(false, 'escape'); if (refocus) { const b = ref.current && ref.current.querySelector(refocus); b && b.focus(); } };
    document.addEventListener('mousedown', d); window.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', d); window.removeEventListener('keydown', k); };
  }, [open]);
}
