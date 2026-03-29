import { createContext, useContext } from 'solid-js';

import { createQueryClient, type QueryClient } from '~/query/createQueryClient';

const QueryClientContext = createContext<QueryClient>();

let defaultQueryClient: QueryClient | undefined;

function getDefaultQueryClient(): QueryClient {
  if (!defaultQueryClient) {
    defaultQueryClient = createQueryClient();
  }

  return defaultQueryClient;
}

function useQueryClient(): QueryClient {
  const context = useContext(QueryClientContext);
  if (context) {
    return context;
  }

  return getDefaultQueryClient();
}

export { getDefaultQueryClient, QueryClientContext, useQueryClient };
