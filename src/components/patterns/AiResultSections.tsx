import { For, Show } from 'solid-js';

import { cx } from '../../utils/cx';
import { SectionLabel } from '../primitives/SectionLabel';
import type { AiSection } from './aiResultTypes';

export interface AiResultSectionsProps {
  sections: AiSection[];
}

/** Titled finding lists, each with an item count. */
export const AiResultSections = (props: AiResultSectionsProps) => (
  <Show when={props.sections.length > 0}>
    <div class="vui-ai__secs">
      <For each={props.sections}>
        {(section) => (
          <section class={cx('vui-ai__sec', section.tone && `vui-ai__sec--${section.tone}`)}>
            <SectionLabel
              as="h4"
              class="vui-ai__sec-h"
              tone="secondary"
              icon={section.icon}
              end={<span>{section.items.length}</span>}
            >
              {section.title}
            </SectionLabel>
            <ul class="vui-ai__items">
              <For each={section.items}>{(item) => <li>{item}</li>}</For>
            </ul>
          </section>
        )}
      </For>
    </div>
  </Show>
);
