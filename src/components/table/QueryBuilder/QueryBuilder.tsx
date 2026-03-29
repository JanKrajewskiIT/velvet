import { IoAdd } from 'solid-icons/io';
import type { JSX } from 'solid-js';
import { createMemo, For, Show, splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import type { SelectOption } from '~/components/dropdowns/Select/Select';
import Select from '~/components/dropdowns/Select/Select';
import FormField from '~/components/forms/FormField/FormField';
import Icon from '~/components/media/Icon/Icon';
import Card from '~/components/surfaces/Card/Card';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import type { DivCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './QueryBuilder.module.css';
import {
  appendQueryBuilderRule,
  getDefaultOperators,
  moveQueryBuilderRuleById,
  patchQueryBuilderRule,
  removeQueryBuilderRuleById,
  updateQueryBuilderCombinator,
} from './QueryBuilder.utils';
import QueryBuilderRuleRow from './QueryBuilderRuleRow';

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

interface QueryBuilderOwnProps extends Omit<DivCoreNativeProps, 'onChange'> {
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
  messages?: QueryBuilderMessages;
}

export type QueryBuilderProps = QueryBuilderOwnProps;

export interface QueryBuilderMessages {
  titleLabel?: string;
  clearRulesLabel?: string;
  addRuleLabel?: string;
  matchLabel?: string;
  combinatorAndLabel?: string;
  combinatorOrLabel?: string;
  fieldLabel?: string;
  operatorLabel?: string;
  valueLabel?: string;
  emptyLabel?: string;
  selectPlaceholderLabel?: string;
  moveRuleUpLabel?: string;
  moveRuleDownLabel?: string;
  removeRuleLabel?: string;
  operatorLabels?: Partial<Record<QueryBuilderOperator, string>>;
}

const QueryBuilder = (props: Props<QueryBuilderProps>) => {
  const { t } = useI18n();
  const [local, cardProps] = splitProps(props, [
    'fields',
    'value',
    'onChange',
    'label',
    'description',
    'combinatorLabel',
    'addRuleLabel',
    'clearLabel',
    'fieldLabel',
    'operatorLabel',
    'valueLabel',
    'emptyLabel',
    'disabled',
    'messages',
    'class',
  ]);
  const fieldByKey = createMemo(() => new Map(local.fields.map((field) => [field.key, field])));
  const hasRules = createMemo(() => local.value.rules.length > 0);
  const titleLabel = createMemo(() => local.label ?? local.messages?.titleLabel ?? t('common.queryBuilder'));
  const clearRulesLabel = createMemo(
    () => local.clearLabel ?? local.messages?.clearRulesLabel ?? t('query.clearRules')
  );
  const addRuleLabel = createMemo(() => local.addRuleLabel ?? local.messages?.addRuleLabel ?? t('query.addRule'));
  const matchLabel = createMemo(() => local.combinatorLabel ?? local.messages?.matchLabel ?? t('common.match'));
  const combinatorAndLabel = createMemo(() => local.messages?.combinatorAndLabel ?? t('query.combinator.and'));
  const combinatorOrLabel = createMemo(() => local.messages?.combinatorOrLabel ?? t('query.combinator.or'));
  const fieldLabel = createMemo(() => local.fieldLabel ?? local.messages?.fieldLabel ?? t('common.field'));
  const operatorLabel = createMemo(() => local.operatorLabel ?? local.messages?.operatorLabel ?? t('common.operator'));
  const valueLabel = createMemo(() => local.valueLabel ?? local.messages?.valueLabel ?? t('common.value'));
  const emptyLabel = createMemo(() => local.emptyLabel ?? local.messages?.emptyLabel ?? t('query.empty'));
  const selectPlaceholderLabel = createMemo(() => local.messages?.selectPlaceholderLabel ?? t('common.selectEllipsis'));
  const moveRuleUpLabel = createMemo(() => local.messages?.moveRuleUpLabel ?? t('query.moveRuleUp'));
  const moveRuleDownLabel = createMemo(() => local.messages?.moveRuleDownLabel ?? t('query.moveRuleDown'));
  const removeRuleLabel = createMemo(() => local.messages?.removeRuleLabel ?? t('query.removeRule'));
  const combinatorOptions = createMemo<SelectOption[]>(() => [
    { value: 'and', label: combinatorAndLabel() },
    { value: 'or', label: combinatorOrLabel() },
  ]);

  const getOperatorLabel = (operator: QueryBuilderOperator): string =>
    local.messages?.operatorLabels?.[operator] ?? t(`query.operator.${operator}` as const);

  const updateValue = (next: QueryBuilderValue) => {
    local.onChange(next);
  };

  const addRule = () => {
    if (local.disabled || local.fields.length === 0) return;
    const field = local.fields[0];
    if (!field) return;
    updateValue(appendQueryBuilderRule(local.value, field));
  };

  const clearRules = () => {
    updateValue({ ...local.value, rules: [] });
  };

  const updateRule = (ruleId: string, next: Partial<QueryBuilderRule>) => {
    updateValue(patchQueryBuilderRule(local.value, ruleId, next));
  };

  const moveRule = (ruleId: string, direction: -1 | 1) => {
    updateValue(moveQueryBuilderRuleById(local.value, ruleId, direction));
  };

  const removeRule = (ruleId: string) => {
    updateValue(removeQueryBuilderRuleById(local.value, ruleId));
  };

  const handleCombinatorChange: JSX.EventHandler<HTMLSelectElement, Event> = (event) => {
    updateValue(updateQueryBuilderCombinator(local.value, event.currentTarget.value === 'or' ? 'or' : 'and'));
  };

  const handleFieldChange = (rule: QueryBuilderRule, nextFieldKey: string) => {
    const field = fieldByKey().get(nextFieldKey);
    if (!field) return;
    updateRule(rule.id, {
      fieldKey: nextFieldKey,
      operator: getDefaultOperators(field)[0] ?? 'equals',
      value: '',
    });
  };

  return (
    <Card {...cardProps} class={classNames(styles.card, local.class)}>
      <div class={styles.header}>
        <div class={styles.headerCopy}>
          <Text as="h3" variant="labelLg">
            {titleLabel()}
          </Text>
          <Show when={local.description}>
            <Text as="p" variant="caption" tone="muted">
              {local.description}
            </Text>
          </Show>
        </div>
        <div class={styles.headerActions}>
          <Button variant="ghost" size="sm" disabled={local.disabled || !hasRules()} onClick={clearRules}>
            {clearRulesLabel()}
          </Button>
          <Button variant="primary" size="sm" disabled={local.disabled || local.fields.length === 0} onClick={addRule}>
            <span class={styles.addButtonContent}>
              <Icon icon={IoAdd} />
              {addRuleLabel()}
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
              aria-label={matchLabel()}
              value={local.value.combinator}
              onChange={handleCombinatorChange}
              disabled={local.disabled}
              options={combinatorOptions()}
            />
          )}
        </FormField>
      </div>

      <Show
        when={hasRules()}
        fallback={
          <Text as="p" variant="bodySm" tone="muted">
            {emptyLabel()}
          </Text>
        }
      >
        <div class={styles.rules}>
          <For each={local.value.rules}>
            {(rule, index) => {
              const selectedField = createMemo(() => fieldByKey().get(rule.fieldKey));
              const operators = createMemo(() => getDefaultOperators(selectedField()));

              return (
                <QueryBuilderRuleRow
                  rule={rule}
                  fields={local.fields}
                  field={selectedField()}
                  operators={operators()}
                  fieldLabel={fieldLabel()}
                  operatorLabel={operatorLabel()}
                  valueLabel={valueLabel()}
                  selectPlaceholderLabel={selectPlaceholderLabel()}
                  moveRuleUpLabel={moveRuleUpLabel()}
                  moveRuleDownLabel={moveRuleDownLabel()}
                  removeRuleLabel={removeRuleLabel()}
                  getOperatorLabel={getOperatorLabel}
                  disabled={local.disabled}
                  isFirst={index() === 0}
                  isLast={index() === local.value.rules.length - 1}
                  onFieldChange={(event) => handleFieldChange(rule, event.currentTarget.value)}
                  onOperatorChange={(event) =>
                    updateRule(rule.id, { operator: event.currentTarget.value as QueryBuilderOperator })
                  }
                  onValueInput={(event) => updateRule(rule.id, { value: event.currentTarget.value })}
                  onValueSelectChange={(event) => updateRule(rule.id, { value: event.currentTarget.value })}
                  onMoveUp={() => moveRule(rule.id, -1)}
                  onMoveDown={() => moveRule(rule.id, 1)}
                  onRemove={() => removeRule(rule.id)}
                />
              );
            }}
          </For>
        </div>
      </Show>
    </Card>
  );
};

export default QueryBuilder;
