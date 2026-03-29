import { type ParentProps, splitProps, untrack } from 'solid-js';

import { createQueryClient, type QueryClient } from '~/query/createQueryClient';
import { QueryClientContext } from '~/query/queryClientContext';
import type { CreateQueryClientOptions } from '~/query/types';

interface QueryClientProviderProps extends ParentProps {
  client?: QueryClient;
  options?: CreateQueryClientOptions;
}

const QueryClientProvider = (props: QueryClientProviderProps) => {
  const [local] = splitProps(props, ['client', 'options', 'children']);
  const client = untrack(() => local.client) ?? createQueryClient(untrack(() => local.options));

  return <QueryClientContext.Provider value={client}>{local.children}</QueryClientContext.Provider>;
};

export type { QueryClientProviderProps };
export { QueryClientProvider };
