import type { JSX } from 'solid-js';

import { MoneyPrivacyContext } from './moneyPrivacyContext';

export interface MoneyPrivacyProps {
  hidden?: boolean;
  children?: JSX.Element;
}

export const MoneyPrivacy = (props: MoneyPrivacyProps) => {
  const hidden = () => !!props.hidden;
  return <MoneyPrivacyContext.Provider value={hidden}>{props.children}</MoneyPrivacyContext.Provider>;
};
