import { mergeProps, Show, untrack } from 'solid-js';

import { createControllable } from '../../hooks/createControllable';
import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { SectionLabel } from '../primitives/SectionLabel';
import { QueryGroupEditor } from './QueryGroupEditor';
import { describeQuery, emptyQuery, type QueryField, type QueryGroup } from './queryModel';

export type { QueryField, QueryGroup, QueryRule } from './queryModel';
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
  class?: string;
}

/**
 * Visual condition builder for segments, automations and advanced search: "Where Status is Active AND (Plan is Pro OR Seats > 10)".
 * Operators follow the field type; the combinator toggles on the second row of each group. Groups nest up to `maxDepth`.
 * For quick faceted filtering use FilterBar; QueryBuilder is for saved, precise rules.
 */
export const QueryBuilder = (props: QueryBuilderProps) => {
  const p = mergeProps({ maxDepth: 2, showSummary: false } satisfies Partial<QueryBuilderProps>, props);
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
        onChange={setQuery}
        onRemove={() => undefined}
      />
      <Show when={p.showSummary}>
        <div class="vui-qb__summary">
          <SectionLabel as="span">{translate('velvet.patterns.queryBuilder.query')}</SectionLabel>
          <code>{describeQuery(query(), p.fields, translate)}</code>
        </div>
      </Show>
    </div>
  );
};
