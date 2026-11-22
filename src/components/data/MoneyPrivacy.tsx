import { type JSX } from '@solidjs/web';

import { MoneyPrivacyContext } from './moneyPrivacyContext';

export interface MoneyPrivacyProps {
  hidden?: boolean;
  children?: JSX.Element;
}

export const MoneyPrivacy = (props: MoneyPrivacyProps) => {
  const hidden = () => !!props.hidden;
  return <MoneyPrivacyContext value={hidden}>{props.children}</MoneyPrivacyContext>;
};
