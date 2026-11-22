import { type JSX } from '@solidjs/web';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { withDefaults } from '../../utils/props';
import styles from './SkipLink.module.css';
import { typographyClass } from './typography';

export interface SkipLinkProps {
  /** Id of the main landmark. @default '#main' */
  href?: string;
  /** @default localized "Skip to main content" */
  children?: JSX.Element;
  class?: string;
}

/** First focusable element on the page; moves focus to the target landmark (adds `tabindex=-1` if needed). */
export const SkipLink = (props: SkipLinkProps) => {
  const p = withDefaults({ href: '#main' } satisfies SkipLinkProps, props);
  const translate = useTranslate();
  const go: JSX.EventHandler<HTMLAnchorElement, MouseEvent> = (e) => {
    const target = p.href.startsWith('#') ? document.getElementById(p.href.slice(1)) : null;
    if (!target) return;
    e.preventDefault();
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus();
  };
  return (
    <a href={p.href} class={cx(typographyClass('label'), styles.skiplink, p.class)} onClick={go}>
      {p.children ?? translate('velvet.primitives.skipLink.label')}
    </a>
  );
};
