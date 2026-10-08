import React from 'react';
import { cx } from './cx.js';
export function VisuallyHidden({ as: El = 'span', focusable = false, className, children, ...rest }) {
  return <El className={cx('vui-sr-only', focusable && 'vui-sr-only--focusable', className)} {...rest}>{children}</El>;
}
export function SkipLink({ href = '#main', children = 'Skip to main content', className }) {
  const go = (e) => {
    const t = href.startsWith('#') && document.getElementById(href.slice(1));
    if (!t) return;
    e.preventDefault();
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
    t.focus();
  };
  return <a href={href} className={cx('vui-skiplink', className)} onClick={go}>{children}</a>;
}
export function LiveRegion({ message, politeness = 'polite', clearAfter = 5000, visible = false, className }) {
  const [shown, setShown] = React.useState('');
  const text = message && typeof message === 'object' && !React.isValidElement(message) ? message.text : message;
  React.useEffect(() => {
    if (!text) { setShown(''); return; }
    setShown('');
    const a = setTimeout(() => setShown(text), 60);
    const b = clearAfter ? setTimeout(() => setShown(''), clearAfter + 60) : 0;
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [message]);
  return <div role={politeness === 'assertive' ? 'alert' : 'status'} aria-live={politeness} aria-atomic="true" className={cx(visible ? 'vui-live' : 'vui-sr-only', className)}>{shown}</div>;
}
