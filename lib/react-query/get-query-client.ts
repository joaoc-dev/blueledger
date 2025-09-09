import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
} from '@tanstack/react-query';

// Create a new QueryClient with custom configuration
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Set stale time to 1 minute
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // Include pending queries in dehydration
        // This ensures that loading states are preserved
        shouldDehydrateQuery: query =>
          defaultShouldDehydrateQuery(query)
          || query.state.status === 'pending',
      },
    },
  });
}

// Keep a reference to the client-side QueryClient
let browserQueryClient: QueryClient | undefined;

// Get a QueryClient instance, creating a new one on the server
// and reusing the existing one on the client
export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  }
  else {
    // Browser: make a new query client if we don't already have one
    // This is important to prevent creating new clients during React's
    // suspense phase
    if (!browserQueryClient)
      browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}
