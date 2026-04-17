import { createContext, useContext } from 'solid-js';

import { getVelvetRuntimeConfig } from '~/providers/velvet-config';
import { createQueryClient, type QueryClient } from '~/query/createQueryClient';

const QueryClientContext = createContext<QueryClient>();

let defaultQueryClient: QueryClient | undefined;

const getDefaultQueryClient = (): QueryClient => {
  if (!defaultQueryClient) {
    const config = getVelvetRuntimeConfig();
    defaultQueryClient = createQueryClient(config.queryClientOptions);
  }

  return defaultQueryClient;
};

const useQueryClient = (): QueryClient => useContext(QueryClientContext) ?? getDefaultQueryClient();

export { getDefaultQueryClient, QueryClientContext, useQueryClient };
