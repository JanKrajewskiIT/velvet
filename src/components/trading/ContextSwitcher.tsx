import { createEffect, createMemo, createSignal, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { reportAsyncError } from '../../utils/reportAsyncError';
import { ConfirmDialog } from '../feedback/ConfirmDialog';
import { Menu } from '../menus/Menu';
import type { MenuItem } from '../menus/menuItem';
import { NavbarChip } from '../navigation/NavbarChip';
import { type ContextConfirmation, resolveContextTemplate, sameContext } from './contextConfirmation';
import styles from './ContextSwitcher.module.css';
import { ContextSwitcherLabel } from './ContextSwitcherLabel';
import type { ContextItem, ContextSwitcherProps } from './contextSwitcherTypes';
import { dispatchTradingAction } from './dispatchTradingAction';

const DEFAULT_WIDTH = 300;
const NO_CONTEXTS: readonly ContextItem[] = Object.freeze([]);
const NO_EXTRA_ITEMS: readonly MenuItem[] = Object.freeze([]);

export const ContextSwitcher = (props: ContextSwitcherProps) => {
  const p = mergeProps(
    {
      items: NO_CONTEXTS,
      extraItems: NO_EXTRA_ITEMS,
      confirmTone: 'danger',
      tone: 'on-color',
      width: DEFAULT_WIDTH,
      align: 'end',
    } satisfies Partial<ContextSwitcherProps>,
    props,
  );
  const translate = useTranslate();
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [request, setRequest] = createSignal<ContextConfirmation>();
  let trigger: HTMLElement | undefined;
  const byId = createMemo(() => {
    const result = new Map<string, ContextItem>();
    for (const item of p.items) {
      if (typeof item.id !== 'string' || result.has(item.id)) {
        throw new RangeError('ContextSwitcher items must have unique string ids.');
      }
      if (item.label != null && typeof item.label !== 'string' && typeof item.label !== 'function') {
        throw new TypeError('ContextSwitcher labels must be strings or JSX factories.');
      }
      result.set(item.id, item);
    }
    return result;
  });
  const current = createMemo(() => {
    const items = byId();
    return (p.value === undefined ? undefined : items.get(p.value)) ?? p.items[0];
  });
  const targetOf = (pair: ContextConfirmation) => byId().get(pair.next.id);
  const valid = (pair: ContextConfirmation) =>
    sameContext(current(), pair.current) && sameContext(targetOf(pair), pair.next) && pair.action === p.onValueChange;

  createEffect(() => {
    const pair = request();
    if (pair && !valid(pair)) setRequest(undefined);
  });
  const pick = (id: string) => {
    const next = byId().get(id);
    const previous = current();
    if (!next || !previous || next.id === previous.id) return;
    const pair: ContextConfirmation = { next: { ...next }, current: { ...previous }, action: p.onValueChange };
    let ask: boolean;
    try {
      ask = p.confirmWhen?.(next, previous) ?? false;
    } catch (error) {
      reportAsyncError(error);
      return;
    }
    setMenuOpen(false);
    trigger?.focus({ preventScroll: true });
    if (!valid(pair)) return;
    if (ask) {
      setRequest(pair);
      return;
    }
    dispatchTradingAction(() => pair.action?.(next.id, next));
  };
  const confirm = (pair: ContextConfirmation) => {
    if (request() !== pair) return;
    const next = targetOf(pair);
    setRequest(undefined);
    if (next && valid(pair)) dispatchTradingAction(() => pair.action?.(next.id, next));
  };
  const items = createMemo((): MenuItem[] => [
    ...(p.sectionLabel ? [{ section: p.sectionLabel }] : []),
    ...p.items.map((item) => ({
      // Menu content mounts under its own owner; rich labels also render separately in the chip.
      get label() {
        return <ContextSwitcherLabel item={item} />;
      },
      description: item.description,
      icon: item.icon,
      checked: item.id === current()?.id,
      onSelect: () => pick(item.id),
    })),
    ...(p.extraItems.length ? [{ divider: true }, ...p.extraItems] : []),
  ]);

  return (
    <>
      <Menu
        align={p.align}
        width={p.width}
        items={items()}
        open={menuOpen()}
        onOpenChange={(open) => {
          if (!open || !request()) setMenuOpen(open);
        }}
        trigger={
          <NavbarChip
            ref={(element) => {
              trigger = element;
            }}
            tone={p.tone}
            icon={p.icon || current()?.icon || 'briefcase'}
            label={p.label}
            class={cx(styles.root, p.class)}
            data-ctx-tone={current()?.tone}
          >
            <Show
              when={p.children != null}
              fallback={
                <Show when={current()} fallback={translate('velvet.trading.contextSwitcher.selectContext')}>
                  {(item) => <ContextSwitcherLabel item={item()} />}
                </Show>
              }
            >
              {p.children}
            </Show>
          </NavbarChip>
        }
      />
      <Show when={request()} keyed>
        {(pair) => (
          <ConfirmDialog
            open={valid(pair)}
            tone={p.confirmTone}
            title={
              <Show
                when={p.confirmTitle !== undefined}
                fallback={translate('velvet.trading.contextSwitcher.confirmTitle')}
              >
                {resolveContextTemplate(p.confirmTitle, pair)}
              </Show>
            }
            description={
              <Show when={p.confirmDescription !== undefined}>
                {resolveContextTemplate(p.confirmDescription, pair)}
              </Show>
            }
            confirmLabel={resolveContextTemplate(
              p.confirmLabel ?? translate('velvet.trading.contextSwitcher.confirmLabel'),
              pair,
            )}
            cancelLabel={resolveContextTemplate(p.cancelLabel ?? translate('velvet.common.cancel'), pair)}
            onCancel={() => setRequest(undefined)}
            onConfirm={() => confirm(pair)}
          />
        )}
      </Show>
    </>
  );
};
