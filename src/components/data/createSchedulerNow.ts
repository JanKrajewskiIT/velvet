import { createSignal, onSettled } from 'solid-js';

const NOW_TICK_MS = 60_000;

export const createSchedulerNow = () => {
  const [now, setNow] = createSignal(new Date());
  onSettled(() => {
    const timer = setInterval(() => setNow(new Date()), NOW_TICK_MS);
    return () => clearInterval(timer);
  });
  return now;
};
