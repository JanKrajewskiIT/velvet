import { createMemo, createSignal, For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { variantClass } from '../../utils/cssModule';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { IconTile } from '../primitives/IconTile';
import { SectionLabel } from '../primitives/SectionLabel';
import { Text } from '../primitives/Text';
import { typographyClass } from '../primitives/typography';
import { type AtsRecommendation, SEVERITY, VISIBLE_RECOMMENDATIONS } from './atsAnalysis';
import styles from './AtsRecommendationList.module.css';

const ATS_PART_REC_VARIANT_CLASSES = {
  danger: styles.atsPartRecVariantDanger,
} as const;

export interface AtsRecommendationListProps {
  /** Already sorted critical → warning → suggestion. */
  recommendations: AtsRecommendation[];
}

/** Ranked recommendations with evidence quotes; shows the first few and expands on demand. */
export const AtsRecommendationList = (props: AtsRecommendationListProps) => {
  const translate = useTranslate();
  const [showAll, setShowAll] = createSignal(false);
  const visible = createMemo(() =>
    showAll() ? props.recommendations : props.recommendations.slice(0, VISIBLE_RECOMMENDATIONS),
  );

  return (
    <section class={styles.atsPartSec}>
      <SectionLabel as="h4" class={styles.atsPartH}>
        {translate('velvet.patterns.atsRecommendationList.title')}
      </SectionLabel>
      <ul class={styles.atsPartRecs}>
        <For each={visible()}>
          {(recommendation) => {
            const severity = () => SEVERITY[recommendation.severity];
            return (
              <li class={cx(styles.atsPartRec, variantClass(ATS_PART_REC_VARIANT_CLASSES, severity().tone))}>
                <IconTile
                  size="xs"
                  tone={severity().tone === 'info' ? 'brand' : severity().tone}
                  icon={severity().icon}
                />
                <div class={styles.atsPartRbody}>
                  <div class={cx(styles.atsPartRh, typographyClass('body-sm'))}>
                    <Text as="b" variant="label" tone="inherit">
                      {recommendation.title}
                    </Text>
                    <Text as="span" variant="micro" tone="tertiary" class={styles.atsPartRsev}>
                      {translate(severity().labelKey)}
                    </Text>
                  </div>
                  <Show when={recommendation.message}>
                    <Text as="p" variant="body-sm" tone="secondary">
                      {recommendation.message}
                    </Text>
                  </Show>
                  <Show when={recommendation.evidence}>
                    {(evidence) => (
                      <Text as="blockquote" variant="caption" tone="secondary" class={styles.atsPartEv}>
                        <Text as="span" variant="body-sm" tone="inherit">
                          “{evidence().quote}”
                        </Text>
                        <Show when={evidence().source}>
                          <Text as="cite" variant="caption" tone="inherit">
                            — {evidence().source}
                          </Text>
                        </Show>
                      </Text>
                    )}
                  </Show>
                </div>
              </li>
            );
          }}
        </For>
      </ul>
      <Show when={props.recommendations.length > VISIBLE_RECOMMENDATIONS}>
        <Button
          variant="link"
          size="sm"
          class={styles.atsPartMore}
          iconRight={showAll() ? 'chevron-up' : 'chevron-down'}
          aria-expanded={showAll()}
          onClick={() => setShowAll(!showAll())}
        >
          {showAll()
            ? translate('velvet.patterns.atsRecommendationList.showFewer')
            : translate('velvet.patterns.atsRecommendationList.showAll', { count: props.recommendations.length })}
        </Button>
      </Show>
    </section>
  );
};
