import { createSignal } from 'solid-js';
import { Button } from '../../../src';
import {
  AiResultPanel,
  type AiSection,
  AnalysisRequest,
  type AnalysisSource,
  type AnalysisType,
  AtsAnalysisPanel,
  type AtsResult,
  CalendarOrganizer,
  ChatMessage,
  ChatThread,
  type ColorLabel,
  ColorLabelManager,
  ColorLabelSelectionDialog,
  type OrganizerEvent,
  TypingIndicator,
} from '../../../src/components/patterns';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const RUN_DELAY_MS = 1500;
const SAVE_DELAY_MS = 600;
const DAY_MS = 864e5;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const SECTIONS: AiSection[] = [
  {
    title: 'Strengths',
    icon: 'check',
    tone: 'success',
    items: ['4 years of React and TypeScript', 'Led a design-system migration'],
  },
  { title: 'Gaps', icon: 'triangle-alert', tone: 'warning', items: ['No GraphQL experience'] },
];

const SOURCES: AnalysisSource[] = [
  { id: 'cv', label: 'CV', kind: 'cv', detail: 'Anna_Kowalska_CV.pdf · 2 pages' },
  { id: 'job', label: 'Job offer', kind: 'job', status: 'missing' },
  { id: 'notes', label: 'Recruiter notes', kind: 'notes', detail: '3 notes' },
  {
    id: 'call',
    label: 'Interview transcript',
    kind: 'transcript',
    status: 'error',
    error: 'The file is password protected',
  },
];

const ANALYSES: AnalysisType[] = [
  {
    id: 'match',
    label: 'Candidate ↔ role match',
    description: 'Score the CV against the job offer',
    icon: 'target',
    requires: ['cv', 'job'],
  },
  {
    id: 'summary',
    label: 'Candidate summary',
    description: 'Short profile from all context',
    icon: 'file-text',
    requires: ['cv'],
  },
];

const ATS_RESULT: AtsResult = {
  score: 78,
  verdict: 'Strong on systems work, light on people leadership',
  summary: 'The CV covers most hard requirements. Management scope is implied rather than stated.',
  categories: [
    { label: 'Skills', score: 88, weight: 3, note: 'React, TypeScript and testing are all present.' },
    { label: 'Experience', score: 72, weight: 2 },
    { label: 'Leadership', score: 45, weight: 1, note: 'No team size or hiring mentioned.' },
  ],
  keywords: { matched: ['React', 'TypeScript', 'Vite'], partial: ['GraphQL'], missing: ['Kubernetes', 'Terraform'] },
  strengths: ['Shipped a design system used by 6 teams', 'Strong testing habits'],
  gaps: ['No people-management evidence'],
  recommendations: [
    {
      severity: 'critical',
      title: 'State your team size',
      message: 'Add how many people you led and for how long.',
      evidence: { quote: 'Coordinated the frontend guild', source: 'CV, page 1' },
    },
    {
      severity: 'warning',
      title: 'Quantify outcomes',
      message: 'Replace “improved performance” with a measured result.',
    },
    { severity: 'suggestion', title: 'Add a short summary', message: 'Two lines at the top help scanners.' },
    { severity: 'suggestion', title: 'Link a portfolio' },
    { severity: 'suggestion', title: 'Mention certifications' },
  ],
};

const eventOn = (offsetDays: number, rest: Omit<OrganizerEvent, 'date'>): OrganizerEvent => ({
  ...rest,
  date: new Date(Date.now() + offsetDays * DAY_MS),
});

const INITIAL_EVENTS: OrganizerEvent[] = [
  eventOn(0, { id: 1, title: 'Stand-up', time: '09:30', location: 'Room 4' }),
  eventOn(0, { id: 2, title: 'Design review', time: '14:00', color: 'var(--dv-3)' }),
  eventOn(0, { id: 3, title: 'Release notes', color: 'var(--dv-5)' }),
  eventOn(2, { id: 4, title: 'Interview — Anna K.', time: '11:00', color: 'var(--dv-2)' }),
  eventOn(5, { id: 5, title: 'Planning', time: '10:00' }),
];

const INITIAL_LABELS: ColorLabel[] = [
  { id: 'urgent', name: 'Urgent', color: 'var(--dv-1)', count: 4 },
  { id: 'follow-up', name: 'Follow up', color: 'var(--dv-2)', count: 2 },
  { id: 'remote', name: 'Remote', color: 'var(--dv-3)', count: 0 },
];

