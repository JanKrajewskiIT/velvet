import { FiChevronLeft, FiChevronRight } from 'solid-icons/fi';
import type { JSX } from 'solid-js';

import type { ButtonVariant } from '~/components/buttons/Button/Button';
import IconButton from '~/components/buttons/IconButton/IconButton';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './CalendarHeader.module.css';

export interface CalendarHeaderProps {
  monthLabel: string;
  previousLabel: string;
  nextLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  navigationVariant?: ButtonVariant;
  titleContent?: JSX.Element;
}

const CalendarHeader = (props: Props<CalendarHeaderProps>) => {
  return (
    <div class={classNames(styles.header, props.class)}>
      <IconButton
        icon={FiChevronLeft}
        label={props.previousLabel}
        onClick={props.onPrevious}
        size="sm"
        variant={props.navigationVariant ?? 'subtle'}
      />
      {props.titleContent ?? (
        <Text as="span" variant="labelMd">
          {props.monthLabel}
        </Text>
      )}
      <IconButton
        icon={FiChevronRight}
        label={props.nextLabel}
        onClick={props.onNext}
        size="sm"
        variant={props.navigationVariant ?? 'subtle'}
      />
    </div>
  );
};

export default CalendarHeader;
