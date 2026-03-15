import {
  AccessDenied,
  addToast,
  Alert,
  Badge,
  Banner,
  Button,
  Chip,
  CircularProgress,
  CodeText,
  Countdown,
  EmptyState,
  ErrorFallback,
  ErrorMessage,
  IconButton,
  Kbd,
  LoadingContainer,
  NotificationCenter,
  Progress,
  Skeleton,
  Spinner,
  StatCard,
  TagChip,
} from '@jankrajewskiit/ui';
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoFolder,
  IoMail,
  IoNotifications,
  IoPeople,
  IoSearch,
  IoStatsChart,
} from 'solid-icons/io';
import { createSignal, Show } from 'solid-js';

import type { SectionId } from '../App';
import { PreviewGroup, PreviewPanel, ShowcaseMeta, ShowcaseSection } from '../components/ShowcaseSection';

const FeedbackSection = (props: { sectionId: SectionId }) => {
  const sectionId = () => props.sectionId;
  const [retried, setRetried] = createSignal(false);
  const [bannerVisible, setBannerVisible] = createSignal(true);

  return (
    <div>
      <Show when={sectionId() === 'feedback-badges-chips'}>
        <ShowcaseSection title="Badge" subtitle="Notification indicators on elements">
          <PreviewPanel>
            <PreviewGroup title="Primary samples">
              <div class="row">
                <Badge content={5}>
                  <IconButton icon={<IoNotifications />} title="Notifications" />
                </Badge>
                <Badge content={99} max={99}>
                  <Button variant="primary">Messages</Button>
                </Badge>
                <Badge dot>
                  <IconButton icon={<IoMail />} title="Mail" />
                </Badge>
              </div>
            </PreviewGroup>
            <PreviewGroup title="Semantic variants">
              <div class="row">
                <Badge variant="info" content={3}>
                  <Button variant="ghost">Info</Button>
                </Badge>
                <Badge variant="success" content="OK">
                  <Button variant="ghost">Status</Button>
                </Badge>
                <Badge variant="error" content={12}>
                  <Button variant="ghost">Errors</Button>
                </Badge>
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Chip variants" subtitle="Status, selection and clickable chips">
          <PreviewPanel>
            <PreviewGroup title="Color variants">
              <div class="row">
                <Chip variant="primary">Primary</Chip>
                <Chip variant="primaryOutline">Outline</Chip>
                <Chip variant="info">Info</Chip>
                <Chip variant="success">Success</Chip>
                <Chip variant="warning">Warning</Chip>
                <Chip variant="error">Error</Chip>
                <Chip variant="subtle">Subtle</Chip>
              </div>
            </PreviewGroup>
            <PreviewGroup title="Interaction states">
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
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="TagChip" subtitle="Color-coded tags with optional selection">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="row">
                <TagChip label="design" color="#1467ff" />
                <TagChip label="frontend" color="#0288d1" />
                <TagChip label="selected" color="#2e7d32" selected />
                <TagChip label="clickable" color="#ed6c02" onClick={() => {}} />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="StatCard" subtitle="Compact KPI cards">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="gridCards">
                <StatCard value="1 284" label="Active users" icon={<IoPeople />} colorClass="info" />
                <StatCard value="98.7%" label="Uptime" icon={<IoCheckmarkCircle />} colorClass="success" />
                <StatCard value="3" label="Open issues" icon={<IoAlertCircle />} colorClass="warning" />
                <StatCard value="42" label="Deployments" icon={<IoStatsChart />} colorClass="error" />
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            <CodeText as="span" class="codeInline">
              StatCard
            </CodeText>{' '}
            for dashboards and metric summaries.
          </ShowcaseMeta>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'feedback-progress'}>
        <ShowcaseSection title="Progress" subtitle="Determinate and indeterminate progress bars">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Progress value={75} variant="primary" label="Uploading" showValue />
              <Progress value={45} variant="success" size="sm" />
              <Progress value={90} variant="warning" size="lg" showValue />
              <Progress variant="info" label="Loading..." />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="CircularProgress" subtitle="SVG circular progress indicator">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="row">
                <CircularProgress value={75} showValue variant="primary" label="Primary 75%" />
                <CircularProgress value={50} showValue variant="success" label="Success 50%" />
                <CircularProgress value={25} showValue variant="warning" label="Warning 25%" />
                <CircularProgress value={90} showValue variant="error" label="Error 90%" />
              </div>
              <div class="row">
                <CircularProgress value={60} size="sm" showValue label="Small" />
                <CircularProgress value={60} size="md" showValue label="Medium" />
                <CircularProgress value={60} size="lg" showValue label="Large" />
                <CircularProgress label="Indeterminate" />
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Determinate with{' '}
            <CodeText as="span" class="codeInline">
              value
            </CodeText>{' '}
            or indeterminate without. Supports size and variant props.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Countdown" subtitle="Animated countdown timer">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="row">
                <Countdown seconds={90} format="mm:ss" size="lg" />
                <Countdown seconds={3600} format="hh:mm:ss" />
                <Countdown seconds={15} format="ss" size="sm" />
              </div>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Spinner" subtitle="Progress indicators in multiple sizes">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="row">
                <Spinner size="sm" label="Small spinner" />
                <Spinner size="md" label="Medium spinner" />
                <Spinner size="lg" label="Large spinner" />
              </div>
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>Spinners inherit brand colors and support reduced-motion preferences.</ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Skeleton" subtitle="Loading placeholders with multiple variants">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <div class="row">
                <Skeleton variant="circular" width={48} height={48} />
                <div class="col flex1">
                  <Skeleton variant="text" width="60%" height={16} />
                  <Skeleton variant="text" width="90%" height={14} />
                  <Skeleton variant="text" width="40%" height={14} />
                </div>
              </div>
              <Skeleton variant="rectangular" height={120} animation="pulse" />
              <Skeleton variant="text" width="80%" animation="none" />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="LoadingContainer" subtitle="Centered loading states for container surfaces">
          <PreviewPanel>
            <PreviewGroup title="Examples">
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
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'feedback-alerts'}>
        <ShowcaseSection title="Alert" subtitle="Contextual status messages">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Alert variant="info" title="Information">
                Your account has been updated.
              </Alert>
              <Alert variant="success" title="Success">
                File uploaded successfully.
              </Alert>
              <Alert variant="warning" onClose={() => {}}>
                Disk space is running low.
              </Alert>
              <Alert variant="error" title="Error">
                Failed to save changes.
              </Alert>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Banner" subtitle="Full-width status strip">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Banner
                variant="primary"
                action={
                  <Button variant="ghost" class="bannerActionInverse">
                    Update now
                  </Button>
                }
              >
                New version available!
              </Banner>
              {bannerVisible() && (
                <Banner variant="warning" onClose={() => setBannerVisible(false)}>
                  Scheduled maintenance tonight.
                </Banner>
              )}
              <Banner variant="error">Service degraded in EU region.</Banner>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="ErrorMessage" subtitle="Inline error alerts">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <ErrorMessage>Failed to load data. Please try again.</ErrorMessage>
              <ErrorMessage>Network error: connection timed out.</ErrorMessage>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="Toast" subtitle="Global notifications from any action">
          <PreviewPanel>
            <PreviewGroup title="Examples">
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
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Wrap your app in{' '}
            <CodeText as="span" class="codeInline">
              ToastProvider
            </CodeText>{' '}
            and render{' '}
            <CodeText as="span" class="codeInline">
              ToastViewport
            </CodeText>{' '}
            (e.g. in root layout) for toasts to appear.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="NotificationCenter" subtitle="Persistent history powered by toast events">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <NotificationCenter maxItems={6} />
            </PreviewGroup>
          </PreviewPanel>
          <ShowcaseMeta>
            Trigger toasts above to see them collected here. Use actions to mark as read or clear history.
          </ShowcaseMeta>
        </ShowcaseSection>

        <ShowcaseSection title="Alert variants" subtitle="Highlighted content blocks for tips, warnings and notes">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <Alert variant="info" title="Information">
                Use design tokens for consistent styling.
              </Alert>
              <Alert variant="success" title="Success">
                Your changes have been saved.
              </Alert>
              <Alert variant="warning">This feature will be deprecated in the next major version.</Alert>
              <Alert variant="danger" title="Breaking change">
                API response format has changed.
              </Alert>
              <Alert variant="tip" title="Tip">
                Use <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to open the command palette.
              </Alert>
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>

      <Show when={sectionId() === 'feedback-states'}>
        <ShowcaseSection title="ErrorFallback" subtitle="Page-level failure handling">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <ErrorFallback
                title={retried() ? 'Still failing' : 'Something went wrong'}
                description="An unexpected error occurred while loading this page."
                retryLabel="Try again"
                onRetry={() => setRetried(true)}
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="EmptyState" subtitle="Friendly zero-state messaging">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <EmptyState
                icon={<IoSearch size={40} />}
                message="No results found"
                hint="Try adjusting your search query or filters."
              />
              <EmptyState icon={<IoFolder size={40} />} message="This folder is empty" />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>

        <ShowcaseSection title="AccessDenied" subtitle="Full-page permission denied screen">
          <PreviewPanel>
            <PreviewGroup title="Examples">
              <AccessDenied
                title="Access denied"
                description="You do not have permission to view this page."
                goHomeLabel="Go to homepage"
              />
            </PreviewGroup>
          </PreviewPanel>
        </ShowcaseSection>
      </Show>
    </div>
  );
};

export default FeedbackSection;