const AiDemo = () => {
  const [vote, setVote] = createSignal<'up' | 'down' | null>(null);
  return (
    <>
      <Example
        title="Done"
        stack
        code={
          '<AiResultPanel model="claude-haiku-4.5" elapsed="1.2s" score={92} sections={sections} tokens={1284} cost="$0.0021" />'
        }
      >
        <AiResultPanel
          model="claude-haiku-4.5"
          elapsed="1.2s"
          score={92}
          headline="Match: very high"
          subline="Ada Kowalska × Senior Frontend"
          summary="A well-rounded frontend profile with strong React depth."
          sections={SECTIONS}
          sources={[
            { label: 'CV, page 1', detail: 'Anna_Kowalska_CV.pdf' },
            { label: 'Job offer', href: 'https://example.com/job' },
          ]}
          tokens={1284}
          cost="$0.0021"
          feedback={vote()}
          onFeedback={(value) => setVote(() => value)}
          onRegenerate={() => undefined}
        />
      </Example>
      <Example title="Streaming" stack>
        <AiResultPanel status="streaming" model="claude-haiku-4.5" />
        <AiResultPanel status="streaming" headline="Match: high" sections={SECTIONS.slice(0, 1)} />
      </Example>
      <Example title="Error" stack>
        <AiResultPanel status="error" onRegenerate={() => undefined} />
      </Example>
    </>
  );
};

const AnalysisRequestDemo = () => {
  const [status, setStatus] = createSignal<'idle' | 'running'>('idle');
  const [step, setStep] = createSignal(0);
  const run = async () => {
    setStatus('running');
    setStep(0);
    await wait(RUN_DELAY_MS / 3);
    setStep(1);
    await wait(RUN_DELAY_MS / 3);
    setStep(2);
    await wait(RUN_DELAY_MS / 3);
    setStatus('idle');
  };
  return (
    <>
      <Example
        title="Blocked until requirements are met"
        stack
        code={'<AnalysisRequest sources={sources} analyses={analyses} onRun={run} />'}
      >
        <AnalysisRequest
          description="Combine the CV, job offer and notes."
          model="Claude · EU"
          sources={SOURCES}
          analyses={ANALYSES}
          defaultSelected={['cv', 'notes']}
          status={status()}
          steps={['Reading CV', 'Matching requirements', 'Scoring']}
          step={step()}
          onRun={run}
          onCancel={() => setStatus('idle')}
        />
      </Example>
      <Example title="Ready, rejected run" stack>
        <AnalysisRequest
          sources={SOURCES.slice(0, 1)}
          analyses={ANALYSES.slice(1)}
          estimate="≈ 4k tokens · 1 credit"
          onRun={() => Promise.reject(new Error('Backend unavailable'))}
        />
      </Example>
    </>
  );
};

const AtsDemo = () => (
  <>
    <Example
      title="Done"
      stack
      code={'<AtsAnalysisPanel subject="Anna Kowalska" target="Senior Frontend" result={result} />'}
    >
      <AtsAnalysisPanel
        subject="Anna Kowalska"
        target="Senior Frontend"
        model="Claude"
        generatedAt="today"
        result={ATS_RESULT}
        onExport={() => undefined}
        onRerun={() => undefined}
        onFeedback={() => undefined}
      />
    </Example>
    <Example title="Loading" stack>
      <AtsAnalysisPanel status="loading" steps={['Reading CV', 'Matching requirements', 'Scoring']} step={1} />
    </Example>
    <Example title="Empty and error" stack>
      <AtsAnalysisPanel status="empty" />
      <AtsAnalysisPanel status="error" onRetry={() => undefined} />
    </Example>
  </>
);

const CalendarDemo = () => {
  const [events, setEvents] = createSignal(INITIAL_EVENTS);
  return (
    <Example title="Month planner" stack code={'<CalendarOrganizer events={events} onEventsChange={setEvents} />'}>
      <CalendarOrganizer events={events()} onEventsChange={setEvents} />
    </Example>
  );
};

