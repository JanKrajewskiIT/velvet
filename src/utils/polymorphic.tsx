import { dynamic, type JSX, type ValidComponent } from '@solidjs/web';
import { isStatic, omit } from 'solid-js';

export type ElementTag = keyof JSX.IntrinsicElements;

/** Native attributes of an element, with `style` narrowed to an object so components can merge into it. */
export type HtmlProps<E extends HTMLElement, Omitted extends string = never> = Omit<
  JSX.HTMLAttributes<E>,
  'style' | Omitted
> & { style?: JSX.CSSProperties };

/** Attributes that exist only on some tags (`href`, `type`, `for`, `disabled`) are accepted for any tag. */
type PolymorphicProps = { tag: ElementTag } & JSX.HTMLAttributes<HTMLElement> & { [attribute: string]: unknown };

/**
 * Renders `tag` with the given attributes. The one place that bridges the tag union to
 * `dynamic`'s per-element prop types, so components can accept an `as` prop without casts.
 */
export const Polymorphic = (props: PolymorphicProps): JSX.Element => {
  const Tag = dynamic((): ValidComponent => props.tag, { static: isStatic(props, 'tag') });
  const rest = omit(props, 'tag');
  return <Tag {...rest} />;
};
