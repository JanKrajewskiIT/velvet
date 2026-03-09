import type { JSX } from 'solid-js';

interface ShowcaseSectionProps {
  title: string;
  subtitle?: string;
  children: JSX.Element;
}

interface PreviewPanelProps {
  children: JSX.Element;
  class?: string;
}

interface ShowcaseMetaProps {
  children: JSX.Element;
  class?: string;
}

export const ShowcaseSection = (props: ShowcaseSectionProps) => {
  return (
    <section class="showcaseSection">
      <div class="showcaseHeading">
        <h2 class="showcaseTitle">{props.title}</h2>
        {props.subtitle && <p class="showcaseSubtitle">{props.subtitle}</p>}
      </div>
      {props.children}
    </section>
  );
};

export const PreviewPanel = (props: PreviewPanelProps) => {
  return (
    <div class={`previewPanel ${props.class ?? ''}`}>{props.children}</div>
  );
};

export const ShowcaseMeta = (props: ShowcaseMetaProps) => {
  return <p class={`showcaseMeta ${props.class ?? ''}`}>{props.children}</p>;
};
