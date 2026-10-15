import { For } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Segmented } from '../primitives/Segmented';
import { SegmentedItem } from '../primitives/SegmentedItem';
import { MARKDOWN_EDITOR_MODES, type MarkdownEditorMode } from './markdownEditorModes';
import styles from './MarkdownEditorTabs.module.css';

export interface MarkdownEditorTabsProps {
  mode: MarkdownEditorMode;
  onModeChange: (mode: MarkdownEditorMode) => void;
}

export const MarkdownEditorTabs = (props: MarkdownEditorTabsProps) => {
  const translate = useTranslate();

  const onTabsKeyDown = (e: KeyboardEvent & { currentTarget: HTMLElement }) => {
    const index = MARKDOWN_EDITOR_MODES.findIndex((item) => item.id === props.mode);
    const targets: Partial<Record<string, number>> = {
      ArrowRight: (index + 1) % MARKDOWN_EDITOR_MODES.length,
      ArrowLeft: (index - 1 + MARKDOWN_EDITOR_MODES.length) % MARKDOWN_EDITOR_MODES.length,
      Home: 0,
      End: MARKDOWN_EDITOR_MODES.length - 1,
    };
    const target = targets[e.key];
    const next = target === undefined ? undefined : MARKDOWN_EDITOR_MODES[target];
    if (!next) return;
    e.preventDefault();
    props.onModeChange(next.id);
    e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]')[MARKDOWN_EDITOR_MODES.indexOf(next)]?.focus();
  };

  return (
    <Segmented
      size="sm"
      class={styles.root}
      role="tablist"
      aria-label={translate('velvet.display.markdownEditor.modesLabel')}
      onKeyDown={onTabsKeyDown}
    >
      <For each={MARKDOWN_EDITOR_MODES}>
        {(item) => (
          <SegmentedItem
            role="tab"
            tabIndex={props.mode === item.id ? 0 : -1}
            selected={props.mode === item.id}
            onClick={() => props.onModeChange(item.id)}
          >
            {translate(item.labelKey)}
          </SegmentedItem>
        )}
      </For>
    </Segmented>
  );
};
