import {
  EmptyState,
  ErrorFallback,
  ErrorMessage,
  LoadingContainer,
} from '@jankrajewskiit/ui';
import { IoFolder, IoSearch } from 'solid-icons/io';
import { createSignal } from 'solid-js';

const StatesSection = () => {
  const [retried, setRetried] = createSignal(false);

  return (
    <div>
      <div class="section">
        <h2 class="sectionTitle">LoadingContainer</h2>
        <div class="previewBox">
          <div class="row">
            <div
              style={{
                position: 'relative',
                height: '80px',
                width: '120px',
                border: '1px solid var(--color-border)',
                'border-radius': 'var(--radius-md)',
              }}
            >
              <LoadingContainer size="sm" />
            </div>
            <div
              style={{
                position: 'relative',
                height: '100px',
                width: '160px',
                border: '1px solid var(--color-border)',
                'border-radius': 'var(--radius-md)',
              }}
            >
              <LoadingContainer size="md" />
            </div>
            <div
              style={{
                position: 'relative',
                height: '120px',
                width: '200px',
                border: '1px solid var(--color-border)',
                'border-radius': 'var(--radius-md)',
              }}
            >
              <LoadingContainer size="lg" />
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">EmptyState</h2>
        <div class="previewBox col">
          <EmptyState
            icon={<IoSearch size={40} />}
            message="No results found"
            hint="Try adjusting your search query or filters."
          />
          <EmptyState
            icon={<IoFolder size={40} />}
            message="This folder is empty"
          />
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">ErrorMessage</h2>
        <div class="previewBox col">
          <ErrorMessage message="Failed to load data. Please try again." />
          <ErrorMessage message="Network error: connection timed out." />
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">ErrorFallback</h2>
        <div class="previewBox">
          <ErrorFallback
            title={retried() ? 'Still failing' : 'Something went wrong'}
            description="An unexpected error occurred while loading this page."
            retryLabel="Try again"
            onRetry={() => setRetried(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default StatesSection;
