import {
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  type ParentProps,
  useContext,
} from 'solid-js';

export type ThemeChoice = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: () => ThemeChoice;
  resolved: () => ResolvedTheme;
  setTheme: (value: ThemeChoice) => void;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'velvet-theme';

const ThemeContext = createContext<ThemeContextValue>();

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function getStoredTheme(): ThemeChoice {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.setAttribute('data-theme', resolved);
}

const ThemeProvider = (props: ParentProps) => {
  const [theme, setTheme] = createSignal<ThemeChoice>(getStoredTheme());
  const [systemTheme, setSystemTheme] =
    createSignal<ResolvedTheme>(getSystemTheme());

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleChange = (e: MediaQueryListEvent) => {
    setSystemTheme(e.matches ? 'dark' : 'light');
  };
  mediaQuery.addEventListener('change', handleChange);
  onCleanup(() => {
    mediaQuery.removeEventListener('change', handleChange);
  });

  const resolved = (): ResolvedTheme =>
    theme() === 'system' ? systemTheme() : (theme() as ResolvedTheme);

  createEffect(() => {
    const current = theme();
    localStorage.setItem(STORAGE_KEY, current);
    applyTheme(resolved());
  });

  requestAnimationFrame(() => {
    document.body.classList.add('transitions-ready');
  });

  const toggleTheme = () => {
    const current = resolved();
    setTheme(current === 'light' ? 'dark' : 'light');
  };

  const changeTheme = (value: ThemeChoice): void => {
    setTheme(value);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, resolved, setTheme: changeTheme, toggleTheme }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};

export { ThemeProvider };

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
