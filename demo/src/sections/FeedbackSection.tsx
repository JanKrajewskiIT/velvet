import {
  addToast,
  Button,
  Chip,
  EmptyState,
  ErrorFallback,
  ErrorMessage,
  LoadingContainer,
  Skeleton,
  Spinner,
  StatCard,
  TagChip,
} from '@jankrajewskiit/ui';
import { IoAlertCircle, IoCheckmarkCircle, IoFolder, IoPeople, IoSearch, IoStatsChart } from 'solid-icons/io';
import { createSignal } from 'solid-js';

import { PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const FeedbackSection = () => {
  const [retried, setRetried] = createSignal(false);

  return (
    <div>
      <ShowcaseSection title="Chip variants" subtitle="Status, selection and clickable chips">
        <PreviewPanel>
          <div class="row">
            <Chip variant="primary">Primary</Chip>
            <Chip variant="primaryOutline">Outline</Chip>
            <Chip variant="info">Info</Chip>
            <Chip variant="success">Success</Chip>
            <Chip variant="warning">Warning</Chip>
            <Chip variant="error">Error</Chip>
            <Chip variant="subtle">Subtle</Chip>
          </div>
          <div class="row">
            <Chip variant="success" filled>
              Filled success
            </Chip>
            <Chip variant="error" filled>
              Filled error
            </Chip>
            <Chip variant="info" size="sm">
              Small
            </Chip>
            <Chip variant="primary" selected>
              Selected
            </Chip>
            <Chip variant="primary" onClick={() => {}}>
              Clickable
            </Chip>
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="TagChip" subtitle="Color-coded tags with optional selection">
        <PreviewPanel>
          <div class="row">
            <TagChip label="design" color="#1467ff" />
            <TagChip label="frontend" color="#0288d1" />
            <TagChip label="selected" color="#2e7d32" selected />
            <TagChip label="clickable" color="#ed6c02" onClick={() => {}} />
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="StatCard" subtitle="Compact KPI cards">
        <div class="gridCards">
          <StatCard value="1 284" label="Active users" icon={<IoPeople />} colorClass="info" />
          <StatCard value="98.7%" label="Uptime" icon={<IoCheckmarkCircle />} colorClass="success" />
          <StatCard value="3" label="Open issues" icon={<IoAlertCircle />} colorClass="warning" />
          <StatCard value="42" label="Deployments" icon={<IoStatsChart />} colorClass="error" />
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Spinner" subtitle="Progress indicators in multiple sizes">
        <PreviewPanel>
          <div class="row">
            <Spinner size="sm" label="Small spinner" />
            <Spinner size="md" label="Medium spinner" />
            <Spinner size="lg" label="Large spinner" />
          </div>
        </PreviewPanel>
        <ShowcaseMeta>Spinners inherit brand colors and support reduced-motion preferences.</ShowcaseMeta>
      </ShowcaseSection>

      <ShowcaseSection title="Skeleton" subtitle="Loading placeholders with multiple variants">
        <PreviewPanel class="col">
          <div class="row">
            <Skeleton variant="circular" width={48} height={48} />
            <div class="col" style={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={16} />
              <Skeleton variant="text" width="90%" height={14} />
              <Skeleton variant="text" width="40%" height={14} />
            </div>
          </div>
          <Skeleton variant="rectangular" height={120} animation="pulse" />
          <Skeleton variant="text" width="80%" animation="none" />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="LoadingContainer" subtitle="Centered loading states for container surfaces">
        <PreviewPanel>
          <div class="loaderRow">
            <div class="loaderSample loaderSm">
              <LoadingContainer size="sm" />
            </div>
            <div class="loaderSample loaderMd">
              <LoadingContainer size="md" />
            </div>
            <div class="loaderSample loaderLg">
              <LoadingContainer size="lg" />
            </div>
          </div>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="EmptyState" subtitle="Friendly zero-state messaging">
        <PreviewPanel class="col">
          <EmptyState
            icon={<IoSearch size={40} />}
            message="No results found"
            hint="Try adjusting your search query or filters."
          />
          <EmptyState icon={<IoFolder size={40} />} message="This folder is empty" />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="ErrorMessage" subtitle="Inline error alerts">
        <PreviewPanel class="col">
          <ErrorMessage>Failed to load data. Please try again.</ErrorMessage>
          <ErrorMessage>Network error: connection timed out.</ErrorMessage>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="ErrorFallback" subtitle="Page-level failure handling">
        <PreviewPanel>
          <ErrorFallback
            title={retried() ? 'Still failing' : 'Something went wrong'}
            description="An unexpected error occurred while loading this page."
            retryLabel="Try again"
            onRetry={() => setRetried(true)}
          />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="Toast" subtitle="Global notifications from any action">
        <PreviewPanel>
          <div class="row">
            <Button
              variant="primary"
              onClick={() =>
                addToast({
                  type: 'success',
                  message: 'Changes saved successfully!',
                })
              }
            >
              Success toast
            </Button>
            <Button variant="danger" onClick={() => addToast({ type: 'error', message: 'Something went wrong.' })}>
              Error toast
            </Button>
            <Button variant="ghost" onClick={() => addToast({ type: 'info', message: 'New version available.' })}>
              Info toast
            </Button>
            <Button
              variant="dashed"
              onClick={() =>
                addToast({
                  type: 'warning',
                  message: 'Disk space running low.',
                })
              }
            >
              Warning toast
            </Button>
          </div>
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default FeedbackSection;
