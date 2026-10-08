import React from 'react';
import { cx } from './cx.js';
const MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const MAP = { mod: MAC ? '⌘' : 'Ctrl', cmd: '⌘', ctrl: 'Ctrl', alt: MAC ? '⌥' : 'Alt', shift: '⇧', enter: '↵', esc: 'Esc', up: '↑', down: '↓', left: '←', right: '→', tab: 'Tab', backspace: '⌫', space: 'Space' };
export function Kbd({ keys, children, size = 'md', plain = false, className }) {
  const list = keys ? (Array.isArray(keys) ? keys : String(keys).split('+')) : null;
  if (!list) return <kbd className={cx('vui-kbd', size === 'sm' && 'vui-kbd--sm', plain && 'vui-kbd--plain', className)}>{children}</kbd>;
  return (
    <span className={cx('vui-kbd-combo', className)} aria-label={list.map((k) => MAP[k.toLowerCase()] ? k : k).join(' + ')}>
      {list.map((k, i) => <kbd key={i} className={cx('vui-kbd', size === 'sm' && 'vui-kbd--sm', plain && 'vui-kbd--plain')} aria-hidden="true">{MAP[k.toLowerCase()] || k.toUpperCase()}</kbd>)}
    </span>
  );
}
