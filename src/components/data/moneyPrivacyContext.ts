import { type Accessor, createContext, getOwner, useContext } from 'solid-js';

const showMoney = (): boolean => false;
export const MoneyPrivacyContext = createContext<Accessor<boolean>>(showMoney);

/** Reactive accessor; read it in JSX or an effect to follow privacy changes. */
export const useMoneyHidden = (): Accessor<boolean> =>
  getOwner() === null ? showMoney : useContext(MoneyPrivacyContext);
