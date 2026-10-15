import { createUniqueId, type JSX, mergeProps, Show } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Heading } from '../primitives/Heading';
import { Text } from '../primitives/Text';
import styles from './FormSection.module.css';

const FORMSEC_CLASSES = {
  divider: styles.formsecVariantDivider,
  aside: styles.formsecVariantAside,
} as const;

export interface FormSectionProps {
  title?: JSX.Element;
  description?: JSX.Element;
  /** `aside` = settings-page style: title and description in a left column, fields on the right (stacks under 768px). @default 'stacked' */
  layout?: 'stacked' | 'aside';
  /** Hairline above the section. */
  divider?: boolean;
  /** Right side of the header (stacked). */
  actions?: JSX.Element;
  class?: string;
  children?: JSX.Element;
}

/** Titled group of fields. */
export const FormSection = (props: FormSectionProps) => {
  const p = mergeProps({ layout: 'stacked' } satisfies Partial<FormSectionProps>, props);
  const titleId = createUniqueId();
  return (
    <section
      class={cx(
        styles.formsec,
        variantClass(FORMSEC_CLASSES, p.layout),
        p.divider && styles.formsecVariantDivider,
        p.class,
      )}
      aria-labelledby={p.title ? titleId : undefined}
    >
      <Show when={p.title || p.description || p.actions}>
        <header class={styles.formsecPartHead}>
          <div class={styles.formsecPartHt}>
            <Show when={p.title}>
              <Heading level={3} variant="title" id={titleId} class={styles.formsecPartTitle}>
                {p.title}
              </Heading>
            </Show>
            <Show when={p.description}>
              <Text as="p" variant="body-sm" tone="inherit" class={styles.formsecPartDesc}>
                {p.description}
              </Text>
            </Show>
          </div>
          <Show when={p.actions}>
            <div class="vui-formsec__actions">{p.actions}</div>
          </Show>
        </header>
      </Show>
      <div class={styles.formsecPartBody}>{p.children}</div>
    </section>
  );
};
