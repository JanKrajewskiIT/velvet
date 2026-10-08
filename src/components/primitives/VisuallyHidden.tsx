import { createEffect, createSignal, type JSX, mergeProps, onCleanup, splitProps } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { type ElementTag, type HtmlProps, Polymorphic } from '../../utils/polymorphic';

export interface VisuallyHiddenProps extends HtmlProps<HTMLElement> {
  /** @default 'span' */
  as?: ElementTag;
  /** Becomes visible when it (or a child) receives focus. */
  focusable?: boolean;
}

/** Content for screen readers only — extra context for icon buttons, table captions and form group names. */
export const VisuallyHidden = (props: VisuallyHiddenProps) => {
  const merged = mergeProps({ as: 'span' } satisfies VisuallyHiddenProps, props);
  const [local, rest] = splitProps(merged, ['as', 'focusable', 'class']);
  return (
    <Polymorphic
      tag={local.as}
      class={cx('vui-sr-only', local.focusable && 'vui-sr-only--focusable', local.class)}
      {...rest}
    />
  );
};

export interface SkipLinkProps {
  /** Id of the main landmark. @default '#main' */
  href?: string;
  /** @default localized "Skip to main content" */
  children?: JSX.Element;
  class?: string;
}

/** First focusable element on the page; moves focus to the target landmark (adds `tabindex=-1` if needed). */
export const SkipLink = (props: SkipLinkProps) => {
  const p = mergeProps({ href: '#main' } satisfies SkipLinkProps, props);
  const translate = useTranslate();
  const go: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = (e) => {
    const target = p.href.startsWith('#') ? document.getElementById(p.href.slice(1)) : null;
    if (!target) return;
    e.preventDefault();
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus();
  };
  return (
    <a href={p.href} class={cx('vui-skiplink', p.class)} onClick={go}>
      {p.children ?? translate('velvet.primitives.skipLink.label')}
    </a>
  );
};

const LIVE_REGION_DELAY_MS = 60;

export interface LiveRegionProps {
  /** To repeat an identical message pass a new object: `{ text: 'Saved', id: Date.now() }`. */
  message?: string | { text: string; id?: string | number };
  /** assertive interrupts — reserve it for errors. @default 'polite' */
  politeness?: 'polite' | 'assertive';
  /** Milliseconds before the text clears; 0 keeps it. @default 5000 */
  clearAfter?: number;
  /** Also show the text (status line) instead of hiding it. */
  visible?: boolean;
  class?: string;
}

/** Announces dynamic changes ("3 results", "Saved") to screen readers. Mount it once, then change `message`. */
export const LiveRegion = (props: LiveRegionProps) => {
  const p = mergeProps({ politeness: 'polite', clearAfter: 5000 } satisfies LiveRegionProps, props);
  const [shown, setShown] = createSignal('');

  createEffect(() => {
    const message = p.message;
    const text = typeof message === 'object' ? message.text : message;
    setShown('');
    if (!text) return;
    // Clearing first, then writing after a tick, makes screen readers announce a repeated message again.
    const show = setTimeout(() => setShown(text), LIVE_REGION_DELAY_MS);
    const clear = p.clearAfter ? setTimeout(() => setShown(''), p.clearAfter + LIVE_REGION_DELAY_MS) : undefined;
    onCleanup(() => {
      clearTimeout(show);
      clearTimeout(clear);
    });
  });

  return (
    <div
      role={p.politeness === 'assertive' ? 'alert' : 'status'}
      aria-live={p.politeness}
      aria-atomic="true"
      class={cx(p.visible ? 'vui-live' : 'vui-sr-only', p.class)}
    >
      {shown()}
    </div>
  );
};
