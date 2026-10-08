import React from 'react';
import { Kbd } from '../primitives/Kbd.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function SearchTrigger({ placeholder = 'Search…', shortcut = '⌘K', hotkey = true, onOpen, className }) {
  React.useEffect(() => {
    if (!hotkey) return;
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); onOpen && onOpen(); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [hotkey, onOpen]);
  return (
    <button type="button" className={cx('vui-search-trigger', className)} onClick={onOpen} aria-label={placeholder} aria-keyshortcuts={hotkey ? 'Meta+K Control+K' : undefined}>
      <Glyph name="search" />
      <span className="vui-search-trigger__text">{placeholder}</span>
      {shortcut && <Kbd>{shortcut}</Kbd>}
    </button>
  );
}
