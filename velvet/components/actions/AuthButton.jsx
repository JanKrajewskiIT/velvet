import React from 'react';
import { Spinner } from '../feedback/Spinner.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { cx } from '../primitives/cx.js';
export function AuthButton({ signedIn, onSignIn, onSignOut, signInLabel = 'Sign in', signOutLabel = 'Sign out', initializing = false, pending = false, error, iconOnly = false, size = 'md', className }) {
  const [busy, setBusy] = React.useState(false);
  const [fail, setFail] = React.useState(null);
  const errId = React.useId();
  const run = async () => { setBusy(true); setFail(null); try { await (signedIn ? onSignOut && onSignOut() : onSignIn && onSignIn()); } catch (e) { setFail((e && e.message) || 'Something went wrong'); } finally { setBusy(false); } };
  const err = error || fail; const wait = busy || pending || initializing;
  const lbl = initializing ? 'Checking session…' : signedIn ? signOutLabel : signInLabel;
  return (
    <button type="button" className={cx('vui-btn', signedIn || initializing ? 'vui-btn--secondary' : 'vui-btn--primary', size !== 'md' && 'vui-btn--' + size, iconOnly && 'vui-btn--icon', 'vui-auth', err && !wait && 'vui-auth--error', className)} disabled={wait} aria-busy={wait || undefined} onClick={run} aria-label={iconOnly ? lbl : undefined} aria-describedby={err ? errId : undefined} title={iconOnly || err ? (err && !iconOnly ? err : lbl) : undefined}>
      {wait ? <Spinner size="inline" tone="current" /> : <span className="vui-auth__icon" key={String(signedIn) + !!err} aria-hidden="true"><Glyph name={err ? 'alert-circle' : signedIn ? 'log-out' : 'log-in'} /></span>}
      {!iconOnly && <span>{lbl}</span>}
      {err && <span id={errId} className="vui-sr-only" role="alert">{err}</span>}
    </button>
  );
}
