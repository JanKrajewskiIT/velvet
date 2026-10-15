import { For, Show } from 'solid-js';

import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { SectionLabel } from '../primitives/SectionLabel';
import { Text } from '../primitives/Text';
import styles from './AiResultSections.module.css';
import type { AiSection } from './aiResultTypes';

const AI_PART_SEC_CLASSES = {
  brand: styles.aiPartSecVariantBrand,
  success: styles.aiPartSecVariantSuccess,
  warning: styles.aiPartSecVariantWarning,
  danger: styles.aiPartSecVariantDanger,
  info: styles.aiPartSecVariantInfo,
} as const;

export interface AiResultSectionsProps {
  sections: AiSection[];
}

/** Titled finding lists, each with an item count. */
export const AiResultSections = (props: AiResultSectionsProps) => (
  <Show when={props.sections.length > 0}>
    <div class={styles.aiPartSecs}>
      <For each={props.sections}>
        {(section) => (
          <section class={cx('vui-ai__sec', section.tone && variantClass(AI_PART_SEC_CLASSES, section.tone))}>
            <SectionLabel
              as="h4"
              class={styles.aiPartSecH}
              tone="secondary"
              icon={section.icon}
              end={
                <Text as="span" variant="label-sm" tone="tertiary">
                  {section.items.length}
                </Text>
              }
            >
              {section.title}
            </SectionLabel>
            <ul class={styles.aiPartItems}>
              <For each={section.items}>
                {(item) => (
                  <Text as="li" variant="body-sm" tone="inherit">
                    {item}
                  </Text>
                )}
              </For>
            </ul>
          </section>
        )}
      </For>
    </div>
  </Show>
);
