import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { Listbox } from '../primitives/Listbox';
import { ListboxEmpty } from '../primitives/ListboxEmpty';
import { ListboxOption } from '../primitives/ListboxOption';
import { CascaderPath } from './CascaderPath';
import { type CascaderNode, lastOf } from './cascaderPaths';
import styles from './CascaderSearchResults.module.css';

export interface CascaderSearchResultsProps {
  hits: readonly CascaderNode[][];
  activeIndex: number;
  selectedId: string | null;
  separator: string;
  query: string;
  onHover: (index: number) => void;
  onPick: (path: CascaderNode[]) => void;
}

export const CascaderSearchResults = (props: CascaderSearchResultsProps) => {
  const translate = useTranslate();
  return (
    <Listbox
      floating={false}
      class={styles.cascPartResults}
      aria-label={translate('velvet.forms.cascader.searchLabel')}
    >
      <Show when={props.hits.length === 0}>
        <ListboxEmpty>{translate('velvet.forms.cascader.noMatches')}</ListboxEmpty>
      </Show>
      <For each={props.hits}>
        {(path, index) => (
          <ListboxOption
            selected={lastOf(path)?.id === props.selectedId}
            active={index() === props.activeIndex}
            label={
              <span class={styles.cascPartHit}>
                <CascaderPath path={path} separator={props.separator} query={props.query} />
              </span>
            }
            onMouseEnter={() => props.onHover(index())}
            onClick={() => props.onPick(path)}
          />
        )}
      </For>
    </Listbox>
  );
};
