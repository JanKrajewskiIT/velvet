import { For, Show } from 'solid-js';

import { useTranslate } from '../../i18n/useTranslate';
import { cx } from '../../utils/cx';
import { EmptyText } from '../primitives/EmptyText';
import { typographyClass } from '../primitives/typography';
import { CascaderPath } from './CascaderPath';
import { type CascaderNode, lastOf } from './cascaderPaths';
import styles from './CascaderSearchResults.module.css';

export interface CascaderSearchResultsProps {
  hits: readonly CascaderNode[][];
  /** Virtual active hit. */
  activeIndex: number;
  /** Id of the committed node. */
  selectedId: string | null;
  separator: string;
  /** Normalized query used to highlight matches. */
  query: string;
  onHover: (index: number) => void;
  onPick: (path: CascaderNode[]) => void;
}

/** Flat result list shown in the Cascader menu while a search query is entered. */
export const CascaderSearchResults = (props: CascaderSearchResultsProps) => {
  const translate = useTranslate();
  return (
    <div class={styles.cascPartResults} role="listbox">
      <Show when={props.hits.length === 0}>
        <EmptyText class={styles.tselectPartEmpty}>{translate('velvet.forms.cascader.noMatches')}</EmptyText>
      </Show>
      <For each={props.hits}>
        {(path, index) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/interactive-supports-focus -- keyboard handled by the dialog's onKeyDown with a virtual active option
          <div
            role="option"
            aria-selected={lastOf(path)?.id === props.selectedId}
            class={cx(
              typographyClass('body'),
              styles.option,
              index() === props.activeIndex && styles.optionVariantActive,
            )}
            onMouseEnter={() => props.onHover(index())}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => props.onPick(path)}
          >
            <span class={cx(styles.optionPartLabel, styles.cascPartHit)}>
              <CascaderPath path={path} separator={props.separator} query={props.query} />
            </span>
          </div>
        )}
      </For>
    </div>
  );
};