const ChatDemo = () => {
  const [vote, setVote] = createSignal<'up' | 'down' | null>(null);
  return (
    <Example
      title="Thread"
      stack
      code={'<ChatThread height={420}><ChatMessage role="user" content="…" /></ChatThread>'}
    >
      <ChatThread height={420}>
        {/* eslint-disable-next-line jsx-a11y/aria-role -- ChatMessage role is the message author, not an ARIA role */}
        <ChatMessage role="system">Conversation started</ChatMessage>
        {/* eslint-disable-next-line jsx-a11y/aria-role -- ChatMessage role is the message author, not an ARIA role */}
        <ChatMessage role="user" author="You" time="10:02" content="Summarise the candidate in two lines." />
        <ChatMessage
          author="Assistant"
          time="10:02"
          content="Anna is a senior frontend engineer with six years of React and a design-system background."
          sources={[{ title: 'CV', href: 'https://example.com/cv' }, { title: 'LinkedIn' }]}
          feedback={vote()}
          onFeedback={(value) => setVote(() => value)}
          onRetry={() => undefined}
        />
        <ChatMessage streaming />
        <ChatMessage streaming content="Looking at the job offer" />
        <ChatMessage error onRetry={() => undefined} />
        <TypingIndicator />
      </ChatThread>
    </Example>
  );
};

const LabelsDemo = () => {
  const [labels, setLabels] = createSignal(INITIAL_LABELS);
  const [assigned, setAssigned] = createSignal<string[]>(['urgent']);
  const [managing, setManaging] = createSignal(false);
  const [selecting, setSelecting] = createSignal(false);
  const save = async (next: ColorLabel[]) => {
    await wait(SAVE_DELAY_MS);
    setLabels(next);
  };
  const create = async (draft: { name: string; color: string }): Promise<ColorLabel> => {
    await wait(SAVE_DELAY_MS);
    const label = { id: `new-${labels().length}`, ...draft };
    setLabels([...labels(), label]);
    return label;
  };
  const submit = async (ids: string[]) => {
    await wait(SAVE_DELAY_MS);
    setAssigned(ids);
  };
  return (
    <>
      <Example
        title="Manager"
        code={'<ColorLabelManager open={open()} labels={labels()} onChange={save} onClose={close} />'}
      >
        <Button variant="secondary" onClick={() => setManaging(true)}>
          Manage labels
        </Button>
        <ColorLabelManager open={managing()} onClose={() => setManaging(false)} labels={labels()} onChange={save} />
      </Example>
      <Example
        title="Selection"
        code={
          '<ColorLabelSelectionDialog open={open()} labels={labels()} value={ids()} onSubmit={submit} onCreate={create} />'
        }
      >
        <Button variant="secondary" onClick={() => setSelecting(true)}>
          Assign labels ({assigned().length})
        </Button>
        <ColorLabelSelectionDialog
          open={selecting()}
          onClose={() => setSelecting(false)}
          labels={labels()}
          value={assigned()}
          onSubmit={submit}
          onCreate={create}
          onManage={() => {
            setSelecting(false);
            setManaging(true);
          }}
          description="Choose the labels that apply to this candidate."
        />
      </Example>
    </>
  );
};

export const patternsADemos: DemoEntry[] = [
  {
    id: 'ai-result-panel',
    group: '28 Patterns',
    title: 'AiResultPanel',
    description: 'Structured (non-chat) model answer with provenance, score, findings, sources and cost.',
    render: () => <AiDemo />,
  },
  {
    id: 'analysis-request',
    group: '28 Patterns',
    title: 'AnalysisRequest',
    description:
      'Compose an AI analysis from several sources; Run is blocked with a reason until requirements are met.',
    render: () => <AnalysisRequestDemo />,
  },
  {
    id: 'ats-analysis-panel',
    group: '28 Patterns',
    title: 'AtsAnalysisPanel',
    description: 'Candidate ↔ role result: score band, breakdown, keywords, strengths, gaps and recommendations.',
    render: () => <AtsDemo />,
  },
  {
    id: 'calendar-organizer',
    group: '28 Patterns',
    title: 'CalendarOrganizer',
    description:
      'Month planner with arrow-key day navigation, multi-day events, a day detail panel, quick add, edit, delete with confirmation and drag-to-move.',
    render: () => <CalendarDemo />,
  },
  {
    id: 'chat',
    group: '28 Patterns',
    title: 'ChatMessage',
    description: 'Chat turns, scrolling log that follows new messages, and the typing indicator.',
    render: () => <ChatDemo />,
  },
  {
    id: 'color-labels',
    group: '28 Patterns',
    title: 'Colour labels',
    description: 'ColorLabelManager and ColorLabelSelectionDialog.',
    render: () => <LabelsDemo />,
  },
];
