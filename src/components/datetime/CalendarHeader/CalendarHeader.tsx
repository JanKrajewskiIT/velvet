import { FiChevronLeft, FiChevronRight } from 'solid-icons/fi';

import IconButton from '~/components/buttons/IconButton/IconButton';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './CalendarHeader.module.css';

interface CalendarHeaderProps {
  monthLabel: string;
  previousLabel: string;
  nextLabel: string;
  onPrevious: () => void;
  onNext: () => void;
}

const CalendarHeader = (props: Props<CalendarHeaderProps>) => {
  return (
    <div class={classNames(styles.header, props.class)}>
      <IconButton
        icon={<FiChevronLeft />}
        title={props.previousLabel}
        onClick={props.onPrevious}
        size="sm"
        variant="subtle"
      />
      <Text as="span" variant="labelMd">
        {props.monthLabel}
      </Text>
      <IconButton icon={<FiChevronRight />} title={props.nextLabel} onClick={props.onNext} size="sm" variant="subtle" />
    </div>
  );
};

export default CalendarHeader;
