import { For, type JSX } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Avatar } from '../data/Avatar';
import { Option } from '../primitives/Option';
import { Surface } from '../primitives/Surface';
import type { MentionOption } from './mentionModel';
import styles from './MentionSuggestions.module.css';

export interface MentionSuggestionsProps {
  ref?: (element: HTMLElement) => void;
  style?: JSX.CSSProperties;
  id: string;
  label?: string;
  trigger: string;
  position: { left: number; top: number };
  suggestions: ReadonlyArray<MentionOption>;
  activeIndex: number;
  onPick: (option: MentionOption) => void;
  onActivate: (index: number) => void;
}

/** Listbox of mention options anchored under the caret. */
export const MentionSuggestions = (props: MentionSuggestionsProps) => {
  const translate = useTranslate();
  return (
    <Surface
      ref={props.ref}
      variant="overlay"
      class={styles.mentionPartPop}
      role="listbox"
      id={props.id}
      aria-label={props.label ?? translate('velvet.forms.mentionInput.listLabel')}
      style={{ left: `${props.position.left}px`, top: `${props.position.top}px`, ...props.style }}
    >
      <For each={props.suggestions}>
        {(option, index) => (
          <Option
            id={`${props.id}-${index()}`}
            active={index() === props.activeIndex}
            label={option.label}
            description={option.description}
            icon={
              props.trigger === '@' ? <Avatar size="xs" name={option.label} src={option.src} /> : (option.icon ?? 'tag')
            }
            onMouseDown={(event) => {
              event.preventDefault();
              props.onPick(option);
            }}
            onMouseEnter={() => props.onActivate(index())}
          />
        )}
      </For>
    </Surface>
  );
};
