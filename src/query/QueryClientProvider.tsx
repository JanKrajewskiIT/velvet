import { createContext, type ParentProps, splitProps, untrack, useContext } from 'solid-js';

import { createQueryClient, type QueryClient } from '~/query/createQueryClient';
import type { CreateQueryClientOptions } from '~/query/types';

interface QueryClientProviderProps extends ParentProps {
  client?: QueryClient;
  options?: CreateQueryClientOptions;
}

const QueryClientContext = createContext<QueryClient>();

let defaultQueryClient: QueryClient | undefined;

function getDefaultQueryClient(): QueryClient {
  if (!defaultQueryClient) {
    defaultQueryClient = createQueryClient();
  }

  return defaultQueryClient;
}

const QueryClientProvider = (props: QueryClientProviderProps) => {
  const [local] = splitProps(props, ['client', 'options', 'children']);
  const client = untrack(() => local.client) ?? createQueryClient(untrack(() => local.options));

  return <QueryClientContext.Provider value={client}>{local.children}</QueryClientContext.Provider>;
};

export type { QueryClientProviderProps };
export { getDefaultQueryClient, QueryClientProvider };

export function useQueryClient(): QueryClient {
  const context = useContext(QueryClientContext);
  if (context) {
    return context;
  }

  return getDefaultQueryClient();
}
