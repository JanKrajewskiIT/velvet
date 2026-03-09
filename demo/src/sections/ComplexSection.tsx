import {
  addToast,
  FileDropZone,
  FlipCard,
  FormField,
  Input,
  Wizard,
} from '@jankrajewskiit/ui';
import { IoDocument } from 'solid-icons/io';
import { createSignal } from 'solid-js';

const ComplexSection = () => {
  const [droppedFile, setDroppedFile] = createSignal<string | null>(null);

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
        <p
          style={{
            color: 'var(--color-text-muted)',
            margin: 0,
            'line-height': '1.6',
          }}
        >
          Review your information and click <strong>Finish</strong> to complete
          registration.
        </p>
      ),
    },
  ];

  return (
    <div>
      <div class="section">
        <h2 class="sectionTitle">Wizard</h2>
        <div class="previewBox">
          <Wizard
            steps={wizardSteps}
            backLabel="Back"
            nextLabel="Next"
            finishLabel="Finish"
            onFinish={() => {
              addToast({ type: 'success', message: 'Registration complete!' });
            }}
          />
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">FileDropZone</h2>
        <div class="previewBox col">
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
            <p
              style={{
                margin: 0,
                'font-size': 'var(--font-size-sm)',
                color: 'var(--color-text-muted)',
              }}
            >
              Selected: <strong>{droppedFile()}</strong>
            </p>
          )}
        </div>
      </div>

      <div class="section">
        <h2 class="sectionTitle">FlipCard</h2>
        <div class="previewBox">
          <div class="row">
            <FlipCard
              width="220px"
              height="140px"
              front={
                <div
                  style={{
                    display: 'flex',
                    'flex-direction': 'column',
                    'align-items': 'center',
                    'justify-content': 'center',
                    height: '100%',
                    gap: 'var(--spacing-xs)',
                  }}
                >
                  <strong
                    style={{
                      'font-size': 'var(--font-size-lg)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    VelvetUI
                  </strong>
                  <span
                    style={{
                      'font-size': 'var(--font-size-sm)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    Click to flip
                  </span>
                </div>
              }
              back={
                <div
                  style={{
                    display: 'flex',
                    'flex-direction': 'column',
                    'align-items': 'center',
                    'justify-content': 'center',
                    height: '100%',
                    gap: 'var(--spacing-xs)',
                  }}
                >
                  <strong style={{ color: 'var(--color-text-inverse)' }}>
                    SolidJS + Vite
                  </strong>
                  <span
                    style={{
                      'font-size': 'var(--font-size-sm)',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    TypeScript · CSS Modules
                  </span>
                </div>
              }
            />
            <FlipCard
              width="220px"
              height="140px"
              front={
                <div
                  style={{
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    height: '100%',
                  }}
                >
                  <span style={{ 'font-size': 'var(--font-size-2xl)' }}>
                    🎨
                  </span>
                </div>
              }
              back={
                <div
                  style={{
                    display: 'flex',
                    'align-items': 'center',
                    'justify-content': 'center',
                    height: '100%',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--color-text-inverse)',
                      'font-size': 'var(--font-size-sm)',
                    }}
                  >
                    Dark &amp; Light theme
                  </span>
                </div>
              }
            />
          </div>
          <p
            style={{
              margin: 'var(--spacing-xs) 0 0',
              'font-size': 'var(--font-size-xs)',
              color: 'var(--color-text-muted)',
            }}
          >
            Click a card to flip it
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComplexSection;
