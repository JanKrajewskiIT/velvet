import { createUniqueId, type JSX, mergeProps, Show } from 'solid-js';

import { cx } from '../../utils/cx';

export interface FormSectionProps {
  title?: JSX.Element;
  description?: JSX.Element;
  /** `aside` = settings-page style: title and description in a left column, fields on the right (stacks under 720px). @default 'stacked' */
  layout?: 'stacked' | 'aside';
  /** Hairline above the section. */
  divider?: boolean;
  /** Right side of the header (stacked). */
  actions?: JSX.Element;
  class?: string;
  children?: JSX.Element;
}

/** Titled group of fields. */
export const FormSection = (props: FormSectionProps) => {
  const p = mergeProps({ layout: 'stacked' } satisfies Partial<FormSectionProps>, props);
  const titleId = createUniqueId();
  return (
    <section
      class={cx('vui-formsec', `vui-formsec--${p.layout}`, p.divider && 'vui-formsec--divider', p.class)}
      aria-labelledby={p.title ? titleId : undefined}
    >
      <Show when={p.title || p.description || p.actions}>
        <header class="vui-formsec__head">
          <div class="vui-formsec__ht">
            <Show when={p.title}>
              <h3 id={titleId} class="vui-formsec__title">
                {p.title}
              </h3>
            </Show>
            <Show when={p.description}>
              <p class="vui-formsec__desc">{p.description}</p>
            </Show>
          </div>
          <Show when={p.actions}>
            <div class="vui-formsec__actions">{p.actions}</div>
          </Show>
        </header>
      </Show>
      <div class="vui-formsec__body">{p.children}</div>
    </section>
  );
};
