import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MobileUnauthorizedRegistrar } from '../components/MobileUnauthorizedRegistrar';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <MobileUnauthorizedRegistrar />
        <Slot />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
