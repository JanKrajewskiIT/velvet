import {
  Accordion,
  AccordionItem,
  Button,
  Card,
  Chip,
  CodeText,
  DataCard,
  Divider,
  FlipCard,
  Footer,
  Grid,
  Heading,
  MainLayout,
  Navbar,
  ResizablePanel,
  SectionCard,
  Stack,
  Text,
} from '@jankrajewskiit/ui';
import { Show } from 'solid-js';

import type { SectionId } from '../App';
import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const LayoutSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const year = new Date().getFullYear();

  return (
    <div>
      <Show when={sectionId() === 'surfaces-main-layout'}>
        <ShowcaseSection title="MainLayout" subtitle="Full page shell composition without navbar items">
          <PreviewPanel>
            <PreviewGroup title="Full shell" subtitle="Header, content and footer inside one layout primitive">
              <div class="layoutPreviewShell">
                <MainLayout
                  navbar={<Navbar navItems={[]} toggleMenuLabel="Toggle navigation" navLabel="Main navigation" />}
                  footer={
                    <Footer
                      copyrightText={`(c) ${String(year)} MyApp`}
                      privacyLabel="Privacy"
                      privacyHref="/privacy"
                      builtWithText="Built with VelvetUi"
                    />
                  }
                >
                  <div class="layoutShellContent">
                    <div class="recronHero">
                      <Heading as="h3" level={3} variant="titleLg" class="recronTitle">
                        Dashboard
                      </Heading>
                      <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                        Fixed-height card with scrollable page content and footer pinned to the bottom.
                      </Text>
                    </div>
                  </div>
                </MainLayout>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Use slots:{' '}
            <CodeText as="span" class="codeInline">
              navbar
            </CodeText>{' '}
            and{' '}
            <CodeText as="span" class="codeInline">
              footer
            </CodeText>{' '}
            in{' '}
            <CodeText as="span" class="codeInline">
              MainLayout
            </CodeText>
            .
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'surfaces-layouts'}>
        <ShowcaseSection title="Grid" subtitle="Responsive multi-column primitive">
          <PreviewPanel>
            <Grid columns={3} gap="sm">
              <Chip variant="subtle" label="Column 1" />
              <Chip variant="subtle" label="Column 2" />
              <Chip variant="subtle" label="Column 3" />
              <Chip variant="subtle" label="Column 4" />
              <Chip variant="subtle" label="Column 5" />
            </Grid>
            <Grid minColumnWidth="180px" gap="md">
              <Chip variant="subtle" label="Auto-fit A" />
              <Chip variant="subtle" label="Auto-fit B" />
              <Chip variant="subtle" label="Auto-fit C" />
              <Chip variant="subtle" label="Auto-fit D" />
            </Grid>
          </PreviewPanel>
          <ShowcaseMeta>
            Set fixed columns via{' '}
            <CodeText as="span" class="codeInline">
              columns
            </CodeText>{' '}
            or use responsive auto-fit with{' '}
            <CodeText as="span" class="codeInline">
              minColumnWidth
            </CodeText>
            .
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Stack" subtitle="Flexible vertical and horizontal spacing layout">
          <PreviewPanel>
            <Stack gap="sm">
              <Chip variant="subtle" label="First item" />
              <Chip variant="subtle" label="Second item" />
              <Chip variant="subtle" label="Third item" />
            </Stack>
            <Stack direction="horizontal" gap="md" align="center" justify="between" wrap>
              <Chip variant="subtle" label="Horizontal" />
              <Chip variant="subtle" label="Aligned center" />
              <Chip variant="subtle" label="Wrap enabled" />
            </Stack>
          </PreviewPanel>
          <ShowcaseMeta>
            Use{' '}
            <CodeText as="span" class="codeInline">
              direction
            </CodeText>
            ,{' '}
            <CodeText as="span" class="codeInline">
              gap
            </CodeText>
            ,{' '}
            <CodeText as="span" class="codeInline">
              align
            </CodeText>
            ,{' '}
            <CodeText as="span" class="codeInline">
              justify
            </CodeText>{' '}
            and{' '}
            <CodeText as="span" class="codeInline">
              wrap
            </CodeText>{' '}
            to compose spacing layouts quickly.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="ResizablePanel" subtitle="Split panel with draggable handle">
          <PreviewPanel>
            <PreviewGroup title="Horizontal split" subtitle="Drag handle to adjust available width">
              <div class="resizableDemoShell">
                <ResizablePanel direction="horizontal" initialSplit={40} minSize={20}>
                  <div class="resizableDemoPanel">
                    <strong>Left panel</strong>
                    <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                      Drag the handle to resize.
                    </Text>
                  </div>
                  <div class="resizableDemoPanel">
                    <strong>Right panel</strong>
                    <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                      Content adjusts automatically.
                    </Text>
                  </div>
                </ResizablePanel>
              </div>
            </PreviewGroup>
            <PreviewGroup title="Vertical split" subtitle="Same API, vertical direction">
              <div class="resizableDemoShell">
                <ResizablePanel direction="vertical" initialSplit={50} minSize={20}>
                  <div class="resizableDemoPanel">
                    <strong>Top panel</strong>
                  </div>
                  <div class="resizableDemoPanel">
                    <strong>Bottom panel</strong>
                  </div>
                </ResizablePanel>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Supports{' '}
            <CodeText as="span" class="codeInline">
              horizontal
            </CodeText>{' '}
            and{' '}
            <CodeText as="span" class="codeInline">
              vertical
            </CodeText>{' '}
            directions with configurable min size.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Divider" subtitle="Visual separator with optional label">
          <PreviewPanel>
            <PreviewGroup title="Horizontal variants">
              <Divider />
              <Divider label="OR" />
              <Divider variant="dashed" />
              <Divider variant="dashed" label="Section" />
            </PreviewGroup>
            <PreviewGroup title="Vertical variant">
              <div class="row dividerVerticalDemo">
                <span>Left</span>
                <Divider orientation="vertical" />
                <span>Right</span>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'surfaces-cards'}>
        <ShowcaseSection title="Card" subtitle="Basic bordered content container">
          <PreviewPanel>
            <PreviewGroup title="Base card">
              <Card>
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  Simple bordered container for arbitrary content.
                </Text>
              </Card>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Use{' '}
            <CodeText as="span" class="codeInline">
              Card
            </CodeText>{' '}
            as a minimal wrapper for grouped content.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="DataCard variants" subtitle="Material-inspired filled, elevated and outlined styles">
          <PreviewPanel>
            <PreviewGroup title="Filled, elevated and outlined">
              <div class="gridCards">
                <DataCard
                  variant="filled"
                  hoverable
                  header={<strong>Filled card</strong>}
                  footer={<Button variant="primary">Continue</Button>}
                >
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    Tonal variant inspired by modern Material surfaces.
                  </Text>
                </DataCard>
                <DataCard
                  variant="elevated"
                  hoverable
                  header={<strong>Elevated card</strong>}
                  footer={<Button variant="primary">Open</Button>}
                >
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    Balanced default with soft depth and strong readability.
                  </Text>
                </DataCard>
                <DataCard
                  variant="outlined"
                  hoverable
                  header={<strong>Outlined card</strong>}
                  footer={<Button variant="ghost">Details</Button>}
                >
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    Clean and neutral variant for dense enterprise layouts.
                  </Text>
                </DataCard>
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            All variants support{' '}
            <CodeText as="span" class="codeInline">
              header
            </CodeText>
            , content,{' '}
            <CodeText as="span" class="codeInline">
              footer
            </CodeText>{' '}
            and optional{' '}
            <CodeText as="span" class="codeInline">
              hoverable
            </CodeText>
            .
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="FlipCard" subtitle="Interactive front/back card">
          <PreviewPanel>
            <PreviewGroup title="Click and hover samples">
              <div class="flipCardGrid">
                <FlipCard
                  width="220px"
                  height="140px"
                  front={
                    <div class="flipCardFace">
                      <Heading as="strong" level={4} variant="titleLg" tone="primary" class="flipCardTitle">
                        VelvetUI
                      </Heading>
                      <Text as="span" variant="bodySm" tone="muted" class="flipCardHint">
                        Click to flip
                      </Text>
                    </div>
                  }
                  back={
                    <div class="flipCardBack">
                      <strong>SolidJS plus Vite</strong>
                      <Text as="span" variant="bodySm" tone="muted" class="flipCardHint">
                        TypeScript and CSS Modules
                      </Text>
                    </div>
                  }
                />
                <FlipCard
                  width="220px"
                  height="140px"
                  front={<div class="flipCardFace">UI System</div>}
                  back={<div class="flipCardSimple">Dark and light theme</div>}
                />
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            <CodeText as="span" class="codeInline">
              FlipCard
            </CodeText>{' '}
            reveals back content on click or hover.
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'surfaces-collapsible'}>
        <ShowcaseSection title="Accordion" subtitle="Progressive disclosure for grouped content">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Accordion>
                <AccordionItem label="What is VelvetUI?">
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    VelvetUI is a SolidJS component library built with CSS Modules, TypeScript and Vite.
                  </Text>
                </AccordionItem>
                <AccordionItem label="How to install?">
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    npm install @jankrajewskiit/ui
                  </Text>
                </AccordionItem>
                <AccordionItem label="Disabled item" disabled>
                  <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                    This content is not accessible.
                  </Text>
                </AccordionItem>
              </Accordion>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="SectionCard" subtitle="Collapsible card for grouped settings">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <SectionCard label="Details" defaultOpen>
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  Collapsible card for grouped settings.
                </Text>
              </SectionCard>
              <SectionCard label="Advanced options">
                <Text as="p" variant="bodySm" tone="muted" class="mutedText">
                  Collapsed by default.
                </Text>
              </SectionCard>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            <CodeText as="span" class="codeInline">
              SectionCard
            </CodeText>{' '}
            combines a card with built-in collapsible behavior.
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default LayoutSection;
