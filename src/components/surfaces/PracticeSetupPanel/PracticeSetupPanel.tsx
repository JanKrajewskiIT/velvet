import { createEffect, createMemo, createSignal, on } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import type { SelectOption } from '~/components/dropdowns/Select/Select';
import Select from '~/components/dropdowns/Select/Select';
import ActionRow from '~/components/forms/ActionRow/ActionRow';
import FormField from '~/components/forms/FormField/FormField';
import FormGrid from '~/components/forms/FormGrid/FormGrid';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './PracticeSetupPanel.module.css';

export interface PracticeSetupPanelCategory {
  value: string;
  label: string;
}

export interface PracticeSetupPanelSubmitValue {
  categoryId: string | null;
  count: number;
}

interface PracticeSetupPanelProps {
  title: string;
  description: string;
  categories: readonly PracticeSetupPanelCategory[];
  countOptions: readonly number[];
  initialCategory?: string | null;
  initialCount?: number;
  onStart: (value: PracticeSetupPanelSubmitValue) => void;
}

const PracticeSetupPanel = (props: Props<PracticeSetupPanelProps>) => {
  const { ts } = useI18n();
  const defaultCategory = () => props.initialCategory ?? 'all';
  const defaultCount = () => props.initialCount ?? props.countOptions[0] ?? 10;

  const [selectedCategory, setSelectedCategory] = createSignal(defaultCategory());
  const [count, setCount] = createSignal(defaultCount());
  const categoryOptions = createMemo<SelectOption[]>(() => [
    { value: 'all', label: ts('practiceSetup.allCategories') },
    ...props.categories.map((category) => ({ value: category.value, label: category.label })),
  ]);
  const countSelectOptions = createMemo<SelectOption[]>(() =>
    props.countOptions.map((option) => ({ value: String(option), label: String(option) })),
  );

  createEffect(on(defaultCategory, (value) => setSelectedCategory(value), { defer: true }));
  createEffect(on(defaultCount, (value) => setCount(value), { defer: true }));

  const handleStart = () => {
    props.onStart({
      categoryId: selectedCategory() === 'all' ? null : selectedCategory(),
      count: count(),
    });
  };

  const handleCategoryChange = (event: Event & { currentTarget: HTMLSelectElement }) => {
    setSelectedCategory(event.currentTarget.value);
  };

  const handleCountChange = (event: Event & { currentTarget: HTMLSelectElement }) => {
    setCount(Number(event.currentTarget.value));
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
        <FormField label={ts('practiceSetup.category')}>
          <Select value={selectedCategory()} onChange={handleCategoryChange} options={categoryOptions()} />
        </FormField>

        <FormField label={ts('practiceSetup.count')}>
          <Select value={String(count())} onChange={handleCountChange} options={countSelectOptions()} />
        </FormField>
      </FormGrid>

      <ActionRow>
        <Button label={ts('common.start')} onClick={handleStart} />
      </ActionRow>
    </section>
  );
};

export type { PracticeSetupPanelProps };
export default PracticeSetupPanel;
