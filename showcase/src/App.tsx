import { createMemo, createSignal, For, onCleanup, onMount, Show } from 'solid-js';
import { initTheme, SkipLink, Text, ThemeToggle, ToggleButton } from '../../src';
import { DEMOS } from './demos';
import { GROUPS } from './registry';

const idFromHash = () => decodeURIComponent(location.hash.replace(/^#\/?/, ''));
const POPULATED_GROUPS = GROUPS.filter((group) => DEMOS.some((demo) => demo.group === group));

export const App = () => {
  const [hash, setHash] = createSignal(idFromHash());
  const [compact, setCompact] = createSignal(false);
  const current = createMemo(() => DEMOS.find((d) => d.id === hash()) ?? DEMOS[0]);
  const currentId = () => current()?.id;

  onMount(() => {
    const onHashChange = () => setHash(idFromHash());
    addEventListener('hashchange', onHashChange);
    onCleanup(() => removeEventListener('hashchange', onHashChange));
    onCleanup(initTheme());
  });

  const setDensity = (on: boolean) => {
    setCompact(on);
    if (on) document.documentElement.dataset.density = 'compact';
    else delete document.documentElement.dataset.density;
  };

  return (
    <div class="sc-shell">
      <SkipLink href="#main" />
      <nav class="sc-nav" aria-label="Components">
        <Text variant="title" as="p">
          Velvet UI
        </Text>
        <For each={POPULATED_GROUPS}>
          {(group) => (
            <div class="sc-nav__group">
              <Text variant="overline">{group}</Text>
              <For each={DEMOS.filter((d) => d.group === group)}>
                {(demo) => (
                  <a
                    class="sc-nav__link"
                    href={`#/${demo.id}`}
                    aria-current={demo.id === currentId() ? 'page' : undefined}
                  >
                    {demo.title}
                  </a>
                )}
              </For>
            </div>
          )}
        </For>
      </nav>
      <main id="main" class="sc-main">
        <div class="sc-bar">
          <Text variant="overline">{current()?.group}</Text>
          <div class="sc-bar__tools">
            <ToggleButton pressed={compact()} onPressedChange={setDensity} icon="sliders">
              Compact
            </ToggleButton>
            <ThemeToggle appearance="segmented" size="sm" />
          </div>
        </div>
        <Show when={current()} keyed>
          {(demo) => (
            <>
              <header class="sc-head">
                <Text variant="h1">{demo.title}</Text>
                <Text variant="body-lg" tone="secondary">
                  {demo.description}
                </Text>
              </header>
              {demo.render()}
            </>
          )}
        </Show>
      </main>
    </div>
  );
};
