import { IoArrowDown, IoArrowUp, IoTrash } from 'solid-icons/io';
import { createMemo, type JSX, Show } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import type { SelectOption } from '~/components/dropdowns/Select/Select';
import Select from '~/components/dropdowns/Select/Select';
import FormField from '~/components/forms/FormField/FormField';
import Input from '~/components/inputs/Input/Input';

import type { QueryBuilderField, QueryBuilderOperator, QueryBuilderRule } from './QueryBuilder';
import styles from './QueryBuilder.module.css';
import { requiresValue } from './QueryBuilder.utils';

interface QueryBuilderRuleRowProps {
  rule: QueryBuilderRule;
  fields: readonly QueryBuilderField[];
  field?: QueryBuilderField;
  operators: readonly QueryBuilderOperator[];
  fieldLabel: string;
  operatorLabel: string;
  valueLabel: string;
  selectPlaceholderLabel: string;
  moveRuleUpLabel: string;
  moveRuleDownLabel: string;
  removeRuleLabel: string;
  getOperatorLabel: (operator: QueryBuilderOperator) => string;
  disabled?: boolean;
  isFirst: boolean;
  isLast: boolean;
  onFieldChange: JSX.EventHandler<HTMLSelectElement, Event>;
  onOperatorChange: JSX.EventHandler<HTMLSelectElement, Event>;
  onValueInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onValueSelectChange: JSX.EventHandler<HTMLSelectElement, Event>;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

const QueryBuilderRuleRow = (props: QueryBuilderRuleRowProps) => {
  const valueRequired = createMemo(() => requiresValue(props.rule.operator));
  const selectableOptions = createMemo(() => props.field?.options ?? []);
  const hasSelectableOptions = createMemo(() => props.field?.type === 'select' && selectableOptions().length > 0);
  const inputType = createMemo(() => (props.field?.type === 'number' ? 'number' : 'text'));
  const fieldSelectOptions = createMemo<SelectOption[]>(() =>
    props.fields.map((field) => ({ value: field.key, label: field.label }))
  );
  const operatorSelectOptions = createMemo<SelectOption[]>(() =>
    props.operators.map((operator) => ({ value: operator, label: props.getOperatorLabel(operator) }))
  );
  const valueSelectOptions = createMemo<SelectOption[]>(() => [
    { value: '', label: props.selectPlaceholderLabel },
    ...selectableOptions().map((option) => ({ value: option.value, label: option.label })),
  ]);

  return (
    <div class={styles.rule}>
      <div class={styles.ruleField}>
        <FormField>
          {(fieldProps) => (
            <Select
              {...fieldProps}
              size="sm"
              aria-label={props.fieldLabel}
              value={props.rule.fieldKey}
              onChange={props.onFieldChange}
              disabled={props.disabled}
              options={fieldSelectOptions()}
            />
          )}
        </FormField>
      </div>

      <div class={styles.ruleOperator}>
        <FormField>
          {(fieldProps) => (
            <Select
              {...fieldProps}
              size="sm"
              aria-label={props.operatorLabel}
              value={props.rule.operator}
              onChange={props.onOperatorChange}
              disabled={props.disabled}
              options={operatorSelectOptions()}
            />
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
                  aria-label={props.valueLabel}
                  class={styles.inputDisabled}
                />
              }
            >
              <Show
                when={hasSelectableOptions()}
                fallback={
                  <Input
                    {...fieldProps}
                    type={inputType()}
                    value={props.rule.value}
                    size="sm"
                    aria-label={props.valueLabel}
                    onInput={props.onValueInput}
                    disabled={props.disabled}
                  />
                }
              >
                <Select
                  {...fieldProps}
                  size="sm"
                  aria-label={props.valueLabel}
                  value={props.rule.value}
                  onChange={props.onValueSelectChange}
                  disabled={props.disabled}
                  options={valueSelectOptions()}
                />
              </Show>
            </Show>
          )}
        </FormField>
      </div>

      <div class={styles.ruleActions}>
        <IconButton
          icon={IoArrowUp}
          label={props.moveRuleUpLabel}
          size="sm"
          disabled={props.disabled || props.isFirst}
          onClick={props.onMoveUp}
        />
        <IconButton
          icon={IoArrowDown}
          label={props.moveRuleDownLabel}
          size="sm"
          disabled={props.disabled || props.isLast}
          onClick={props.onMoveDown}
        />
        <IconButton
          icon={IoTrash}
          label={props.removeRuleLabel}
          size="sm"
          disabled={props.disabled}
          onClick={props.onRemove}
        />
      </div>
    </div>
  );
};

export default QueryBuilderRuleRow;
