import { type Accessor, children, createEffect, type JSX, onCleanup, Show } from 'solid-js';

interface TriggerEvents {
  onClick: JSX.EventHandler<HTMLElement, MouseEvent>;
  onKeyDown?: JSX.EventHandler<HTMLElement, KeyboardEvent>;
}

type TriggerRenderer<P> = (props: P) => JSX.Element;

const INTERACTIVE_TRIGGER =
  'button,a[href],input[type="button"],input[type="submit"],input[type="reset"],[role="button"][tabindex]';

export const createTrigger = <P extends TriggerEvents>(
  trigger: Accessor<JSX.Element | TriggerRenderer<P>>,
  props: P,
  fallback: (content: JSX.Element, props: P) => JSX.Element,
) => {
  const renderer = (): TriggerRenderer<P> | undefined => {
    const value = trigger();
    return typeof value === 'function' ? value : undefined;
  };
  const supplied = children(() => {
    const value = trigger();
    return typeof value === 'function' ? undefined : value;
  });
  const element = () => {
    if (typeof HTMLElement === 'undefined') return undefined;
    for (const value of supplied.toArray()) {
      if (!(value instanceof HTMLElement)) continue;
      if (value.matches(INTERACTIVE_TRIGGER)) return value;
      const descendant = value.querySelector<HTMLElement>(INTERACTIVE_TRIGGER);
      if (descendant) return descendant;
    }
    return undefined;
  };

  createEffect(() => {
    const node = element();
    if (!node) return;
    const previous = new Map<string, string | null>();
    for (const [name, value] of Object.entries(props)) {
      if (!name.startsWith('aria-')) continue;
      previous.set(name, node.getAttribute(name));
      if (value === undefined) node.removeAttribute(name);
      else node.setAttribute(name, String(value));
    }
    onCleanup(() => {
      for (const [name, value] of previous) {
        if (value === null) node.removeAttribute(name);
        else node.setAttribute(name, value);
      }
    });
  });

  const containsTarget = (event: Event) => {
    const node = element();
    return node && event.composedPath().includes(node);
  };

  return {
    content: (
      <Show
        when={renderer()}
        keyed
        fallback={
          <Show when={element()} fallback={fallback(supplied(), props)}>
            {supplied()}
          </Show>
        }
      >
        {(render) => render(props)}
      </Show>
    ),
    // The wrapper's delegated handlers run after the supplied element's own handlers.
    onClick: (event: MouseEvent & { currentTarget: HTMLElement; target: Element }) => {
      if (containsTarget(event) && !event.defaultPrevented) props.onClick(event);
    },
    onKeyDown: (event: KeyboardEvent & { currentTarget: HTMLElement; target: Element }) => {
      if (containsTarget(event) && !event.defaultPrevented) props.onKeyDown?.(event);
    },
  };
};
