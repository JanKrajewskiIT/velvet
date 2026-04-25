import { createContext, type ParentProps, useContext } from 'solid-js';

import type { DataDisplayDemoModel } from './dataDisplayTypes';

const DataDisplayDemoContext = createContext<DataDisplayDemoModel>();

export const DataDisplayDemoProvider = (props: ParentProps<{ value: DataDisplayDemoModel }>) => (
  // eslint-disable-next-line solid/reactivity -- context value is intentionally static
  <DataDisplayDemoContext.Provider value={props.value}>{props.children}</DataDisplayDemoContext.Provider>
);

export const useDataDisplayDemo = (): DataDisplayDemoModel => {
  const ctx = useContext(DataDisplayDemoContext);
  if (!ctx) {
    throw new Error('useDataDisplayDemo must be used within DataDisplayDemoProvider');
  }
  return ctx;
};
