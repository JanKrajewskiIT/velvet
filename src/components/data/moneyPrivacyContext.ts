import { type Accessor, createContext, useContext } from 'solid-js';

export const MoneyPrivacyContext = createContext<Accessor<boolean>>(() => false);

/** Reactive accessor; read it in JSX or an effect to follow privacy changes. */
export const useMoneyHidden = (): Accessor<boolean> => useContext(MoneyPrivacyContext);
