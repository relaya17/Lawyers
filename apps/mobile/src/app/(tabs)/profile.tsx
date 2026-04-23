import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { PurchasesPackage } from 'react-native-purchases';
import { useSubscription } from '../../hooks/useSubscription';

export default function ProfileScreen() {
  const {
    isPro,
    ready,
    available,
    offering,
    purchasing,
    refresh,
    purchasePackage,
    restorePurchases,
  } = useSubscription();
  const [busyPackageId, setBusyPackageId] = useState<string | null>(null);

  const handlePurchase = async (pkg: PurchasesPackage) => {
    setBusyPackageId(pkg.identifier);
    const r = await purchasePackage(pkg);
    setBusyPackageId(null);
    if (r.ok) {
      Alert.alert('תודה!', 'המנוי הופעל בהצלחה.');
    } else if (r.cancelled) {
      /* המשתמש ביטל — לא להציג שגיאה */
    } else {
      Alert.alert('רכישה נכשלה', r.error ?? 'נסי שוב מאוחר יותר.');
    }
  };

  const handleRestore = async () => {
    const r = await restorePurchases();
    if (r.ok) {
      Alert.alert('שחזור הצליח', isPro ? 'המנוי הפעיל שוחזר.' : 'לא נמצאו רכישות קודמות.');
    } else {
      Alert.alert('שחזור נכשל', r.error ?? 'נסי שוב מאוחר יותר.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>המנוי שלי</Text>
          {!ready ? (
            <ActivityIndicator color="#1e3a5f" />
          ) : (
            <>
              <Text style={[styles.plan, isPro ? styles.planPro : styles.planFree]}>
                {isPro ? 'Student Pro — פעיל' : 'מסלול חינם'}
              </Text>
              <Text style={styles.hint}>
                {isPro
                  ? 'יש לך גישה מלאה לבית המשפט הווירטואלי, 1,200+ השאלות ולמאמן ה-AI.'
                  : 'שדרוג ל-Student Pro פותח את כל השאלות, מאמן AI ובית משפט וירטואלי.'}
              </Text>

              {!available && (
                <Text style={styles.note}>
                  תשלום App Store / Google Play מתבצע ב-build נייטיב (לא Expo Go). הגדירי
                  EXPO_PUBLIC_REVENUECAT_* כדי להפעיל את רכישת המנוי.
                </Text>
              )}

              <TouchableOpacity style={styles.secondaryBtn} onPress={() => void refresh()}>
                <Text style={styles.secondaryBtnText}>רענון סטטוס</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {ready && available && !isPro && offering && offering.availablePackages.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>בחרי מסלול</Text>
            {offering.availablePackages.map((pkg) => (
              <TouchableOpacity
                key={pkg.identifier}
                style={styles.packageRow}
                onPress={() => void handlePurchase(pkg)}
                disabled={purchasing}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.packageTitle}>
                    {pkg.product.title || pkg.product.identifier}
                  </Text>
                  {pkg.product.description ? (
                    <Text style={styles.packageDesc}>{pkg.product.description}</Text>
                  ) : null}
                </View>
                <View style={styles.packageRight}>
                  {busyPackageId === pkg.identifier ? (
                    <ActivityIndicator color="#1e3a5f" />
                  ) : (
                    <Text style={styles.packagePrice}>{pkg.product.priceString}</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => void handleRestore()}
              disabled={purchasing}
            >
              <Text style={styles.linkBtnText}>שחזור רכישה קודמת</Text>
            </TouchableOpacity>
          </View>
        )}

        {ready && available && !isPro && (!offering || offering.availablePackages.length === 0) && (
          <View style={styles.card}>
            <Text style={styles.note}>
              לא נטענו חבילות מ-RevenueCat. ודאי שהגדרת Offering פעיל עם לפחות Package אחד
              ב-RevenueCat Dashboard.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
  },
  title: { fontSize: 20, fontWeight: '700', color: '#1e3a5f', textAlign: 'right', marginBottom: 8 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a5f',
    textAlign: 'right',
    marginBottom: 12,
  },
  plan: { fontSize: 16, fontWeight: '600', textAlign: 'right', marginBottom: 8 },
  planPro: { color: '#2e7d32' },
  planFree: { color: '#8a6d00' },
  hint: { fontSize: 14, color: '#333', textAlign: 'right', lineHeight: 22, marginBottom: 8 },
  note: { fontSize: 12, color: '#888', textAlign: 'right', marginBottom: 12, lineHeight: 18 },
  secondaryBtn: {
    backgroundColor: '#eef1f6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryBtnText: { color: '#1e3a5f', fontWeight: '600' },
  packageRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eceff3',
  },
  packageTitle: { fontSize: 15, fontWeight: '600', color: '#1e3a5f', textAlign: 'right' },
  packageDesc: { fontSize: 12, color: '#666', textAlign: 'right', marginTop: 2 },
  packageRight: { minWidth: 80, alignItems: 'flex-start' },
  packagePrice: { fontSize: 15, fontWeight: '700', color: '#d4a017' },
  linkBtn: { alignItems: 'center', paddingVertical: 12 },
  linkBtnText: { color: '#1e3a5f', fontWeight: '600' },
});
