import type { I18nKey } from '@jankrajewskiit/i18n';
import { createMemo, For, type JSX, mergeProps, Show } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { Badge } from '../display/Badge';
import { OptionSwitcher } from '../forms/OptionSwitcher';
import { Glyph } from '../primitives/Glyph';
import { Heading } from '../primitives/Heading';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { VisuallyHidden } from '../primitives/VisuallyHidden';
import { isOneOf } from './oneOf';
import styles from './PricingTable.module.css';

export const BILLINGS = Object.freeze(['monthly', 'yearly'] as const);
export type Billing = (typeof BILLINGS)[number];

export type PerBilling<T> = T | Record<Billing, T>;

export interface PricingFeature {
  label: JSX.Element;
  included?: boolean;
}

export interface PricingTier {
  id?: string;
  name: string;
  price: PerBilling<string>;
  /** Overrides periods[billing]; '' hides it */
  period?: PerBilling<string>;
  /** Small line under the price, e.g. "billed yearly" */
  note?: PerBilling<string>;
  blurb?: JSX.Element;
  features?: Array<JSX.Element | PricingFeature>;
  /** Lead-in above features, e.g. "Everything in Starter, plus" */
  includes?: JSX.Element;
  /** @default localized "Choose {name}" */
  cta?: string;
  featured?: boolean;
  /** Flag text on the featured tier. @default featuredLabel */
  badge?: string;
}

export interface PricingTableProps {
  tiers: PricingTier[];
  billing?: Billing;
  /** @default 'monthly' */
  defaultBilling?: Billing;
  onBillingChange?: (billing: Billing) => void;
  /** @default localized { monthly: "Monthly", yearly: "Yearly" } */
  billingLabels?: Record<Billing, string>;
  /** @default localized { monthly: "/ month", yearly: "/ year" } */
  periods?: Record<Billing, string>;
  /** Badge next to the switch, e.g. "2 months free" */
  yearlyNote?: string;
  /** id (or name) of the user's plan */
  current?: string;
  /** @default localized "Most popular" */
  featuredLabel?: string;
  onSelect?: (tier: PricingTier, billing: Billing) => void;
  class?: string;
}

const BILLING_LABEL_KEYS: Record<Billing, I18nKey> = {
  monthly: 'velvet.patterns.pricingTable.billing.monthly',
  yearly: 'velvet.patterns.pricingTable.billing.yearly',
};

const PERIOD_KEYS: Record<Billing, I18nKey> = {
  monthly: 'velvet.patterns.pricingTable.periods.monthly',
  yearly: 'velvet.patterns.pricingTable.periods.yearly',
};

const pick = (value: PerBilling<string>, billing: Billing): string =>
  typeof value === 'string' ? value : value[billing];

const isPerBilling = (value: PerBilling<string> | undefined): value is Record<Billing, string> =>
  typeof value === 'object';

/** Feature entries are plain `{ label }` objects; anything else is renderable content. */
const isFeature = (entry: JSX.Element | PricingFeature): entry is PricingFeature =>
  typeof entry === 'object' && entry !== null && Object.getPrototypeOf(entry) === Object.prototype && 'label' in entry;

/**
 * Plan comparison cards in a responsive grid (stack on mobile). One featured tier only — a flag, brand outline and the only primary button are the
 * whole hierarchy. Prices may be per billing period: then a Monthly / Yearly switch appears and the amount fades on change. Non-numeric prices
 * ("Talk to us") drop the period. `current` marks the user's plan.
 */
