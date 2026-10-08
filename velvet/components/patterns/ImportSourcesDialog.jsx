import React from 'react';
import { SectionLabel } from '../primitives/SectionLabel.jsx';
import { IconTile } from '../primitives/IconTile.jsx';
import { ListItem } from '../primitives/ListItem.jsx';
import { Checkbox } from '../forms/Checkbox.jsx';
import { Button } from '../actions/Button.jsx';
import { Glyph } from '../primitives/Glyph.jsx';
import { Dialog } from '../feedback/Dialog.jsx';
import { cx } from '../primitives/cx.js';
export function ImportSourcesDialog({ open, onClose, sources = [], onImport, onConnect, title = 'Import from…' }) {
  const [sel, setSel] = React.useState([]);
  const [busy, setBusy] = React.useState(null);
  const [err, setErr] = React.useState(null);
  React.useEffect(() => { if (open) setErr(null); }, [open]);
  React.useEffect(() => { if (open) setSel(sources.filter((s) => s.status === 'connected' && s.defaultSelected).map((s) => s.id)); }, [open]);
  const toggle = (id) => setSel((x) => (x.includes(id) ? x.filter((y) => y !== id) : [...x, id]));
  const total = sources.filter((s) => sel.includes(s.id)).reduce((n, s) => n + (s.count || 0), 0);
  const groups = [['Connected', sources.filter((s) => s.status !== 'available')], ['Available', sources.filter((s) => s.status === 'available')]];
  const doImport = async () => { if (busy) return; setBusy('import'); setErr(null); try { await (onImport && onImport(sel)); } catch (e) { setErr((e && e.message) || 'Import failed — your selection is kept. Try again.'); } finally { setBusy(null); } };
  return (
    <Dialog open={open} onClose={busy ? undefined : onClose} dismissible={!busy} title={title} description="Choose where to bring data in from. You can import again later." size="md"
      footer={<><span className="vui-imports__sum">{sel.length ? sel.length + ' source' + (sel.length > 1 ? 's' : '') + (total ? ' · ' + total.toLocaleString() + ' items' : '') : 'Nothing selected'}</span><Button variant="secondary" onClick={onClose} disabled={!!busy}>Cancel</Button><Button loading={busy === 'import'} disabled={!sel.length || !!busy} onClick={doImport}>Import</Button></>}>
      {err && <div className="vui-confirm__err" role="alert" style={{ marginBottom: 12 }}><Glyph name="alert-circle" />{err}</div>}
      <div className="vui-imports">
        {groups.map(([g, list]) => list.length > 0 && (
          <div key={g} className="vui-imports__group">
            <SectionLabel className="vui-imports__h">{g}</SectionLabel>
            <ul>
              {list.map((s) => {
                const on = sel.includes(s.id); const can = s.status === 'connected';
                return (
                  <li key={s.id}>
                    <ListItem as="label" className={cx('vui-imports__row', !can && 'vui-imports__row--off')} selected={on}
                      leading={<>{can ? <Checkbox checked={on} onChange={() => toggle(s.id)} /> : <span className="vui-imports__spacer" />}<IconTile icon={s.icon || 'database'} outline color={s.color} /></>}
                      title={s.name}
                      description={s.status === 'error' ? <span className="vui-imports__err">{s.error || 'Connection expired'}</span> : s.description}
                      trailing={<>
                        {s.count != null && can && <span className="vui-imports__count">{s.count.toLocaleString()}</span>}
                        {s.status !== 'connected' && onConnect && (
                          <Button size="sm" variant={s.status === 'error' ? 'secondary' : 'soft'} loading={busy === s.id} disabled={!!busy} onClick={async (e) => { e.preventDefault(); if (busy) return; setBusy(s.id); setErr(null); try { await onConnect(s.id); } catch (x) { setErr((x && x.message) || 'Couldn’t connect ' + s.name + '. Try again.'); } finally { setBusy(null); } }}>
                            {s.status === 'error' ? 'Reconnect' : 'Connect'}
                          </Button>
                        )}
                      </>} />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Dialog>
  );
}
