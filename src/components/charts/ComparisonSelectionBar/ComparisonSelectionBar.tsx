import Button from '~/components/buttons/Button/Button';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './ComparisonSelectionBar.module.css';

interface ComparisonSelectionBarProps {
  selectedCount: number;
  compareDisabled?: boolean;
  onCompare: () => void;
  onClear?: () => void;
}

const ComparisonSelectionBar = (props: Props<ComparisonSelectionBarProps>) => {
  const { ts } = useI18n();
  const showClear = () => Boolean(props.onClear && props.selectedCount > 0);

  return (
    <div class={classNames(styles.bar, props.class)}>
      <Text as="span" variant="bodySm" tone="muted" class={styles.info}>
        {props.selectedCount} {ts('common.selected')} - {ts('comparison.selectToCompare')}
      </Text>
      <div class={styles.actions}>
        {showClear() && <Button variant="ghost" label={ts('common.clear')} onClick={() => props.onClear?.()} />}
        <Button label={ts('comparison.compare')} onClick={props.onCompare} disabled={props.compareDisabled} />
      </div>
    </div>
  );
};

export type { ComparisonSelectionBarProps };
export default ComparisonSelectionBar;
