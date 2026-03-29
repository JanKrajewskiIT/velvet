import Button from '~/components/buttons/Button/Button';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ComparisonSelectionBar.module.css';

interface ComparisonSelectionBarProps {
  selectedCount: number;
  selectedLabel: string;
  promptLabel: string;
  compareLabel: string;
  clearLabel: string;
  compareDisabled?: boolean;
  onCompare: () => void;
  onClear?: () => void;
}

const ComparisonSelectionBar = (props: Props<ComparisonSelectionBarProps>) => {
  const showClear = () => Boolean(props.onClear && props.selectedCount > 0);

  return (
    <div class={classNames(styles.bar, props.class)}>
      <Text as="span" variant="bodySm" tone="muted" class={styles.info}>
        {props.selectedCount} {props.selectedLabel} - {props.promptLabel}
      </Text>
      <div class={styles.actions}>
        {showClear() && <Button variant="ghost" label={props.clearLabel} onClick={() => props.onClear?.()} />}
        <Button label={props.compareLabel} onClick={props.onCompare} disabled={props.compareDisabled} />
      </div>
    </div>
  );
};

export type { ComparisonSelectionBarProps };
export default ComparisonSelectionBar;
