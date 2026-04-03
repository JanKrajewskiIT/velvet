import { createContext, useContext } from 'solid-js';

import { createQueryClient, type QueryClient } from '~/query/createQueryClient';

const QueryClientContext = createContext<QueryClient>();

let defaultQueryClient: QueryClient | undefined;

const getDefaultQueryClient = (): QueryClient => {
  if (!defaultQueryClient) {
    defaultQueryClient = createQueryClient();
  }

  return defaultQueryClient;
};

const useQueryClient = (): QueryClient => useContext(QueryClientContext) ?? getDefaultQueryClient();

export { getDefaultQueryClient, QueryClientContext, useQueryClient };
