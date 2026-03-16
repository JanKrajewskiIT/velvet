import { IoAdd, IoArrowDown, IoArrowUp, IoTrash } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { createMemo, createUniqueId, For, Show } from 'solid-js';

import Card from '~/components/data-display/Card/Card';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import IconButton from '../../buttons/IconButton/IconButton';
import Select from '../../dropdowns/Select/Select';
import Input from '../../inputs/Input/Input';
import styles from './QueryBuilder.module.css';

export type QueryBuilderCombinator = 'and' | 'or';

export type QueryBuilderOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'isEmpty'
  | 'isNotEmpty';

export interface QueryBuilderFieldOption {
  value: string;
  label: string;
}

export interface QueryBuilderField {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'select';
  operators?: readonly QueryBuilderOperator[];
  options?: readonly QueryBuilderFieldOption[];
}

export interface QueryBuilderRule {
  id: string;
  fieldKey: string;
  operator: QueryBuilderOperator;
  value: string;
}

export interface QueryBuilderValue {
  combinator: QueryBuilderCombinator;
  rules: QueryBuilderRule[];
}

interface QueryBuilderOwnProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  fields: readonly QueryBuilderField[];
  value: QueryBuilderValue;
  onChange: (next: QueryBuilderValue) => void;
  title?: string;
  description?: string;
  combinatorLabel?: string;
  addRuleLabel?: string;
  clearLabel?: string;
  fieldLabel?: string;
  operatorLabel?: string;
  valueLabel?: string;
  emptyLabel?: string;
  disabled?: boolean;
}

const FALLBACK_OPERATORS: QueryBuilderOperator[] = ['contains', 'equals', 'notEquals', 'isEmpty', 'isNotEmpty'];
const NUMBER_OPERATORS: QueryBuilderOperator[] = [
  'equals',
  'notEquals',
  'gt',
  'gte',
  'lt',
  'lte',
  'isEmpty',
  'isNotEmpty',
];
const SELECT_OPERATORS: QueryBuilderOperator[] = ['equals', 'notEquals', 'isEmpty', 'isNotEmpty'];

const OPERATOR_LABELS: Record<QueryBuilderOperator, string> = {
  equals: 'Equals',
  notEquals: 'Not equals',
  contains: 'Contains',
  startsWith: 'Starts with',
  endsWith: 'Ends with',
  gt: 'Greater than',
  gte: 'Greater or equal',
  lt: 'Less than',
  lte: 'Less or equal',
  isEmpty: 'Is empty',
  isNotEmpty: 'Is not empty',
};

const getDefaultOperators = (field?: QueryBuilderField): QueryBuilderOperator[] => {
  if (!field) return FALLBACK_OPERATORS;
  if (field.operators && field.operators.length > 0) return [...field.operators];
  if (field.type === 'number') return NUMBER_OPERATORS;
  if (field.type === 'select') return SELECT_OPERATORS;
  return FALLBACK_OPERATORS;
};

