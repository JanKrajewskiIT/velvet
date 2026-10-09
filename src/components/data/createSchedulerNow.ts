import { createSignal, onCleanup, onMount } from 'solid-js';

const NOW_TICK_MS = 60_000;

export const createSchedulerNow = () => {
  const [now, setNow] = createSignal(new Date());
  onMount(() => {
    const timer = setInterval(() => setNow(new Date()), NOW_TICK_MS);
    onCleanup(() => clearInterval(timer));
  });
  return now;
};
