import { For } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Tag } from '../display/Tag';
import { SectionLabel } from '../primitives/SectionLabel';
import { Text } from '../primitives/Text';
import styles from './AtsKeywordList.module.css';

export interface AtsKeywordListProps {
  matched: string[];
  partial: string[];
  missing: string[];
}

/** Keyword coverage: found / partially matched / missing. Status shows as icon and text, not colour alone. */
export const AtsKeywordList = (props: AtsKeywordListProps) => {
  const translate = useTranslate();
  const total = () => props.matched.length + props.partial.length + props.missing.length;
  return (
    <section class={styles.atsPartSec}>
      <SectionLabel
        as="h4"
        class={styles.atsPartH}
        end={
          <Text as="span" variant="body" class="vui-ats__hc">
            {translate('velvet.patterns.atsKeywordList.found', { found: props.matched.length, total: total() })}
          </Text>
        }
      >
        {translate('velvet.patterns.atsKeywordList.title')}
      </SectionLabel>
      <div class="vui-ats__kws">
        <For each={props.matched}>
          {(keyword) => (
            <Tag size="sm" shape="pill" variant="soft" tone="success" icon="check">
              {keyword}
            </Tag>
          )}
        </For>
        <For each={props.partial}>
          {(keyword) => (
            <Tag
              size="sm"
              shape="pill"
              variant="soft"
              tone="warning"
              title={translate('velvet.patterns.atsKeywordList.partial')}
              icon={<span aria-hidden="true">≈</span>}
            >
              {keyword}
            </Tag>
          )}
        </For>
        <For each={props.missing}>
          {(keyword) => (
            <Tag size="sm" shape="pill" variant="dashed" icon="x">
              {keyword}
              <Text as="span" variant="caption" tone="inherit" class={styles.srOnly}>
                {' '}
                {translate('velvet.patterns.atsKeywordList.missing')}
              </Text>
            </Tag>
          )}
        </For>
      </div>
    </section>
  );
};