const createRuleId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `rule-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

const requiresValue = (operator: QueryBuilderOperator) => operator !== 'isEmpty' && operator !== 'isNotEmpty';

const QueryBuilder = (props: Props<QueryBuilderOwnProps>) => {
  const idPrefix = createUniqueId();

  const fieldByKey = createMemo(() => new Map(props.fields.map((field) => [field.key, field])));
  const hasRules = createMemo(() => props.value.rules.length > 0);

  const updateValue = (next: QueryBuilderValue) => {
    props.onChange(next);
  };

  const addRule = () => {
    if (props.disabled || props.fields.length === 0) return;
    const field = props.fields[0];
    if (!field) return;
    const operators = getDefaultOperators(field);
    const firstOperator = operators[0] ?? 'equals';
    updateValue({
      ...props.value,
      rules: [
        ...props.value.rules,
        {
          id: createRuleId(),
          fieldKey: field.key,
          operator: firstOperator,
          value: '',
        },
      ],
    });
  };

  const clearRules = () => {
    updateValue({
      ...props.value,
      rules: [],
    });
  };

  const updateCombinator = (next: QueryBuilderCombinator) => {
    updateValue({
      ...props.value,
      combinator: next,
    });
  };

  const updateRule = (ruleId: string, next: Partial<QueryBuilderRule>) => {
    updateValue({
      ...props.value,
      rules: props.value.rules.map((rule) => (rule.id === ruleId ? { ...rule, ...next } : rule)),
    });
  };

  const removeRule = (ruleId: string) => {
    updateValue({
      ...props.value,
      rules: props.value.rules.filter((rule) => rule.id !== ruleId),
    });
  };

  const moveRule = (ruleId: string, direction: -1 | 1) => {
    const index = props.value.rules.findIndex((rule) => rule.id === ruleId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= props.value.rules.length) return;
    const nextRules = [...props.value.rules];
    const [moved] = nextRules.splice(index, 1);
    if (!moved) return;
    nextRules.splice(nextIndex, 0, moved);
    updateValue({
      ...props.value,
      rules: nextRules,
    });
  };

  const handleFieldChange = (rule: QueryBuilderRule, nextFieldKey: string) => {
    const field = fieldByKey().get(nextFieldKey);
    if (!field) return;
    const operators = getDefaultOperators(field);
    const nextOperator = operators[0] ?? 'equals';
    updateRule(rule.id, {
      fieldKey: nextFieldKey,
      operator: nextOperator,
      value: '',
    });
  };

  return (
    <Card class={classNames(styles.card, props.class)}>
      <div class={styles.header}>
        <div class={styles.headerCopy}>
          <Text as="h3" variant="labelLg">
            {props.title ?? 'Query builder'}
          </Text>
          <Show when={props.description}>
            <Text as="p" variant="caption" tone="muted">
              {props.description}
            </Text>
          </Show>
        </div>
        <div class={styles.headerActions}>
          <Button variant="ghost" size="sm" disabled={props.disabled || !hasRules()} onClick={clearRules}>
            {props.clearLabel ?? 'Clear rules'}
          </Button>
          <Button variant="primary" size="sm" disabled={props.disabled || props.fields.length === 0} onClick={addRule}>
            <span class={styles.addButtonContent}>
              <IoAdd />
              {props.addRuleLabel ?? 'Add rule'}
            </span>
          </Button>
        </div>
      </div>

      <div class={styles.combinatorRow}>
        <label class={styles.metaLabel} for={`${idPrefix}-combinator`}>
          {props.combinatorLabel ?? 'Match'}
        </label>
        <Select
          id={`${idPrefix}-combinator`}
          size="sm"
          value={props.value.combinator}
          onChange={(e) => updateCombinator(e.currentTarget.value === 'or' ? 'or' : 'and')}
          disabled={props.disabled}
        >
          <option value="and">All rules (AND)</option>
          <option value="or">Any rule (OR)</option>
        </Select>
      </div>

      <Show
        when={hasRules()}
        fallback={
          <Text as="p" variant="bodySm" tone="muted">
            {props.emptyLabel ?? 'No rules defined'}
          </Text>
        }
      >
        <div class={styles.rules}>
          <For each={props.value.rules}>
            {(rule, index) => {
              const field = createMemo(() => fieldByKey().get(rule.fieldKey));
              const operators = createMemo(() => getDefaultOperators(field()));
              const valueRequired = createMemo(() => requiresValue(rule.operator));

              return (
                <div class={styles.rule}>
                  <div class={styles.ruleField}>
                    <label class={styles.metaLabel} for={`${idPrefix}-field-${rule.id}`}>
                      {props.fieldLabel ?? 'Field'}
                    </label>
                    <Select
                      id={`${idPrefix}-field-${rule.id}`}
                      size="sm"
                      value={rule.fieldKey}
                      onChange={(e) => handleFieldChange(rule, e.currentTarget.value)}
                      disabled={props.disabled}
                    >
                      <For each={props.fields}>{(entry) => <option value={entry.key}>{entry.label}</option>}</For>
                    </Select>
                  </div>

                  <div class={styles.ruleOperator}>
                    <label class={styles.metaLabel} for={`${idPrefix}-operator-${rule.id}`}>
                      {props.operatorLabel ?? 'Operator'}
                    </label>
                    <Select
                      id={`${idPrefix}-operator-${rule.id}`}
                      size="sm"
                      value={rule.operator}
                      onChange={(e) => updateRule(rule.id, { operator: e.currentTarget.value as QueryBuilderOperator })}
                      disabled={props.disabled}
                    >
                      <For each={operators()}>
                        {(operator) => <option value={operator}>{OPERATOR_LABELS[operator]}</option>}
                      </For>
                    </Select>
                  </div>

                  <div class={styles.ruleValue}>
                    <label class={styles.metaLabel} for={`${idPrefix}-value-${rule.id}`}>
                      {props.valueLabel ?? 'Value'}
                    </label>
                    <Show
                      when={valueRequired()}
                      fallback={
                        <Input
                          id={`${idPrefix}-value-${rule.id}`}
                          value=""
                          size="sm"
                          readOnly
                          disabled
                          class={styles.inputDisabled}
                        />
                      }
                    >
                      <Show
                        when={field()?.type === 'select' && (field()?.options?.length ?? 0) > 0}
                        fallback={
                          <Input
                            id={`${idPrefix}-value-${rule.id}`}
                            type={field()?.type === 'number' ? 'number' : 'text'}
                            value={rule.value}
                            size="sm"
                            onInput={(e) => updateRule(rule.id, { value: e.currentTarget.value })}
                            disabled={props.disabled}
                          />
                        }
                      >
                        <Select
                          id={`${idPrefix}-value-${rule.id}`}
                          size="sm"
                          value={rule.value}
                          onChange={(e) => updateRule(rule.id, { value: e.currentTarget.value })}
                          disabled={props.disabled}
                        >
                          <option value="">Select...</option>
                          <For each={field()?.options ?? []}>
                            {(option) => <option value={option.value}>{option.label}</option>}
                          </For>
                        </Select>
                      </Show>
                    </Show>
                  </div>

                  <div class={styles.ruleActions}>
                    <IconButton
                      icon={<IoArrowUp />}
                      title="Move rule up"
                      size="sm"
                      disabled={props.disabled || index() === 0}
                      onClick={() => moveRule(rule.id, -1)}
                    />
                    <IconButton
                      icon={<IoArrowDown />}
                      title="Move rule down"
                      size="sm"
                      disabled={props.disabled || index() === props.value.rules.length - 1}
                      onClick={() => moveRule(rule.id, 1)}
                    />
                    <IconButton
                      icon={<IoTrash />}
                      title="Remove rule"
                      size="sm"
                      disabled={props.disabled}
                      onClick={() => removeRule(rule.id)}
                    />
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </Show>
    </Card>
  );
};

export default QueryBuilder;
