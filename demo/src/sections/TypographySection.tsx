import { CodeText, Heading, Text } from '@jankrajewskiit/ui';

import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const TypographySection = () => {
  return (
    <div>
      <ShowcaseSection title="Heading variants" subtitle="Display and heading hierarchy for page and section titles">
        <PreviewPanel>
          <PreviewGroup title="Scale">
            <Heading variant="displayLg">Display large heading</Heading>
            <Heading variant="displayMd">Display medium heading</Heading>
            <Heading level={1} variant="h1">
              Heading level 1
            </Heading>
            <Heading level={2} variant="h2">
              Heading level 2
            </Heading>
            <Heading level={3} variant="h3">
              Heading level 3
            </Heading>
            <Heading level={4} variant="titleLg">
              Title large
            </Heading>
            <Heading level={5} variant="titleMd">
              Title medium
            </Heading>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Text variants" subtitle="Body, label, caption and overline styles with semantic tones">
        <PreviewPanel>
          <PreviewGroup title="Core text roles">
            <Text variant="bodyLg">Body large text for highlighted content and intros.</Text>
            <Text variant="bodyMd">Body medium text as the default reading style.</Text>
            <Text variant="bodySm">Body small text for compact UI areas.</Text>
            <Text variant="labelLg">Label large for controls and emphasized metadata.</Text>
            <Text variant="labelMd">Label medium for dense interfaces and chips.</Text>
            <Text variant="caption">Caption text for helper descriptions.</Text>
            <Text variant="overline">Section label</Text>
          </PreviewGroup>
          <PreviewGroup title="Tone examples">
            <Text tone="default">Default tone</Text>
            <Text tone="secondary">Secondary tone</Text>
            <Text tone="muted">Muted tone</Text>
            <Text tone="tertiary">Tertiary tone</Text>
            <Text tone="primary">Primary tone</Text>
          </PreviewGroup>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="CodeText variants" subtitle="Inline and block code styles with mono typography">
        <PreviewPanel>
          <PreviewGroup title="Inline code">
            <Text>
              Use{' '}
              <CodeText as="span" class="codeInline">
                &lt;Text variant="bodySm" /&gt;
              </CodeText>{' '}
              for compact descriptions and{' '}
              <CodeText as="span" class="codeInline">
                &lt;Heading variant="h2" /&gt;
              </CodeText>{' '}
              for section headers.
            </Text>
          </PreviewGroup>
          <PreviewGroup title="Block code">
            <CodeText as="pre" variant="block" size="md" class="installBlock">
              {`import { Heading, Text, CodeText } from '@jankrajewskiit/ui';

<Heading variant="h2">Section title</Heading>
<Text variant="bodySm" tone="muted">Helper text</Text>`}
            </CodeText>
          </PreviewGroup>
        </PreviewPanel>
        <ShowcaseMeta>Use typography primitives for content, and tokens in CSS for control internals.</ShowcaseMeta>
      </ShowcaseSection>
    </div>
  );
};

export default TypographySection;
