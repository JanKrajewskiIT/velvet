import type { Accessor } from 'solid-js';
import { createSignal } from 'solid-js';

import { parseDate } from '~/utils/datetime';

import useClickOutside from './useClickOutside';
import useEscapeKey from './useEscapeKey';

interface MonthView {
  year: number;
  month: number;
}

interface UseCalendarPopupStateOptions {
  rootRef: Accessor<HTMLElement | undefined>;
  selectedIso?: Accessor<string | undefined>;
  isDisabled?: Accessor<boolean>;
  onClose?: () => void;
}

const nowMonthView = (): MonthView => {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() };
};

const parseMonthView = (iso?: string): MonthView => {
  if (!iso) return nowMonthView();
  return parseDate(iso);
};

const useCalendarPopupState = (options: UseCalendarPopupStateOptions) => {
  const initial = parseMonthView(options.selectedIso?.());
  const [isOpen, setIsOpen] = createSignal(false);
  const [viewYear, setViewYear] = createSignal(initial.year);
  const [viewMonth, setViewMonth] = createSignal(initial.month);

  const isDisabled = () => options.isDisabled?.() ?? false;

  const setViewFromIso = (iso?: string) => {
    const next = parseMonthView(iso);
    setViewYear(next.year);
    setViewMonth(next.month);
  };

  const close = () => {
    setIsOpen(false);
    options.onClose?.();
  };

  const open = (iso?: string) => {
    if (isDisabled()) return;
    setViewFromIso(iso);
    setIsOpen(true);
  };

  const toggle = (iso?: string) => {
    if (isOpen()) {
      close();
      return;
    }

    open(iso);
  };

  const prevMonth = () => {
    if (viewMonth() === 0) {
      setViewMonth(11);
      setViewYear(viewYear() - 1);
      return;
    }

    setViewMonth(viewMonth() - 1);
  };

  const nextMonth = () => {
    if (viewMonth() === 11) {
      setViewMonth(0);
      setViewYear(viewYear() + 1);
      return;
    }

    setViewMonth(viewMonth() + 1);
  };

  useClickOutside(
    () => options.rootRef(),
    () => isOpen(),
    close,
  );
  useEscapeKey(() => isOpen(), close);

  return {
    isOpen,
    viewYear,
    viewMonth,
    close,
    open,
    toggle,
    prevMonth,
    nextMonth,
  };
};

export default useCalendarPopupState;
