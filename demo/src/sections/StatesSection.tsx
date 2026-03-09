import {
  EmptyState,
  ErrorFallback,
  ErrorMessage,
  LoadingContainer,
} from '@jankrajewskiit/ui';
import { IoFolder, IoSearch } from 'solid-icons/io';
import { createSignal } from 'solid-js';

import { PreviewPanel, ShowcaseSection } from '../components/ShowcaseSection';

const StatesSection = () => {
  const [retried, setRetried] = createSignal(false);

  return (
    <div>
      <ShowcaseSection
        title="LoadingContainer"
        subtitle="Centered loading states for container surfaces"
      >
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

      <ShowcaseSection
        title="EmptyState"
        subtitle="Friendly zero-state messaging"
      >
        <PreviewPanel class="col">
          <EmptyState
            icon={<IoSearch size={40} />}
            message="No results found"
            hint="Try adjusting your search query or filters."
          />
          <EmptyState
            icon={<IoFolder size={40} />}
            message="This folder is empty"
          />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection title="ErrorMessage" subtitle="Inline error alerts">
        <PreviewPanel class="col">
          <ErrorMessage>Failed to load data. Please try again.</ErrorMessage>
          <ErrorMessage>Network error: connection timed out.</ErrorMessage>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="ErrorFallback"
        subtitle="Page-level failure handling"
      >
        <PreviewPanel>
          <ErrorFallback
            title={retried() ? 'Still failing' : 'Something went wrong'}
            description="An unexpected error occurred while loading this page."
            retryLabel="Try again"
            onRetry={() => setRetried(true)}
          />
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default StatesSection;
