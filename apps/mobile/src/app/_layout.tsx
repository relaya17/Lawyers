import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MobileUnauthorizedRegistrar } from '../components/MobileUnauthorizedRegistrar';
import { AuthProvider } from '../auth/AuthContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1 },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <MobileUnauthorizedRegistrar />
          <Slot />
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
