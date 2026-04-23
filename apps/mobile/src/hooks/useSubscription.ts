import { useCallback, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import Purchases, {
  LOG_LEVEL,
  type CustomerInfo,
  type PurchasesOffering,
  type PurchasesPackage,
} from 'react-native-purchases'

const entitlementId = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT ?? 'pro_access'

let purchasesConfigured = false

function pickApiKey(): string | undefined {
  if (Platform.OS === 'ios') return process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
  if (Platform.OS === 'android') return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY
  return undefined
}

function readIsPro(info: CustomerInfo): boolean {
  return info.entitlements.active[entitlementId] != null
}

export interface PurchaseOutcome {
  ok: boolean
  /** המשתמש סגר את חלון התשלום */
  cancelled?: boolean
  error?: string
}

/**
 * סטטוס מנוי + הצעות רכישה מ-RevenueCat.
 * דורש Dev Build נייטיב — לא עובד ב-Expo Go.
 * בלי מפתחות ב-env: מחזיר isPro=false, ready=true ו-offering=null (no-op).
 */
export function useSubscription() {
  const [isPro, setIsPro] = useState(false)
  const [ready, setReady] = useState(false)
  const [offering, setOffering] = useState<PurchasesOffering | null>(null)
  const [available, setAvailable] = useState(false)
  const [purchasing, setPurchasing] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const info = await Purchases.getCustomerInfo()
      setIsPro(readIsPro(info))
    } catch {
      /* SDK לא מאותחל או אין רשת */
    }
  }, [])

  const loadOfferings = useCallback(async () => {
    try {
      const offerings = await Purchases.getOfferings()
      setOffering(offerings.current ?? null)
    } catch {
      setOffering(null)
    }
  }, [])

  const purchasePackage = useCallback(
    async (pkg: PurchasesPackage): Promise<PurchaseOutcome> => {
      if (!available) return { ok: false, error: 'RevenueCat not configured' }
      setPurchasing(true)
      try {
        const { customerInfo } = await Purchases.purchasePackage(pkg)
        setIsPro(readIsPro(customerInfo))
        return { ok: true }
      } catch (e) {
        const err = e as { userCancelled?: boolean; message?: string }
        if (err.userCancelled) return { ok: false, cancelled: true }
        return { ok: false, error: err.message ?? 'Purchase failed' }
      } finally {
        setPurchasing(false)
      }
    },
    [available],
  )

  const restorePurchases = useCallback(async (): Promise<PurchaseOutcome> => {
    if (!available) return { ok: false, error: 'RevenueCat not configured' }
    try {
      const info = await Purchases.restorePurchases()
      setIsPro(readIsPro(info))
      return { ok: true }
    } catch (e) {
      const err = e as { message?: string }
      return { ok: false, error: err.message ?? 'Restore failed' }
    }
  }, [available])

  useEffect(() => {
    const apiKey = pickApiKey()
    if (!apiKey) {
      setReady(true)
      return
    }

    try {
      if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG)
      if (!purchasesConfigured) {
        Purchases.configure({ apiKey })
        purchasesConfigured = true
      }
      setAvailable(true)
    } catch {
      setReady(true)
      return
    }

    const listener = (info: CustomerInfo) => {
      setIsPro(readIsPro(info))
    }
    Purchases.addCustomerInfoUpdateListener(listener)

    void (async () => {
      await Promise.all([refresh(), loadOfferings()])
      setReady(true)
    })()

    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener)
    }
  }, [refresh, loadOfferings])

  return {
    isPro,
    ready,
    available,
    offering,
    purchasing,
    refresh,
    loadOfferings,
    purchasePackage,
    restorePurchases,
  }
}
