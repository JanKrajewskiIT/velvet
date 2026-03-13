import { createContext, createEffect, createSignal, onCleanup, type ParentProps, untrack, useContext } from 'solid-js';

export type ThemeChoice = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

interface ThemeContextValue {
  theme: () => ThemeChoice;
  resolved: () => ResolvedTheme;
  setTheme: (value: ThemeChoice) => void;
  toggleTheme: () => void;
}

const DEFAULT_STORAGE_KEY = 'velvet-theme';

const ThemeContext = createContext<ThemeContextValue>();

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(key: string): ThemeChoice {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(key);
  if (stored === 'light' || stored === 'dark' || stored === 'system') {
    return stored;
  }
  return 'system';
}

function resolveTheme(choice: ThemeChoice, system: ResolvedTheme): ResolvedTheme {
  return choice === 'system' ? system : (choice as ResolvedTheme);
}

function applyTheme(resolved: ResolvedTheme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', resolved);
  }
}

interface ThemeProviderProps extends ParentProps {
  storageKey?: string;
}

const ThemeProvider = (props: ThemeProviderProps) => {
  const storageKey = () => props.storageKey ?? DEFAULT_STORAGE_KEY;
  const initialTheme = getStoredTheme(untrack(() => props.storageKey) ?? DEFAULT_STORAGE_KEY);
  const initialSystem = getSystemTheme();

  const [theme, setTheme] = createSignal<ThemeChoice>(initialTheme);
  const [systemTheme, setSystemTheme] = createSignal<ResolvedTheme>(initialSystem);

  const resolved = (): ResolvedTheme => resolveTheme(theme(), systemTheme());

  applyTheme(resolveTheme(initialTheme, initialSystem));

  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    onCleanup(() => {
      mediaQuery.removeEventListener('change', handleChange);
    });
  }

  createEffect(() => {
    const current = theme();
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey(), current);
    }
    applyTheme(resolved());
  });

  if (typeof window !== 'undefined') {
    requestAnimationFrame(() => {
      document.body.classList.add('transitionsReady');
    });
  }

  const toggleTheme = () => {
    const current = resolved();
    setTheme(current === 'light' ? 'dark' : 'light');
  };

  const changeTheme = (value: ThemeChoice): void => {
    setTheme(value);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme: changeTheme, toggleTheme }}>
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
