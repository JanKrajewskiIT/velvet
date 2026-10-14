import { type Accessor, createSignal, getOwner, onCleanup, onMount } from 'solid-js';

import { addDays, startOfDay } from '../utils/date';

export const createToday = (): Accessor<Date> => {
  if (!getOwner()) throw new Error('createToday requires a Solid owner.');
  const [today, setToday] = createSignal(startOfDay(new Date()), {
    equals: (previous, next) => previous.getTime() === next.getTime(),
  });
  onMount(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      clearTimeout(timer);
      const now = new Date();
      const day = startOfDay(now);
      setToday(day);
      timer = setTimeout(refresh, Math.max(1, addDays(day, 1).getTime() - now.getTime()));
    };
    refresh();
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    onCleanup(() => {
      clearTimeout(timer);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    });
  });
  return today;
};
