import { createEffect, createMemo, createSignal } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import type { SelectOption } from '~/components/dropdowns/Select/Select';
import Select from '~/components/dropdowns/Select/Select';
import ActionRow from '~/components/forms/ActionRow/ActionRow';
import FormField from '~/components/forms/FormField/FormField';
import FormGrid from '~/components/forms/FormGrid/FormGrid';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './QuizSetupPanel.module.css';

export interface QuizSetupPanelCategory {
  value: string;
  label: string;
}

export interface QuizSetupPanelSubmitValue {
  categoryId: string | null;
  count: number;
}

interface QuizSetupPanelProps {
  title: string;
  description: string;
  categoryLabel: string;
  countLabel: string;
  allCategoriesLabel: string;
  startLabel: string;
  categories: readonly QuizSetupPanelCategory[];
  countOptions: readonly number[];
  initialCategory?: string | null;
  initialCount?: number;
  onStart: (value: QuizSetupPanelSubmitValue) => void;
}

const QuizSetupPanel = (props: Props<QuizSetupPanelProps>) => {
  const defaultCategory = () => props.initialCategory ?? 'all';
  const defaultCount = () => props.initialCount ?? props.countOptions[0] ?? 10;

  const [selectedCategory, setSelectedCategory] = createSignal(defaultCategory());
  const [count, setCount] = createSignal(defaultCount());
  const categoryOptions = createMemo<SelectOption[]>(() => [
    { value: 'all', label: props.allCategoriesLabel },
    ...props.categories.map((category) => ({ value: category.value, label: category.label })),
  ]);
  const countSelectOptions = createMemo<SelectOption[]>(() =>
    props.countOptions.map((option) => ({ value: String(option), label: String(option) }))
  );

  createEffect(() => {
    setSelectedCategory(defaultCategory());
  });

  createEffect(() => {
    setCount(defaultCount());
  });

  const handleStart = () => {
    props.onStart({
      categoryId: selectedCategory() === 'all' ? null : selectedCategory(),
      count: count(),
    });
  };

  return (
    <section class={classNames(styles.panel, props.class)}>
      <div class={styles.header}>
        <Heading as="h3" level={3} variant="h3">
          {props.title}
        </Heading>
        <Text as="p" variant="bodySm" tone="muted">
          {props.description}
        </Text>
      </div>

      <FormGrid class={styles.fields}>
        <FormField label={props.categoryLabel}>
          <Select
            value={selectedCategory()}
            onChange={(event) => setSelectedCategory(event.currentTarget.value)}
            options={categoryOptions()}
          />
        </FormField>

        <FormField label={props.countLabel}>
          <Select
            value={String(count())}
            onChange={(event) => setCount(Number(event.currentTarget.value))}
            options={countSelectOptions()}
          />
        </FormField>
      </FormGrid>

      <ActionRow>
        <Button label={props.startLabel} onClick={handleStart} />
      </ActionRow>
    </section>
  );
};

export type { QuizSetupPanelProps };
export default QuizSetupPanel;
