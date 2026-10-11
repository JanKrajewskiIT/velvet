import * as React from 'react';
export interface QueryField { key: string; label: string; /** @default 'text' */ type?: 'text' | 'number' | 'select' | 'date' | 'boolean'; options?: { value: string; label: string }[]; placeholder?: string; /** Allowed operator ids for this field (subset of its type's operators, kept in that order). Omit = all. */ operators?: string[]; }
export interface QueryRule { id: string; field: string; op: string; value: string; }
export interface QueryGroup { id: string; combinator: 'and' | 'or'; rules: Array<QueryRule | QueryGroup>; }
/**
 * Visual condition builder for segments, automations and advanced search: "Where Status is Active AND (Plan is Pro OR Seats > 10)".
 * Operators follow the field type (narrow per field with `operators`); the combinator toggles on the second row of each group. Groups nest up to maxDepth.
 * For quick faceted filtering use FilterBar; QueryBuilder is for saved, precise rules.
 */
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
  /** Read-only: every control disabled, query still visible. @default false */
  disabled?: boolean;
  /** Up/down buttons on each condition and group to reorder siblings (keyboard-accessible, labelled). @default false */
  reorderable?: boolean;
  /** "Clear all" on the root group — leaves an empty root (same id + combinator); the last root condition becomes removable too. @default false */
  clearable?: boolean;
  /** Fires after Clear all with the emptied query (onChange fires as well). */
  onClear?: (query: QueryGroup) => void;
  className?: string;
}
export declare function QueryBuilder(props: QueryBuilderProps): JSX.Element;
export declare function emptyQuery(fields: QueryField[]): QueryGroup;
/** Empty root group keeping the query's id and combinator. */
export declare function clearQuery(query: QueryGroup): QueryGroup;
export declare function describeQuery(query: QueryGroup, fields: QueryField[]): string;
