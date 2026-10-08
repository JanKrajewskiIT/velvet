import { For, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { FooterBrand } from './FooterBrand';
import { FooterLegal } from './FooterLegal';
import { FooterLinkItem } from './FooterLinkItem';
import { FooterStatus } from './FooterStatus';
import type { FooterColumn, FooterLink, FooterSocialLink, FooterStatusValue } from './footerTypes';

const HTTP_URL = /^https?:/u;

export interface FooterProps {
  /** @default 'full' */
  variant?: 'full' | 'compact';
  /** card = bordered, rounded; page = full-bleed, top border only. @default 'card' */
  surface?: 'card' | 'page';
  /** Product name. */
  brand?: JSX.Element;
  /** Mark tile content — letter, `<img>` or icon. Defaults to the brand's first letter; `null` hides it. */
  mark?: JSX.Element | null;
  description?: JSX.Element;
  columns?: FooterColumn[];
  social?: FooterSocialLink[];
  legal?: FooterLink[];
  copyright?: JSX.Element;
  /** compact: extra text after the copyright — "v2.4.0". */
  meta?: JSX.Element;
  /** Link to a status page with a tone dot: 'ok' | 'degraded' | 'down' or `{ state, label, href }`. */
  status?: FooterStatusValue;
  /** Under the description — e.g. a newsletter Input + Button. */
  cta?: JSX.Element;
  /** Right end of the bar. */
  end?: JSX.Element;
  class?: string;
}

/** Product footer: a full brand + link columns + legal bar, or a compact single row for inside an app. */
export const Footer = (props: FooterProps) => {
  const p = mergeProps(
    {
      variant: 'full',
      surface: 'card',
      columns: [] as FooterColumn[],
      social: [] as FooterSocialLink[],
      legal: [] as FooterLink[],
    } satisfies FooterProps,
    props,
  );
  const translate = useTranslate();

  const compact = () => (
    <footer class={cx('vui-footer', 'vui-footer--compact', `vui-footer--${p.surface}`, p.class)}>
      <div class="vui-footer__left">
        <FooterBrand brand={p.brand} mark={p.mark} compact />
        <Show when={p.copyright}>
          <span class="vui-footer__copy">{p.copyright}</span>
        </Show>
        <Show when={p.meta}>
          <span class="vui-footer__meta">{p.meta}</span>
        </Show>
      </div>
      <FooterStatus status={p.status} />
      <FooterLegal links={p.legal} label={translate('velvet.layout.footer.navigation')} />
      <Show when={p.end}>
        <div class="vui-footer__end">{p.end}</div>
      </Show>
    </footer>
  );

  return (
    <Show when={p.variant !== 'compact'} fallback={compact()}>
      <footer class={cx('vui-footer', `vui-footer--${p.surface}`, p.class)}>
        <div class="vui-footer__main" style={{ '--cols': p.columns.length }}>
          <div class="vui-footer__intro">
            <FooterBrand brand={p.brand} mark={p.mark} />
            <Show when={p.description}>
              <p class="vui-footer__desc">{p.description}</p>
            </Show>
            <Show when={p.cta}>
              <div class="vui-footer__cta">{p.cta}</div>
            </Show>
            <Show when={p.social.length > 0}>
              <ul class="vui-footer__social" aria-label={translate('velvet.layout.footer.social')}>
                <For each={p.social}>
                  {(item) => (
                    <li>
                      <a
                        href={item.href || '#'}
                        class="vui-footer__soc"
                        aria-label={item.label}
                        title={item.label}
                        target={item.href && HTTP_URL.test(item.href) ? '_blank' : undefined}
                        rel="noreferrer"
                      >
                        <Glyph name={item.icon} />
                      </a>
                    </li>
                  )}
                </For>
              </ul>
            </Show>
          </div>
          <For each={p.columns}>
            {(column) => (
              <nav class="vui-footer__col" aria-label={column.title}>
                <details class="vui-footer__group" open>
                  <summary class="vui-footer__heading">
                    {column.title}
                    <Glyph name="chevron-down" />
                  </summary>
                  <ul>
                    <For each={column.links}>
                      {(link) => (
                        <li>
                          <FooterLinkItem link={link} />
                        </li>
                      )}
                    </For>
                  </ul>
                </details>
              </nav>
            )}
          </For>
        </div>
        <div class="vui-footer__bar">
          <Show when={p.copyright}>
            <span class="vui-footer__copy">{p.copyright}</span>
          </Show>
          <FooterLegal links={p.legal} label={translate('velvet.layout.footer.legal')} />
          <div class="vui-footer__end">
            <FooterStatus status={p.status} />
            {p.end}
          </div>
        </div>
      </footer>
    </Show>
  );
};
