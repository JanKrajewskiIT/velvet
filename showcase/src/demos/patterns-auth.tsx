import { createSignal } from 'solid-js';
import { AuthGuard, Surface, Text, ToggleButton } from '../../../src';
import { Example } from '../Example';
import type { DemoEntry } from '../registry';

const AuthGuardDemo = () => {
  const [loading, setLoading] = createSignal(false);
  const [authenticated, setAuthenticated] = createSignal(true);
  const [authorized, setAuthorized] = createSignal(true);
  const [signedInCount, setSignedInCount] = createSignal(0);

  return (
    <Example
      title="Session states"
      stack
      code={'<AuthGuard authenticated={signedIn()} authorized={isAdmin()} onSignIn={signIn}>…</AuthGuard>'}
    >
      <div style={{ display: 'flex', gap: 'var(--space-2)', 'flex-wrap': 'wrap' }}>
        <ToggleButton pressed={loading()} onPressedChange={setLoading}>
          Loading
        </ToggleButton>
        <ToggleButton pressed={authenticated()} onPressedChange={setAuthenticated}>
          Signed in
        </ToggleButton>
        <ToggleButton pressed={authorized()} onPressedChange={setAuthorized}>
          Authorized
        </ToggleButton>
      </div>
      <Surface variant="raised" padding="md" style={{ width: '100%' }}>
        <AuthGuard
          loading={loading()}
          authenticated={authenticated()}
          authorized={authorized()}
          onSignIn={() => {
            setSignedInCount(signedInCount() + 1);
            setAuthenticated(true);
          }}
          onGoHome={() => setAuthorized(true)}
        >
          <Text>Protected content. Sign-in prompts so far: {signedInCount()}.</Text>
        </AuthGuard>
      </Surface>
    </Example>
  );
};

export const patternsAuthDemos: DemoEntry[] = [
  {
    id: 'auth-guard',
    group: '28 Patterns',
    title: 'AuthGuard',
    description:
      'Renders its children only for a signed-in, authorized user; otherwise a loader, a sign-in prompt or a forbidden page. Auth state comes from props.',
    render: () => <AuthGuardDemo />,
  },
];
