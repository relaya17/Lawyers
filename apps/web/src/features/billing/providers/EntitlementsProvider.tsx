import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import { fetchEntitlements } from '../api/billingHttp'
import type { EntitlementsResponse, PlanEntitlements, PlanId } from '../types'

type EntitlementFlag = Exclude<
  keyof PlanEntitlements,
  'monthlyQuestionQuota' | 'dailyQuestionLimit'
>

interface EntitlementsContextValue {
  loading: boolean
  plan: PlanId
  status: EntitlementsResponse['status']
  entitlements: PlanEntitlements
  dailyQuestions: EntitlementsResponse['dailyQuestions'] | null
  promoActive: boolean
  promoEndsAt: string | null
  dailyAiCalls: EntitlementsResponse['dailyAiCalls'] | null
  currentPeriodEnd: Date | null
  cancelAtPeriodEnd: boolean
  can: (flag: EntitlementFlag) => boolean
  refresh: () => Promise<void>
}

const FREE_ENTITLEMENTS: PlanEntitlements = {
  aiCoach: false,
  adaptiveDrills: false,
  virtualCourtLimited: true,
  virtualCourtFull: false,
  realCaseImport: false,
  contractRiskAnalysis: false,
  unlimitedExamQuestions: false,
  monthlyQuestionQuota: 0,
  dailyQuestionLimit: 20,
}

const DEFAULT_VALUE: EntitlementsContextValue = {
  loading: false,
  plan: 'free',
  status: 'none',
  entitlements: FREE_ENTITLEMENTS,
  dailyQuestions: null,
  promoActive: false,
  promoEndsAt: null,
  dailyAiCalls: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  can: () => false,
  refresh: async () => {},
}

const EntitlementsContext = createContext<EntitlementsContextValue>(DEFAULT_VALUE)

export const EntitlementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accessToken, isAuthenticated } = useSessionAuth()
  const [state, setState] = useState<Omit<EntitlementsContextValue, 'can' | 'refresh'>>({
    loading: false,
    plan: 'free',
    status: 'none',
    entitlements: FREE_ENTITLEMENTS,
    dailyQuestions: null,
    promoActive: false,
    promoEndsAt: null,
    dailyAiCalls: null,
    currentPeriodEnd: null,
    cancelAtPeriodEnd: false,
  })

  const load = useCallback(async () => {
    if (!accessToken || !isAuthenticated) {
      setState({
        loading: false,
        plan: 'free',
        status: 'none',
        entitlements: FREE_ENTITLEMENTS,
        dailyQuestions: null,
        promoActive: false,
        promoEndsAt: null,
        dailyAiCalls: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      })
      return
    }
    setState((s) => ({ ...s, loading: true }))
    try {
      const r = await fetchEntitlements(accessToken)
      setState({
        loading: false,
        plan: r.plan,
        status: r.status,
        entitlements: r.entitlements,
        dailyQuestions: r.dailyQuestions ?? {
          used: 0,
          limit: r.entitlements.dailyQuestionLimit ?? null,
        },
        promoActive: r.promoActive ?? false,
        promoEndsAt: r.promoEndsAt ?? null,
        dailyAiCalls: r.dailyAiCalls ?? null,
        currentPeriodEnd: r.currentPeriodEnd ? new Date(r.currentPeriodEnd) : null,
        cancelAtPeriodEnd: r.cancelAtPeriodEnd,
      })
    } catch {
      // Offline / server down → fall back to free tier so app still works
      setState({
        loading: false,
        plan: 'free',
        status: 'none',
        entitlements: FREE_ENTITLEMENTS,
        dailyQuestions: null,
        promoActive: false,
        promoEndsAt: null,
        dailyAiCalls: null,
        currentPeriodEnd: null,
        cancelAtPeriodEnd: false,
      })
    }
  }, [accessToken, isAuthenticated])

  useEffect(() => {
    void load()
  }, [load])

  const value = useMemo<EntitlementsContextValue>(
    () => ({
      ...state,
      can: (flag) => state.entitlements[flag] === true,
      refresh: load,
    }),
    [state, load],
  )

  return <EntitlementsContext.Provider value={value}>{children}</EntitlementsContext.Provider>
}

export function useEntitlements(): EntitlementsContextValue {
  return useContext(EntitlementsContext)
}
