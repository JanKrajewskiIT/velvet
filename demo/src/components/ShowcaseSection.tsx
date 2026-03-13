import { Card } from '@jankrajewskiit/ui';
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
}

interface PreviewGroupProps {
  title: string;
  subtitle?: string;
  children: JSX.Element;
}

export const ShowcaseSection = (props: ShowcaseSectionProps) => {
  return (
    <section class="showcase-section">
      <div class="showcase-heading">
        <h2 class="showcase-title">{props.title}</h2>
        {props.subtitle && <p class="showcase-subtitle">{props.subtitle}</p>}
      </div>
      <div class="showcase-content">{props.children}</div>
    </section>
  );
};

export const PreviewPanel = (props: PreviewPanelProps) => {
  return <Card class={`preview-panel ${props.class ?? ''}`}>{props.children}</Card>;
};

export const ShowcaseMeta = (props: ShowcaseMetaProps) => {
  return <p class="showcase-meta">{props.children}</p>;
};

export const PreviewGroup = (props: PreviewGroupProps) => {
  return (
    <section class="preview-group">
      <header class="preview-group-header">
        <h3 class="preview-group-title">{props.title}</h3>
        {props.subtitle && <p class="preview-group-subtitle">{props.subtitle}</p>}
      </header>
      <div class="preview-group-content">{props.children}</div>
    </section>
  );
};
