import * as React from 'react';
export interface QueryField { key: string; label: string; /** @default 'text' */ type?: 'text' | 'number' | 'select' | 'date' | 'boolean'; options?: { value: string; label: string }[]; placeholder?: string; }
export interface QueryRule { id: string; field: string; op: string; value: string; }
export interface QueryGroup { id: string; combinator: 'and' | 'or'; rules: Array<QueryRule | QueryGroup>; }
/**
 * Visual condition builder for segments, automations and advanced search: "Where Status is Active AND (Plan is Pro OR Seats > 10)".
 * Operators follow the field type; the combinator toggles on the second row of each group. Groups nest up to maxDepth.
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
  className?: string;
}
export declare function QueryBuilder(props: QueryBuilderProps): JSX.Element;
export declare function emptyQuery(fields: QueryField[]): QueryGroup;
export declare function describeQuery(query: QueryGroup, fields: QueryField[]): string;
