import { type JSX, Show } from 'solid-js';

import { Glyph } from '../primitives/Glyph';
import { Text } from '../primitives/Text';
import styles from './BreadcrumbContent.module.css';

export interface BreadcrumbContentProps {
  icon?: string;
  children?: JSX.Element;
}

export const BreadcrumbContent = (props: BreadcrumbContentProps) => (
  <Text as="span" variant="label" tone="inherit" class={styles.root}>
    <Show when={props.icon}>{(icon) => <Glyph name={icon()} />}</Show>
    {props.children}
  </Text>
);
