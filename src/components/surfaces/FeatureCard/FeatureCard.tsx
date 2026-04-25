import type { IconTypes } from 'solid-icons';
import { splitProps } from 'solid-js';

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
  const [local, rest] = splitProps(props, ['icon', 'label', 'description', 'tone', 'animationOrder', 'class', 'style']);
  return (
    <article
      {...rest}
      class={classNames(styles.card, local.class)}
      data-tone={local.tone ?? 'primary'}
      style={{ '--feature-card-order': String(local.animationOrder ?? 0), ...local.style }}
    >
      <div class={styles.icon} aria-hidden="true">
        <Icon icon={local.icon} size="md" aria-hidden={true} />
      </div>
      <div class={styles.body}>
        <Heading variant="titleMd" tone="default">
          {local.label}
        </Heading>
        <Text as="p" variant="caption" tone="muted">
          {local.description}
        </Text>
      </div>
    </article>
  );
};

export default FeatureCard;
export type { FeatureCardProps, FeatureCardTone };
