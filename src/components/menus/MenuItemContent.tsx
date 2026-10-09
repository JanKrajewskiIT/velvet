import { type JSX, Show } from 'solid-js';

import { Kbd } from '../primitives/Kbd';

export interface MenuItemContentProps {
  leading?: JSX.Element;
  label: JSX.Element;
  description?: JSX.Element;
  shortcut?: JSX.Element;
  trailing?: JSX.Element;
}

export const MenuItemContent = (props: MenuItemContentProps) => (
  <>
    {props.leading}
    <span class="vui-menu__label">
      {props.label}
      <Show when={props.description}>
        <span class="vui-menu__desc">{props.description}</span>
      </Show>
    </span>
    <Show when={props.shortcut}>
      <Kbd plain class="vui-menu__kbd">
        {props.shortcut}
      </Kbd>
    </Show>
    {props.trailing}
  </>
);
