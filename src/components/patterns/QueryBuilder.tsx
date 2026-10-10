import { mergeProps, Show, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { Button } from '../actions/Button';
import { SectionLabel } from '../primitives/SectionLabel';
import { QueryGroupEditor } from './QueryGroupEditor';
import { describeQuery, emptyQuery, type QueryField, type QueryGroup } from './queryModel';

export type { QueryField, QueryFieldType, QueryGroup, QueryNode, QueryOperatorValue, QueryRule } from './queryModel';
export { describeQuery, emptyQuery } from './queryModel';

export interface QueryBuilderProps {
  fields: QueryField[];
  value?: QueryGroup;
  defaultValue?: QueryGroup;
  onChange?: (query: QueryGroup) => void;
  /** Preferred name — same callback as onChange (onChange stays as an alias). */
  onValueChange?: (query: QueryGroup) => void;
  /** 1 = flat list, 2 = one level of groups. @default 2 */
  maxDepth?: number;
  /** Readable one-line version under the builder */
  showSummary?: boolean;
  disabled?: boolean;
  /** Offer accessible move-up/down controls for rules and groups. @default true */
  reorderable?: boolean;
  class?: string;
}

/**
 * Visual condition builder for segments, automations and advanced search: "Where Status is Active AND (Plan is Pro OR Seats > 10)".
 * Operators follow the field type; the combinator toggles on the second row of each group. Groups nest up to `maxDepth`.
 * For quick faceted filtering use FilterBar; QueryBuilder is for saved, precise rules.
 */
export const QueryBuilder = (props: QueryBuilderProps) => {
  const p = mergeProps(
    { maxDepth: 2, showSummary: false, reorderable: true } satisfies Partial<QueryBuilderProps>,
    props,
  );
  const translate = useTranslate();
  const [query, setQuery] = createControllable<QueryGroup>({
    value: () => p.value,
    defaultValue: untrack(() => p.defaultValue ?? emptyQuery(p.fields)),
    onChange: (next) => (p.onChange ?? p.onValueChange)?.(next),
  });

  return (
    <div class={cx('vui-qb', p.class)}>
      <QueryGroupEditor
        group={query()}
        fields={p.fields}
        depth={0}
        maxDepth={p.maxDepth}
        disabled={p.disabled}
        reorderable={p.reorderable}
        onChange={(next) => {
          if (!p.disabled) setQuery(next);
        }}
        onRemove={() => undefined}
      />
      <Show when={query().rules.length > 0}>
        <Button
          variant="ghost"
          size="sm"
          disabled={p.disabled}
          onClick={() => {
            if (!p.disabled) setQuery({ ...query(), rules: [] });
          }}
        >
          {translate('velvet.patterns.queryBuilder.clearRules')}
        </Button>
      </Show>
      <Show when={p.showSummary}>
        <div class="vui-qb__summary">
          <SectionLabel as="span">{translate('velvet.patterns.queryBuilder.query')}</SectionLabel>
          <code>{describeQuery(query(), p.fields, translate)}</code>
        </div>
      </Show>
    </div>
  );
};
