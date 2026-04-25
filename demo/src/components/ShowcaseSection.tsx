import { Card, classNames, Heading, Text } from '@jankrajewskiit/ui';
import type { JSX } from 'solid-js';

interface ShowcaseSectionProps {
  id?: string;
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
    <section id={props.id} class="showcaseSection">
      <div class="showcaseHeading">
        <Heading level={2} variant="h3" class="showcaseTitle">
          {props.title}
        </Heading>
        {props.subtitle && (
          <Text as="p" variant="bodySm" tone="muted" class="showcaseSubtitle">
            {props.subtitle}
          </Text>
        )}
      </div>
      <div class="showcaseContent">{props.children}</div>
    </section>
  );
};

export const PreviewPanel = (props: PreviewPanelProps) => {
  return <Card class={classNames('previewPanel', props.class)}>{props.children}</Card>;
};

export const ShowcaseMeta = (props: ShowcaseMetaProps) => {
  return (
    <Text as="p" variant="bodySm" tone="muted" class="showcaseMeta">
      {props.children}
    </Text>
  );
};

export const PreviewGroup = (props: PreviewGroupProps) => {
  return (
    <section class="previewGroup">
      <header class="previewGroupHeader">
        <Heading level={3} variant="titleMd" tone="secondary" class="previewGroupTitle">
          {props.title}
        </Heading>
        {props.subtitle && (
          <Text as="p" variant="caption" tone="muted" class="previewGroupSubtitle">
            {props.subtitle}
          </Text>
        )}
      </header>
      <div class="previewGroupContent">{props.children}</div>
    </section>
  );
};
