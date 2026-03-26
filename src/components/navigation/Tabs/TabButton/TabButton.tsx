import { type JSX, Show, splitProps } from 'solid-js';

import Button from '~/components/buttons/Button/Button';
import Text from '~/components/typography/Text/Text';
import type Props from '~/models/Props';
import type { ButtonCoreNativeProps } from '~/models/Props';
import classNames from '~/utils/classNames';

import styles from './TabButton.module.css';

interface TabButtonOwnProps extends Omit<ButtonCoreNativeProps, 'children'> {
  label: string | JSX.Element;
  selected?: boolean;
  variant?: 'underline' | 'pill';
  children?: never;
}

const TabButton = (props: Props<TabButtonOwnProps>) => {
  const [local, rest] = splitProps(props, ['label', 'selected', 'variant', 'class']);
  const visualVariant = () => local.variant ?? 'underline';

  return (
    <Button
      {...rest}
      variant={visualVariant() === 'pill' && local.selected ? 'primary' : 'ghost'}
      size="sm"
      class={classNames(
        visualVariant() === 'underline' && styles.button,
        visualVariant() === 'underline' && local.selected && styles.selected,
        local.class
      )}
    >
      <Show when={typeof local.label === 'string'} fallback={local.label}>
        <Text
          as="span"
          variant="labelLg"
          tone={visualVariant() === 'pill' ? 'inherit' : local.selected ? 'primary' : 'muted'}
        >
          {local.label as string}
        </Text>
      </Show>
    </Button>
  );
};

export type { TabButtonOwnProps };
export default TabButton;
