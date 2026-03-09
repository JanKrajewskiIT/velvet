import {
  ActionRow,
  addToast,
  AiResultPanel,
  Button,
  FileDropZone,
  FlipCard,
  FormField,
  Input,
  MarkdownEditDialog,
  MarkdownRenderer,
  Wizard,
} from '@jankrajewskiit/ui';
import { IoDocument } from 'solid-icons/io';
import { createSignal } from 'solid-js';

import {
  PreviewPanel,
  ShowcaseMeta,
  ShowcaseSection,
} from '../components/ShowcaseSection';

type AnalysisState = 'idle' | 'loading' | 'result' | 'error';

const INITIAL_MARKDOWN = `## Release Notes

- Updated visual tokens
- Improved core controls
- Refreshed demo experience`;

const ComplexSection = () => {
  const [droppedFile, setDroppedFile] = createSignal<string | null>(null);
  const [analysisState, setAnalysisState] = createSignal<AnalysisState>('idle');
  const [resultNext, setResultNext] = createSignal(true);
  const [markdown, setMarkdown] = createSignal(INITIAL_MARKDOWN);
  const [editorOpen, setEditorOpen] = createSignal(false);

  const wizardSteps = [
    {
      label: 'Account',
      component: (
        <div class="col">
          <FormField label="Email" id="wiz-email">
            <Input id="wiz-email" type="email" placeholder="you@example.com" />
          </FormField>
          <FormField label="Username" id="wiz-user">
            <Input id="wiz-user" type="text" placeholder="jankowalski" />
          </FormField>
        </div>
      ),
    },
    {
      label: 'Profile',
      component: (
        <div class="col">
          <FormField label="Full name" id="wiz-name">
            <Input id="wiz-name" type="text" placeholder="Jan Kowalski" />
          </FormField>
          <FormField label="Bio" id="wiz-bio">
            <Input id="wiz-bio" type="text" placeholder="Short bio..." />
          </FormField>
        </div>
      ),
    },
    {
      label: 'Confirm',
      component: (
        <p class="mutedText">
          Review your information and click <strong>Finish</strong> to complete
          registration.
        </p>
      ),
    },
  ];

  const runAnalysis = () => {
    setAnalysisState('loading');

    setTimeout(() => {
      const shouldSucceed = resultNext();
      setAnalysisState(shouldSucceed ? 'result' : 'error');
      setResultNext((current) => !current);
    }, 1200);
  };

  return (
    <div>
      <ShowcaseSection title="Wizard" subtitle="Multi-step guided workflow">
        <PreviewPanel>
          <Wizard
            steps={wizardSteps}
            backLabel="Back"
            nextLabel="Next"
            finishLabel="Finish"
            onFinish={() => {
              addToast({ type: 'success', message: 'Registration complete!' });
            }}
          />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="AiResultPanel"
        subtitle="Reusable result layout for AI and scoring flows"
      >
        <PreviewPanel>
          <AiResultPanel
            isPending={analysisState() === 'loading'}
            loadingText="Analyzing design consistency..."
            hasError={analysisState() === 'error'}
            errorText="Analysis timed out. Retry to generate a new report."
            onRetry={runAnalysis}
            retryLabel="Retry"
            score={87}
            scoreLabel="Design consistency"
            summary="The component library now uses stronger visual hierarchy and shared interaction patterns."
            sections={[
              {
                icon: 'success',
                title: 'Highlights',
                items: [
                  'Unified interaction styles for buttons, inputs and tabs',
                  'Consistent spacing and elevation across sections',
                ],
              },
              {
                icon: 'danger',
                title: 'Needs follow-up',
                items: [
                  'Extend the same polish to all remaining secondary components',
                ],
              },
            ]}
            hasResult={analysisState() === 'result'}
            idle={
              <p class="mutedText">
                Run analysis to generate a consistency report for the current
                component set.
              </p>
            }
            actions={
              <ActionRow align="end">
                <Button
                  variant="ghost"
                  onClick={() => setAnalysisState('idle')}
                >
                  Reset
                </Button>
                <Button onClick={runAnalysis}>Run analysis</Button>
              </ActionRow>
            }
          />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="MarkdownEditDialog"
        subtitle="Edit and preview markdown in one flow"
      >
        <PreviewPanel class="col">
          <ActionRow align="start">
            <Button variant="ghost" onClick={() => setEditorOpen(true)}>
              Open markdown editor
            </Button>
          </ActionRow>
          <MarkdownRenderer content={markdown()} />
        </PreviewPanel>

        <MarkdownEditDialog
          open={editorOpen()}
          title="Edit release notes"
          label="Markdown"
          initialValue={markdown()}
          previewLabel="Preview"
          saveLabel="Save changes"
          cancelLabel="Cancel"
          onSave={setMarkdown}
          onClose={() => setEditorOpen(false)}
        />
      </ShowcaseSection>

      <ShowcaseSection title="FileDropZone" subtitle="Drag-and-drop file input">
        <PreviewPanel class="col">
          <FileDropZone
            label="Drop a file here or click to browse"
            hint="Supports: .pdf, .jpg, .png"
            accept=".pdf,.jpg,.png,image/*"
            icon={<IoDocument size={28} />}
            onFile={(f) => {
              setDroppedFile(f.name);
              addToast({ type: 'success', message: `Picked: ${f.name}` });
            }}
          />
          {droppedFile() && (
            <ShowcaseMeta>
              Selected file: <strong>{droppedFile()}</strong>
            </ShowcaseMeta>
          )}
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="FlipCard" subtitle="Interactive front/back card">
        <PreviewPanel>
          <div class="flipCardGrid">
            <FlipCard
              width="220px"
              height="140px"
              front={
                <div class="flipCardFace">
                  <strong class="flipCardTitle">VelvetUI</strong>
                  <span class="flipCardHint">Click to flip</span>
                </div>
              }
              back={
                <div class="flipCardBack">
                  <strong>SolidJS plus Vite</strong>
                  <span class="flipCardHint">TypeScript and CSS Modules</span>
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
        </PreviewPanel>
        <ShowcaseMeta>Click a card to flip it.</ShowcaseMeta>
      </ShowcaseSection>
    </div>
  );
};

export default ComplexSection;
