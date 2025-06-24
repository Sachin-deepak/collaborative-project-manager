import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
  children: ReactNode;
}

export default function QueryProvider({ children }: Props) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: (failureCount, error: any) => {
          if (error?.message === 'Network error. Please check your internet connection.') {
            return failureCount < 3;
          }
          return false;
        },
        retryDelay: 1000,
      },
      mutations: {
        retry: (failureCount, error: any) => {
          if (error?.message === 'Network error. Please check your internet connection.') {
            return failureCount < 3;
          }
          return false;
        },
        retryDelay: 1000,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
