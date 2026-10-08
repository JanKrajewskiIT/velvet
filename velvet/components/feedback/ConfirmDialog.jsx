import React from 'react';
import { IconTile } from '../primitives/IconTile.jsx';
import { FieldLabel } from '../primitives/Field.jsx';
import { Control } from '../primitives/Control.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { Dialog } from './Dialog.jsx';
export function ConfirmDialog({ open, onConfirm, onCancel, title = 'Are you sure?', description, tone = 'primary', confirmLabel = 'Confirm', cancelLabel = 'Cancel', requireText, children }) {
  const [typed, setTyped] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState(null);
  const lock = React.useRef(false);
  React.useEffect(() => { if (open) { setTyped(''); setBusy(false); setErr(null); lock.current = false; } }, [open]);
  const ok = !requireText || typed.trim() === requireText;
  const go = async () => { if (!ok || lock.current) return; lock.current = true; setBusy(true); setErr(null); try { await (onConfirm && onConfirm()); } catch (e) { setErr((e && e.message) || 'Something went wrong — try again.'); } finally { lock.current = false; setBusy(false); } };
  return (
    <Dialog open={open} onClose={busy ? undefined : onCancel} size="sm" title={<span className="vui-confirm__title">{tone === 'danger' && <IconTile icon="triangle-alert" tone="danger" shape="circle" size="sm" />}{title}</span>} description={description} dismissible={!busy}
      footer={<><Button variant="secondary" disabled={busy} onClick={onCancel}>{cancelLabel}</Button><Button variant={tone === 'danger' ? 'danger' : 'primary'} loading={busy} disabled={!ok} onClick={go} autoFocus={tone !== 'danger'}>{confirmLabel}</Button></>}>
      {children}
      {err && <div className="vui-confirm__err" role="alert"><Glyph name="alert-circle" />{err}</div>}
      {requireText && (
        <div className="vui-field" style={{ marginTop: children ? 12 : 0 }}>
          <FieldLabel htmlFor="vui-confirm-type">Type <b className="vui-confirm__code">{requireText}</b> to confirm</FieldLabel>
          <Control ><input id="vui-confirm-type" className="vui-control__input" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" spellCheck={false} onKeyDown={(e) => e.key === 'Enter' && go()} autoFocus /></Control>
        </div>
      )}
    </Dialog>
  );
}
export function ConfirmAction({ trigger, onConfirm, ...rest }) {
  const [open, setOpen] = React.useState(false);
  const t = React.isValidElement(trigger) ? React.cloneElement(trigger, { onClick: (e) => { trigger.props.onClick && trigger.props.onClick(e); setOpen(true); } }) : <Button variant="secondary" onClick={() =>setOpen(true)}>{trigger}</Button>;
  return <>{t}<ConfirmDialog {...rest} open={open} onCancel={() => setOpen(false)} onConfirm={async () => { await (onConfirm && onConfirm()); setOpen(false); /* rejects propagate → ConfirmDialog shows the error and stays open */ }} /></>;
}
