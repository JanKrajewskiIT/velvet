import type { IconTypes } from 'solid-icons';

import Icon from '~/components/media/Icon/Icon';
import Heading from '~/components/typography/Heading/Heading';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './FeatureCard.module.css';

type FeatureCardTone = 'primary' | 'info' | 'warning' | 'success';

interface FeatureCardProps {
  icon: IconTypes;
  label: string;
  description: string;
  tone?: FeatureCardTone;
  animationOrder?: number;
  children?: never;
}

const FeatureCard = (props: Props<FeatureCardProps>) => {
  return (
    <article
      class={classNames(styles.card, props.class)}
      data-tone={props.tone ?? 'primary'}
      style={{ '--feature-card-order': String(props.animationOrder ?? 0), ...props.style }}
    >
      <div class={styles.icon} aria-hidden="true">
        <Icon icon={props.icon} size="md" aria-hidden={true} />
      </div>
      <div class={styles.body}>
        <Heading variant="titleMd" tone="default">
          {props.label}
        </Heading>
        <Text as="p" variant="caption" tone="muted">
          {props.description}
        </Text>
      </div>
    </article>
  );
};

export default FeatureCard;
export type { FeatureCardProps, FeatureCardTone };
