import { type Accessor, createMemo } from 'solid-js';

import { useI18n } from '~/i18n/I18nProvider';
import type { VelvetI18nKey } from '~/i18n/types';
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
  translationKey: VelvetI18nKey;
}

const useLoaderA11y = (options: UseLoaderA11yOptions) => {
  const { t } = useI18n();

  const resolvedLabel = createMemo(
    () => options.label?.() ?? options.messages?.()?.loading ?? t(options.translationKey),
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
