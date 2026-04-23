import { Alert } from 'react-native';

let handler: (() => void) | null = null;

/** נרשם מ־RootLayout (למשל עם router.replace אחרי בניית מסך Login). */
export function registerMobileUnauthorized(h: (() => void) | null): void {
  handler = h;
}

export function notifyMobileUnauthorized(): void {
  if (handler) {
    handler();
    return;
  }
  Alert.alert(
    'התחברות נדרשת',
    'השרת החזיר 401. כשמסך ההתחברות יהיה זמין, חברו אותו דרך registerMobileUnauthorized.',
  );
}
