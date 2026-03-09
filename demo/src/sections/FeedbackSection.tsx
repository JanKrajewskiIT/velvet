import {
  addToast,
  Button,
  Chip,
  Skeleton,
  StatCard,
  TagChip,
} from '@jankrajewskiit/ui';
import {
  IoAlertCircle,
  IoCheckmarkCircle,
  IoPeople,
  IoStatsChart,
} from 'solid-icons/io';

const FeedbackSection = () => {
  return (
    <div>
      <div class="section">
        <h2 class="sectionTitle">Chip - variants</h2>
        <div class="previewBox">
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
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">TagChip</h2>
        <div class="previewBox">
          <div class="row">
            <TagChip label="design" color="#8b0036" />
            <TagChip label="frontend" color="#0288d1" />
            <TagChip label="selected" color="#2e7d32" selected />
            <TagChip label="clickable" color="#ed6c02" onClick={() => {}} />
          </div>
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">StatCard</h2>
        <div class="gridCards">
          <StatCard
            value="1 284"
            label="Active users"
            icon={<IoPeople />}
            colorClass="info"
          />
          <StatCard
            value="98.7%"
            label="Uptime"
            icon={<IoCheckmarkCircle />}
            colorClass="success"
          />
          <StatCard
            value="3"
            label="Open issues"
            icon={<IoAlertCircle />}
            colorClass="warning"
          />
          <StatCard
            value="42"
            label="Deployments"
            icon={<IoStatsChart />}
            colorClass="error"
          />
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">Skeleton</h2>
        <div class="previewBox col">
          <div
            class="row"
            style={{ 'align-items': 'center', gap: 'var(--spacing-md)' }}
          >
            <Skeleton variant="circular" width={48} height={48} />
            <div class="col" style={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={16} />
              <Skeleton variant="text" width="90%" height={14} />
              <Skeleton variant="text" width="40%" height={14} />
            </div>
          </div>
          <Skeleton variant="rectangular" height={120} animation="pulse" />
          <Skeleton variant="text" width="80%" animation="none" />
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">Toast</h2>
        <div class="previewBox">
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
            <Button
              variant="danger"
              onClick={() =>
                addToast({ type: 'error', message: 'Something went wrong.' })
              }
            >
              Error toast
            </Button>
            <Button
              variant="ghost"
              onClick={() =>
                addToast({ type: 'info', message: 'New version available.' })
              }
            >
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
        </div>
      </div>
    </div>
  );
};

export default FeedbackSection;
