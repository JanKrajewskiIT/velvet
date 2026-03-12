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
    <section class="showcase-section">
      <div class="showcase-heading">
        <h2 class="showcase-title">{props.title}</h2>
        {props.subtitle && <p class="showcase-subtitle">{props.subtitle}</p>}
      </div>
      {props.children}
    </section>
  );
};

export const PreviewPanel = (props: PreviewPanelProps) => {
  return <div class={`preview-panel ${props.class ?? ''}`}>{props.children}</div>;
};

export const ShowcaseMeta = (props: ShowcaseMetaProps) => {
  return <p class={`showcase-meta ${props.class ?? ''}`}>{props.children}</p>;
};
