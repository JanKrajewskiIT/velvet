import { IoAdd, IoArrowDown, IoArrowUp, IoTrash } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { createMemo, For, Show } from 'solid-js';

import Card from '~/components/surfaces/Card/Card';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import Button from '../../buttons/Button/Button';
import IconButton from '../../buttons/IconButton/IconButton';
import Select from '../../dropdowns/Select/Select';
import FormField from '../../forms/FormField/FormField';
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
  label?: string;
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
  const { t } = useI18n();
  const fieldByKey = createMemo(() => new Map(props.fields.map((field) => [field.key, field])));
  const hasRules = createMemo(() => props.value.rules.length > 0);

  const getOperatorLabel = (operator: QueryBuilderOperator): string => {
    if (operator === 'equals') return t('query.operator.equals');
    if (operator === 'notEquals') return t('query.operator.notEquals');
    if (operator === 'contains') return t('query.operator.contains');
    if (operator === 'startsWith') return t('query.operator.startsWith');
    if (operator === 'endsWith') return t('query.operator.endsWith');
    if (operator === 'gt') return t('query.operator.gt');
    if (operator === 'gte') return t('query.operator.gte');
    if (operator === 'lt') return t('query.operator.lt');
    if (operator === 'lte') return t('query.operator.lte');
    if (operator === 'isEmpty') return t('query.operator.isEmpty');
    return t('query.operator.isNotEmpty');
  };

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

  const handleCombinatorChange: JSX.EventHandler<HTMLSelectElement, Event> = (event) => {
    updateCombinator(event.currentTarget.value === 'or' ? 'or' : 'and');
  };

  const handleRuleFieldChange = (rule: QueryBuilderRule): JSX.EventHandler<HTMLSelectElement, Event> => {
    return (event) => {
      handleFieldChange(rule, event.currentTarget.value);
    };
  };

  const handleRuleOperatorChange = (rule: QueryBuilderRule): JSX.EventHandler<HTMLSelectElement, Event> => {
    return (event) => {
      updateRule(rule.id, { operator: event.currentTarget.value as QueryBuilderOperator });
    };
  };

  const handleRuleValueInput = (rule: QueryBuilderRule): JSX.EventHandler<HTMLInputElement, InputEvent> => {
    return (event) => {
      updateRule(rule.id, { value: event.currentTarget.value });
    };
  };

  const handleRuleValueSelectChange = (rule: QueryBuilderRule): JSX.EventHandler<HTMLSelectElement, Event> => {
    return (event) => {
      updateRule(rule.id, { value: event.currentTarget.value });
    };
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
            {props.label ?? t('common.queryBuilder')}
          </Text>
          <Show when={props.description}>
            <Text as="p" variant="caption" tone="muted">
              {props.description}
            </Text>
          </Show>
        </div>
        <div class={styles.headerActions}>
          <Button variant="ghost" size="sm" disabled={props.disabled || !hasRules()} onClick={clearRules}>
            {props.clearLabel ?? t('query.clearRules')}
          </Button>
          <Button variant="primary" size="sm" disabled={props.disabled || props.fields.length === 0} onClick={addRule}>
            <span class={styles.addButtonContent}>
              <IoAdd />
              {props.addRuleLabel ?? t('query.addRule')}
            </span>
          </Button>
        </div>
      </div>

      <div class={styles.combinatorRow}>
        <FormField class={styles.combinatorField}>
          {(fieldProps) => (
            <Select
              {...fieldProps}
              size="sm"
              aria-label={props.combinatorLabel ?? t('common.match')}
              value={props.value.combinator}
              onChange={handleCombinatorChange}
              disabled={props.disabled}
            >
              <option value="and">{t('query.combinator.and')}</option>
              <option value="or">{t('query.combinator.or')}</option>
            </Select>
          )}
        </FormField>
      </div>

      <Show
        when={hasRules()}
        fallback={
          <Text as="p" variant="bodySm" tone="muted">
            {props.emptyLabel ?? t('query.empty')}
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
                    <FormField>
                      {(fieldProps) => (
                        <Select
                          {...fieldProps}
                          size="sm"
                          aria-label={props.fieldLabel ?? t('common.field')}
                          value={rule.fieldKey}
                          onChange={handleRuleFieldChange(rule)}
                          disabled={props.disabled}
                        >
                          <For each={props.fields}>{(entry) => <option value={entry.key}>{entry.label}</option>}</For>
                        </Select>
                      )}
                    </FormField>
                  </div>

                  <div class={styles.ruleOperator}>
                    <FormField>
                      {(fieldProps) => (
                        <Select
                          {...fieldProps}
                          size="sm"
                          aria-label={props.operatorLabel ?? t('common.operator')}
                          value={rule.operator}
                          onChange={handleRuleOperatorChange(rule)}
                          disabled={props.disabled}
                        >
                          <For each={operators()}>
                            {(operator) => <option value={operator}>{getOperatorLabel(operator)}</option>}
                          </For>
                        </Select>
                      )}
                    </FormField>
                  </div>

                  <div class={styles.ruleValue}>
                    <FormField>
                      {(fieldProps) => (
                        <Show
                          when={valueRequired()}
                          fallback={
                            <Input
                              {...fieldProps}
                              value=""
                              size="sm"
                              readOnly
                              disabled
                              aria-label={props.valueLabel ?? t('common.value')}
                              class={styles.inputDisabled}
                            />
                          }
                        >
                          <Show
                            when={field()?.type === 'select' && (field()?.options?.length ?? 0) > 0}
                            fallback={
                              <Input
                                {...fieldProps}
                                type={field()?.type === 'number' ? 'number' : 'text'}
                                value={rule.value}
                                size="sm"
                                aria-label={props.valueLabel ?? t('common.value')}
                                onInput={handleRuleValueInput(rule)}
                                disabled={props.disabled}
                              />
                            }
                          >
                            <Select
                              {...fieldProps}
                              size="sm"
                              aria-label={props.valueLabel ?? t('common.value')}
                              value={rule.value}
                              onChange={handleRuleValueSelectChange(rule)}
                              disabled={props.disabled}
                            >
                              <option value="">{t('common.selectEllipsis')}</option>
                              <For each={field()?.options ?? []}>
                                {(option) => <option value={option.value}>{option.label}</option>}
                              </For>
                            </Select>
                          </Show>
                        </Show>
                      )}
                    </FormField>
                  </div>

                  <div class={styles.ruleActions}>
                    <IconButton
                      icon={<IoArrowUp />}
                      label={t('query.moveRuleUp')}
                      size="sm"
                      disabled={props.disabled || index() === 0}
                      onClick={() => moveRule(rule.id, -1)}
                    />
                    <IconButton
                      icon={<IoArrowDown />}
                      label={t('query.moveRuleDown')}
                      size="sm"
                      disabled={props.disabled || index() === props.value.rules.length - 1}
                      onClick={() => moveRule(rule.id, 1)}
                    />
                    <IconButton
                      icon={<IoTrash />}
                      label={t('query.removeRule')}
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
