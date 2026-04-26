import { type Accessor, createMemo } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type { I18nMessageKey } from '~/i18n/registry';
import type { DivCoreNativeProps } from '~/models/Props';

interface LoaderMessages {
  loading?: string;
}

interface LoaderBaseProps extends DivCoreNativeProps {
  label?: string;
  messages?: LoaderMessages;
  children?: never;
}

interface UseLoaderA11yOptions {
  ariaHidden?: Accessor<string | undefined>;
  ariaLabel?: Accessor<string | undefined>;
  label?: Accessor<string | undefined>;
  messages?: Accessor<LoaderMessages | undefined>;
  role?: Accessor<DivCoreNativeProps['role'] | undefined>;
  translationKey: I18nMessageKey;
}

const useLoaderA11y = (options: UseLoaderA11yOptions) => {
  const { ts } = useI18n();

  const resolvedLabel = createMemo(
    () => options.label?.() ?? options.messages?.()?.loading ?? ts(options.translationKey),
  );
  const isAriaHidden = createMemo(() => options.ariaHidden?.() === 'true');
  const role = createMemo(() => (isAriaHidden() ? options.role?.() : (options.role?.() ?? 'status')));
  const ariaLabel = createMemo(() =>
    isAriaHidden() ? options.ariaLabel?.() : (options.ariaLabel?.() ?? resolvedLabel()),
  );

  return {
    ariaLabel,
    isAriaHidden,
    resolvedLabel,
    role,
  };
};

export type { LoaderBaseProps, LoaderMessages };
export default useLoaderA11y;