export const PricingTable = (props: PricingTableProps) => {
  const p = mergeProps({ defaultBilling: 'monthly' } satisfies Partial<PricingTableProps>, props);
  const translate = useTranslate();
  const billingLabel = (value: Billing) => p.billingLabels?.[value] ?? translate(BILLING_LABEL_KEYS[value]);
  const periodLabel = (value: Billing) => p.periods?.[value] ?? translate(PERIOD_KEYS[value]);
  const featuredLabel = () => p.featuredLabel ?? translate('velvet.patterns.pricingTable.mostPopular');
  const [billing, setBilling] = createControllable<Billing>({
    value: () => p.billing,
    defaultValue: p.defaultBilling,
    onChange: (next) => p.onBillingChange?.(next),
  });
  const hasBilling = createMemo(() => p.tiers.some((tier) => isPerBilling(tier.price)));
  const billingOptions = createMemo(() => BILLINGS.map((value) => ({ value, label: billingLabel(value) })));

  return (
    <section class={cx(typographyClass('body'), styles.pricing, p.class)}>
      <Show when={hasBilling()}>
        <div class={styles.pricingPartBar}>
          <OptionSwitcher
            label={translate('velvet.patterns.pricingTable.billingPeriod')}
            options={billingOptions()}
            value={billing()}
            onValueChange={(value) => {
              if (isOneOf(BILLINGS, value)) setBilling(value);
            }}
          />
          <Show when={p.yearlyNote}>
            <Badge size="sm" tone={billing() === 'yearly' ? 'success' : 'neutral'}>
              {p.yearlyNote}
            </Badge>
          </Show>
        </div>
      </Show>
      <ul class={styles.pricingPartGrid}>
        <For each={p.tiers}>
          {(tier) => {
            const isCurrent = () => p.current != null && p.current === (tier.id ?? tier.name);
            const price = () => pick(tier.price, billing());
            const numeric = () => /\d/u.test(price());
            const period = () => {
              if (tier.period !== undefined) return pick(tier.period, billing());
              return isPerBilling(tier.price) ? periodLabel(billing()) : undefined;
            };
            const note = () => (tier.note === undefined ? undefined : pick(tier.note, billing()));
            return (
              <li
                class={cx(
                  styles.pricingPartTier,
                  tier.featured && styles.pricingPartTierVariantFeatured,
                  isCurrent() && 'vui-pricing__tier--current',
                )}
              >
                <Show when={tier.featured}>
                  <Text as="span" variant="overline" tone="inherit" class={styles.pricingPartFlag}>
                    {tier.badge || featuredLabel()}
                  </Text>
                </Show>
                <div class={styles.pricingPartHead}>
                  <Heading level={3} variant="title-lg" class={styles.pricingPartName}>
                    {tier.name}
                  </Heading>
                  <Show when={isCurrent()}>
                    <Badge size="sm">{translate('velvet.patterns.pricingTable.current')}</Badge>
                  </Show>
                </div>
                <Show when={tier.blurb}>
                  <Text as="p" variant="body-sm" tone="secondary" class={styles.pricingPartBlurb}>
                    {tier.blurb}
                  </Text>
                </Show>
                <div class={styles.pricingPartPrice}>
                  {/* Keyed on the billing period so the amount remounts and replays its fade. */}
                  <Show when={billing()} keyed>
                    <Text as="span" variant={numeric() ? 'h1' : 'h3'} tone="inherit" class={styles.pricingPartAmount}>
                      {price()}
                    </Text>
                  </Show>
                  <Show when={numeric() && period()}>
                    <Text as="span" variant="body-sm" tone="tertiary" class="vui-pricing__period">
                      {period()}
                    </Text>
                  </Show>
                </div>
                <Show when={hasBilling()}>
                  <Text as="div" variant="caption" tone="tertiary" class={styles.pricingPartNote}>
                    {note() || ' '}
                  </Text>
                </Show>
                <Button
                  block
                  variant={tier.featured && !isCurrent() ? 'primary' : 'secondary'}
                  disabled={isCurrent()}
                  onClick={() => p.onSelect?.(tier, billing())}
                >
                  {isCurrent()
                    ? translate('velvet.patterns.pricingTable.currentPlan')
                    : tier.cta || translate('velvet.patterns.pricingTable.choose', { name: tier.name })}
                </Button>
                <Show when={(tier.features ?? []).length > 0}>
                  <div class={styles.pricingPartList}>
                    <Show when={tier.includes}>
                      <Text as="div" variant="label-sm" tone="inherit" class={styles.pricingPartInc}>
                        {tier.includes}
                      </Text>
                    </Show>
                    <ul class={styles.pricingPartFeatures}>
                      <For each={tier.features}>
                        {(entry) => {
                          const feature: PricingFeature = isFeature(entry) ? entry : { label: entry };
                          const excluded = feature.included === false;
                          return (
                            <li class={excluded ? styles.pricingPartOff : undefined}>
                              <Glyph name={excluded ? 'minus' : 'check'} />
                              <Text as="span" variant="body-sm" tone="inherit">
                                {feature.label}
                                <Show when={excluded}>
                                  <VisuallyHidden>
                                    {' '}
                                    {translate('velvet.patterns.pricingTable.notIncluded')}
                                  </VisuallyHidden>
                                </Show>
                              </Text>
                            </li>
                          );
                        }}
                      </For>
                    </ul>
                  </div>
                </Show>
              </li>
            );
          }}
        </For>
      </ul>
    </section>
  );
};
