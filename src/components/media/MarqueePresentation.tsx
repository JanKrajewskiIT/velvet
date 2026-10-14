import { createUniqueId, type JSX, onCleanup, onMount } from 'solid-js';

import { disablePresentationControl, presentationAttribute } from './presentationAttributes';

export interface MarqueePresentationProps {
  render: () => JSX.Element;
  gap: number;
}

export const MarqueePresentation = (props: MarqueePresentationProps) => {
  const prefix = createUniqueId();
  let lane!: HTMLDivElement;
  onMount(() => {
    const sanitize = () => {
      for (const element of lane.querySelectorAll('*')) {
        for (const attribute of Array.from(element.attributes)) {
          const value = presentationAttribute(prefix, attribute.name, attribute.value);
          if (value === undefined) element.removeAttribute(attribute.name);
          else if (value !== attribute.value) element.setAttribute(attribute.name, value);
        }
        disablePresentationControl(element);
      }
    };
    sanitize();
    const observer = new MutationObserver(sanitize);
    observer.observe(lane, { childList: true, subtree: true, attributes: true });
    const pause = (event: Event) => {
      if (event.target instanceof HTMLMediaElement) event.target.pause();
    };
    lane.addEventListener('play', pause, true);
    onCleanup(() => {
      observer.disconnect();
      lane.removeEventListener('play', pause, true);
    });
  });
  return (
    <div
      ref={(element) => {
        lane = element;
      }}
      class="vui-marquee__group"
      style={{ gap: `${props.gap}px` }}
      aria-hidden="true"
      inert
    >
      {props.render()}
    </div>
  );
};
