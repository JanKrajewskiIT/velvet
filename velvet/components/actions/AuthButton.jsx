import React from 'react';
import { Spinner } from '../feedback/Spinner.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function AuthButton({ signedIn, onSignIn, onSignOut, signInLabel = 'Sign in', signOutLabel = 'Sign out', iconOnly = false, size = 'md', className }) {
  const [busy, setBusy] = React.useState(false);
  const run = async () => { setBusy(true); try { await (signedIn ? onSignOut && onSignOut() : onSignIn && onSignIn()); } finally { setBusy(false); } };
  const lbl = signedIn ? signOutLabel : signInLabel;
  return (
    <button type="button" className={cx('vui-btn', signedIn ? 'vui-btn--secondary' : 'vui-btn--primary', size !== 'md' && 'vui-btn--' + size, iconOnly && 'vui-btn--icon', 'vui-auth', className)} disabled={busy} onClick={run} aria-label={iconOnly ? lbl : undefined} title={iconOnly ? lbl : undefined}>
      {busy ? <Spinner size="inline" tone="current" /> : <span className="vui-auth__icon" key={String(signedIn)} aria-hidden="true"><Glyph name={(signedIn ? 'log-out' : 'log-in')} /></span>}
      {!iconOnly && <span>{lbl}</span>}
    </button>
  );
}
