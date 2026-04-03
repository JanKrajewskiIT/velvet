import { FiChevronLeft, FiChevronRight } from 'solid-icons/fi';
import type { JSX } from 'solid-js';

import IconButton from '~/components/buttons/IconButton/IconButton';
import Text from '~/components/typography/Text/Text';
import { useI18n } from '~/i18n/I18nProvider';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './CalendarHeader.module.css';

export interface CalendarHeaderProps {
  monthLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  titleContent?: JSX.Element;
}

const CalendarHeader = (props: Props<CalendarHeaderProps>) => {
  const { ts } = useI18n();

  return (
    <div class={classNames(styles.header, props.class)}>
      <IconButton
        icon={FiChevronLeft}
        label={ts('calendar.prevMonth')}
        onClick={props.onPrevious}
        size="sm"
        variant="subtle"
      />
      {props.titleContent ?? (
        <Text as="span" variant="labelMd">
          {props.monthLabel}
        </Text>
      )}
      <IconButton
        icon={FiChevronRight}
        label={ts('calendar.nextMonth')}
        onClick={props.onNext}
        size="sm"
        variant="subtle"
      />
    </div>
  );
};

export default CalendarHeader;
