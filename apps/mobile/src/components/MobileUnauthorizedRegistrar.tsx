import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { registerMobileUnauthorized } from '../auth/mobileUnauthorized';

/**
 * רושם טיפול ב-401: ניווט לכניסה לאפליקציה (עד שייקם מסך login ייעודי).
 */
export function MobileUnauthorizedRegistrar() {
  const router = useRouter();

  useEffect(() => {
    registerMobileUnauthorized(() => {
      try {
        router.replace('/');
      } catch {
        /* ignore */
      }
    });
    return () => registerMobileUnauthorized(null);
  }, [router]);

  return null;
}
