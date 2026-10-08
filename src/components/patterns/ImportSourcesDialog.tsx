import { createEffect, createMemo, createSignal, For, on, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Dialog } from '../feedback/Dialog';
import { Checkbox } from '../forms/Checkbox';
import { Glyph } from '../primitives/Glyph';
import { IconTile } from '../primitives/IconTile';
import { ListItem } from '../primitives/ListItem';
import { SectionLabel } from '../primitives/SectionLabel';

export interface ImportSource {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  status: 'connected' | 'available' | 'error';
  /** Items available to import */
  count?: number;
  error?: string;
  defaultSelected?: boolean;
}

/** What failed: the whole import, or connecting one source. */
export type ImportFailure = { kind: 'import' } | { kind: 'connect'; source: ImportSource };

export interface ImportSourcesDialogProps {
  open: boolean;
  onClose?: () => void;
  sources: ImportSource[];
  /** On reject: selection kept, error inline, dialog stays open. */
  onImport?: (ids: string[]) => void | Promise<void>;
  onConnect?: (id: string) => void | Promise<void>;
  /** Receives the rejection of `onImport` / `onConnect`; the dialog itself shows a generic message. */
  onError?: (error: unknown, failure: ImportFailure) => void;
  /** @default localized "Import from…" */
  title?: string;
}

const IMPORT_ACTION = 'import';

/** Dialog checklist of import sources grouped Connected / Available. Connected rows are selectable; available or errored rows show Connect / Reconnect. Footer sums the selection. */
export const ImportSourcesDialog = (props: ImportSourcesDialogProps) => {
  const translate = useTranslate();
  const [selected, setSelected] = createSignal<string[]>([]);
  /** `'import'` while importing, a source id while connecting it. */
  const [busy, setBusy] = createSignal<string | null>(null);
  const [error, setError] = createSignal<string | null>(null);

  createEffect(
    on(
      () => props.open,
      (open) => {
        if (!open) return;
        setError(null);
        setSelected(
          props.sources
            .filter((source) => source.status === 'connected' && source.defaultSelected)
            .map((source) => source.id),
        );
      },
    ),
  );

  const total = createMemo(() =>
    props.sources
      .filter((source) => selected().includes(source.id))
      .reduce((sum, source) => sum + (source.count ?? 0), 0),
  );
  const groups = createMemo(() =>
    [
      {
        label: translate('velvet.patterns.importSourcesDialog.connected'),
        sources: props.sources.filter((source) => source.status !== 'available'),
      },
      {
        label: translate('velvet.patterns.importSourcesDialog.available'),
        sources: props.sources.filter((source) => source.status === 'available'),
      },
    ].filter((group) => group.sources.length > 0),
  );
  const summary = () => {
    const count = selected().length;
    if (!count) return translate('velvet.patterns.importSourcesDialog.nothingSelected');
    return total()
      ? translate('velvet.patterns.importSourcesDialog.selectedSourcesItems', { count, items: total() })
      : translate('velvet.patterns.importSourcesDialog.selectedSources', { count });
  };
  const toggle = (id: string) => setSelected((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]));

  /** Runs one async action while blocking every other; failures become the inline message and reach `onError`. */
  const run = async (action: string, task: () => void | Promise<void>, failure: ImportFailure, message: string) => {
    if (busy()) return;
    setBusy(action);
    setError(null);
    try {
      await task();
    } catch (cause) {
      setError(message);
      props.onError?.(cause, failure);
    } finally {
      setBusy(null);
    }
  };
  const doImport = () => {
    const onImport = props.onImport;
    const ids = selected();
    return run(
      IMPORT_ACTION,
      () => onImport?.(ids),
      { kind: 'import' },
      translate('velvet.patterns.importSourcesDialog.importFailed'),
    );
  };
  const connect = (source: ImportSource) => {
    const onConnect = props.onConnect;
    return run(
      source.id,
      () => onConnect?.(source.id),
      { kind: 'connect', source },
      translate('velvet.patterns.importSourcesDialog.connectFailed', { name: source.name }),
    );
  };

  return (
    <Dialog
      open={props.open}
      onClose={busy() ? undefined : props.onClose}
      dismissible={!busy()}
      title={props.title ?? translate('velvet.patterns.importSourcesDialog.title')}
      description={translate('velvet.patterns.importSourcesDialog.description')}
      size="md"
      footer={
        <>
          <span class="vui-imports__sum">{summary()}</span>
          <Button variant="secondary" onClick={() => props.onClose?.()} disabled={!!busy()}>
            {translate('velvet.common.cancel')}
          </Button>
          <Button
            loading={busy() === IMPORT_ACTION}
            disabled={!selected().length || !!busy()}
            onClick={() => void doImport()}
          >
            {translate('velvet.patterns.importSourcesDialog.import')}
          </Button>
        </>
      }
    >
      <Show when={error()}>
        {(message) => (
          <div class="vui-confirm__err" role="alert" style={{ 'margin-bottom': '12px' }}>
            <Glyph name="alert-circle" />
            {message()}
          </div>
        )}
      </Show>
      <div class="vui-imports">
        <For each={groups()}>
          {(group) => (
            <div class="vui-imports__group">
              <SectionLabel class="vui-imports__h">{group.label}</SectionLabel>
              <ul>
                <For each={group.sources}>
                  {(source) => {
                    const on = () => selected().includes(source.id);
                    const connected = () => source.status === 'connected';
                    return (
                      <li>
                        <ListItem
                          as="label"
                          class={cx('vui-imports__row', !connected() && 'vui-imports__row--off')}
                          selected={on()}
                          leading={
                            <>
                              <Show when={connected()} fallback={<span class="vui-imports__spacer" />}>
                                <Checkbox checked={on()} onChange={() => toggle(source.id)} />
                              </Show>
                              <IconTile icon={source.icon ?? 'database'} outline color={source.color} />
                            </>
                          }
                          title={source.name}
                          description={
                            source.status === 'error' ? (
                              <span class="vui-imports__err">
                                {source.error ?? translate('velvet.patterns.importSourcesDialog.connectionExpired')}
                              </span>
                            ) : (
                              source.description
                            )
                          }
                          trailing={
                            <>
                              <Show when={source.count != null && connected()}>
                                <span class="vui-imports__count">{source.count?.toLocaleString()}</span>
                              </Show>
                              <Show when={!connected() && props.onConnect}>
                                <Button
                                  size="sm"
                                  variant={source.status === 'error' ? 'secondary' : 'soft'}
                                  loading={busy() === source.id}
                                  disabled={!!busy()}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    void connect(source);
                                  }}
                                >
                                  {translate(
                                    source.status === 'error'
                                      ? 'velvet.patterns.importSourcesDialog.reconnect'
                                      : 'velvet.patterns.importSourcesDialog.connect',
                                  )}
                                </Button>
                              </Show>
                            </>
                          }
                        />
                      </li>
                    );
                  }}
                </For>
              </ul>
            </div>
          )}
        </For>
      </div>
    </Dialog>
  );
};
