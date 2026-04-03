import type { IconTypes } from 'solid-icons';

import Icon from '~/components/media/Icon/Icon';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import type { ComponentSize } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './FeatureCard.module.css';

interface FeatureCardProps {
  icon: IconTypes;
  label: string;
  description: string;
  iconSize?: ComponentSize;
  animationOrder?: number;
  children?: never;
}

const FeatureCard = (props: Props<FeatureCardProps>) => {
  return (
    <article
      class={classNames(styles.card, props.class)}
      style={{ '--feature-card-order': String(props.animationOrder ?? 0), ...props.style }}
    >
      <div class={styles.icon} aria-hidden="true">
        <Icon icon={props.icon} size={props.iconSize ?? 'lg'} aria-hidden={true} />
      </div>
      <Heading variant="titleLg" tone="default">
        {props.label}
      </Heading>
      <Text as="p" variant="bodySm" tone="muted">
        {props.description}
      </Text>
    </article>
  );
};

export type { FeatureCardProps };
export default FeatureCard;
