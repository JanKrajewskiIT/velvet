import { For, Show } from 'solid-js';

import styles from './FooterLegal.module.css';
import { FooterLinkItem } from './FooterLinkItem';
import type { FooterLink } from './footerTypes';

export interface FooterLegalProps {
  links: FooterLink[];
  label: string;
}

export const FooterLegal = (props: FooterLegalProps) => (
  <Show when={props.links.length > 0}>
    <nav class={styles.footerPartLegal} aria-label={props.label}>
      <For each={props.links}>{(link) => <FooterLinkItem link={link} small />}</For>
    </nav>
  </Show>
);
