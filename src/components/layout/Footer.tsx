import { For, type JSX, mergeProps, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import styles from './Footer.module.css';
import { FooterBrand } from './FooterBrand';
import { FooterLegal } from './FooterLegal';
import { FooterLinkItem } from './FooterLinkItem';
import { FooterStatus } from './FooterStatus';
import type { FooterColumn, FooterLink, FooterSocialLink, FooterStatusValue } from './footerTypes';

const FOOTER_CLASSES = {
  card: styles.footerVariantCard,
  page: styles.footerVariantPage,
  compact: styles.footerVariantCompact,
} as const;

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
    <footer
      class={cx(
        typographyClass('body'),
        styles.footer,
        styles.footerVariantCompact,
        variantClass(FOOTER_CLASSES, p.surface),
        p.class,
      )}
    >
      <div class={styles.footerPartLeft}>
        <FooterBrand brand={p.brand} mark={p.mark} compact />
        <Show when={p.copyright}>
          <Text as="span" variant="caption" tone="tertiary" class={styles.footerPartCopy}>
            {p.copyright}
          </Text>
        </Show>
        <Show when={p.meta}>
          <Text as="span" variant="caption" tone="inherit" class={styles.footerPartMeta}>
            {p.meta}
          </Text>
        </Show>
      </div>
      <FooterStatus status={p.status} />
      <FooterLegal links={p.legal} label={translate('velvet.layout.footer.navigation')} />
      <Show when={p.end}>
        <div class={styles.footerPartEnd}>{p.end}</div>
      </Show>
    </footer>
  );

  return (
    <Show when={p.variant !== 'compact'} fallback={compact()}>
      <footer class={cx(typographyClass('body'), styles.footer, variantClass(FOOTER_CLASSES, p.surface), p.class)}>
        <div class={styles.footerPartMain} style={{ '--cols': p.columns.length }}>
          <div class={styles.footerPartIntro}>
            <FooterBrand brand={p.brand} mark={p.mark} />
            <Show when={p.description}>
              <Text as="p" variant="body-sm" tone="secondary" class={styles.footerPartDesc}>
                {p.description}
              </Text>
            </Show>
            <Show when={p.cta}>
              <div class={styles.footerPartCta}>{p.cta}</div>
            </Show>
            <Show when={p.social.length > 0}>
              <ul class={styles.footerPartSocial} aria-label={translate('velvet.layout.footer.social')}>
                <For each={p.social}>
                  {(item) => (
                    <li>
                      <a
                        href={item.href || '#'}
                        class={styles.footerPartSoc}
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
              <nav class={styles.footerPartCol} aria-label={column.title}>
                <details class={styles.footerPartGroup} open>
                  <Text as="summary" variant="label" tone="primary" class={styles.footerPartHeading}>
                    {column.title}
                    <Glyph name="chevron-down" />
                  </Text>
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
        <div class={styles.footerPartBar}>
          <Show when={p.copyright}>
            <Text as="span" variant="caption" tone="tertiary" class={styles.footerPartCopy}>
              {p.copyright}
            </Text>
          </Show>
          <FooterLegal links={p.legal} label={translate('velvet.layout.footer.legal')} />
          <div class={styles.footerPartEnd}>
            <FooterStatus status={p.status} />
            {p.end}
          </div>
        </div>
      </footer>
    </Show>
  );
};
