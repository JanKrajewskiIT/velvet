import { For, Show } from 'solid-js';

import { FooterLinkItem } from './FooterLinkItem';
import type { FooterLink } from './footerTypes';

export interface FooterLegalProps {
  links: FooterLink[];
  label: string;
}

export const FooterLegal = (props: FooterLegalProps) => (
  <Show when={props.links.length > 0}>
    <nav class="vui-footer__legal" aria-label={props.label}>
      <For each={props.links}>{(link) => <FooterLinkItem link={link} small />}</For>
    </nav>
  </Show>
);
