import {
  AuthRedirect,
  Button,
  ConfirmAction,
  EditableCollection,
  FormField,
  IconButton,
  Input,
  RequireAuth,
  Select,
} from '@jankrajewskiit/ui';
import { IoTrash } from 'solid-icons/io';
import { createSignal, Show } from 'solid-js';

import {
  PreviewPanel,
  ShowcaseMeta,
  ShowcaseSection,
} from '../components/ShowcaseSection';

type DemoRole = 'viewer' | 'editor' | 'admin';

interface TaskItem {
  id: string;
  title: string;
  owner: string;
}

const createTask = (index: number): TaskItem => ({
  id: crypto.randomUUID(),
  title: `Task ${index}`,
  owner: 'Product Team',
});

const NewComponentsSection = () => {
  const [confirmRuns, setConfirmRuns] = createSignal(0);
  const [redirectLog, setRedirectLog] = createSignal('No redirects yet.');
  const [redirectRun, setRedirectRun] = createSignal(0);

  const [tasks, setTasks] = createSignal<TaskItem[]>([
    createTask(1),
    createTask(2),
  ]);

  const [isLoading, setIsLoading] = createSignal(false);
  const [isAuthenticated, setIsAuthenticated] = createSignal(true);
  const [role, setRole] = createSignal<DemoRole>('viewer');

  const updateTask = (id: string, field: keyof TaskItem, value: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, [field]: value } : task
      )
    );
  };

  const triggerRedirect = () => {
    setRedirectRun((current) => current + 1);
  };

  return (
    <div>
      <ShowcaseSection
        title="ConfirmAction"
        subtitle="Headless confirmation flow wrapped around your own trigger"
      >
        <PreviewPanel class="col">
          <ConfirmAction
            title="Run destructive action?"
            message="This demo increments a counter so you can verify the flow."
            confirmLabel="Run"
            cancelLabel="Cancel"
            variant="danger"
            onConfirm={() => {
              setConfirmRuns((current) => current + 1);
            }}
          >
            {({ openConfirm, isConfirmOpen }) => (
              <div class="row">
                <Button variant="danger" onClick={openConfirm}>
                  Open confirmation
                </Button>
                <span class="statusChip">
                  Confirm opened: {isConfirmOpen() ? 'yes' : 'no'}
                </span>
              </div>
            )}
          </ConfirmAction>
          <ShowcaseMeta>
            Confirmed actions:{' '}
            <span class="codeInline">{String(confirmRuns())}</span>
          </ShowcaseMeta>
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="EditableCollection"
        subtitle="Reusable add/remove/edit list scaffold for dynamic forms"
      >
        <PreviewPanel class="col">
          <EditableCollection
            items={tasks()}
            getId={(item) => item.id}
            onAdd={() =>
              setTasks((current) => [
                ...current,
                createTask(current.length + 1),
              ])
            }
            onRemove={(id) =>
              setTasks((current) => current.filter((item) => item.id !== id))
            }
            addLabel="Add task"
            confirmTitle="Remove task"
            confirmMessage="Do you want to remove this task from the collection?"
            confirmLabel="Remove"
            cancelLabel="Cancel"
            renderItem={(item, { requestRemove }) => (
              <>
                <div class="editableHeader">
                  <span class="statusChip">{item.id.slice(0, 8)}</span>
                  <IconButton
                    icon={<IoTrash />}
                    title="Remove task"
                    size="sm"
                    onClick={requestRemove}
                  />
                </div>
                <div class="editableGrid">
                  <FormField label="Title" id={`task-title-${item.id}`}>
                    <Input
                      id={`task-title-${item.id}`}
                      value={item.title}
                      onInput={(e) =>
                        updateTask(item.id, 'title', e.currentTarget.value)
                      }
                    />
                  </FormField>
                  <FormField label="Owner" id={`task-owner-${item.id}`}>
                    <Input
                      id={`task-owner-${item.id}`}
                      value={item.owner}
                      onInput={(e) =>
                        updateTask(item.id, 'owner', e.currentTarget.value)
                      }
                    />
                  </FormField>
                </div>
              </>
            )}
          />
        </PreviewPanel>
      </ShowcaseSection>

      <ShowcaseSection
        title="RequireAuth and AuthRedirect"
        subtitle="App-agnostic authorization gates with redirect helper"
      >
        <PreviewPanel class="col">
          <div class="row">
            <Button
              variant={isAuthenticated() ? 'ghost' : 'primary'}
              onClick={() => setIsAuthenticated((current) => !current)}
            >
              {isAuthenticated() ? 'Set unauthenticated' : 'Set authenticated'}
            </Button>
            <Button
              variant={isLoading() ? 'primary' : 'ghost'}
              onClick={() => setIsLoading((current) => !current)}
            >
              {isLoading() ? 'Loading: ON' : 'Loading: OFF'}
            </Button>
            <FormField label="Role" id="demo-role-select">
              <Select
                id="demo-role-select"
                value={role()}
                onChange={(e) => setRole(e.currentTarget.value as DemoRole)}
              >
                <option value="viewer">viewer</option>
                <option value="editor">editor</option>
                <option value="admin">admin</option>
              </Select>
            </FormField>
          </div>

          <RequireAuth
            isLoading={isLoading()}
            isAuthenticated={isAuthenticated()}
            roles={['admin']}
            hasAnyRole={(...roles) => roles.includes(role())}
            accessDeniedTitle="Admin area"
            accessDeniedDescription="Only users with role admin can see this content."
            accessDeniedGoHomeLabel="Back"
            unauthenticatedFallback={
              <div class="docsCallout">
                User is unauthenticated. In a real app provide redirect logic in
                AuthRedirect or onUnauthenticated callback.
              </div>
            }
          >
            <div class="docsCallout docsCalloutSuccess">
              Protected content visible for <strong>{role()}</strong> role.
            </div>
          </RequireAuth>

          <div class="row">
            <Button variant="ghost" onClick={triggerRedirect}>
              Trigger AuthRedirect demo
            </Button>
            <span class="statusChip">{redirectLog()}</span>
          </div>

          <Show when={redirectRun()} keyed>
            {(runId) => (
              <AuthRedirect
                onRedirect={() => {
                  setRedirectLog(
                    `AuthRedirect onMount #${String(runId)} at ${new Date().toLocaleTimeString()}`
                  );
                }}
                fallback={
                  <p class="mutedText">
                    Running redirect side-effect #{String(runId)}...
                  </p>
                }
              />
            )}
          </Show>
        </PreviewPanel>
      </ShowcaseSection>
    </div>
  );
};

export default NewComponentsSection;
