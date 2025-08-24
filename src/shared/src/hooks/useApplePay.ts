import { useState, useCallback, useEffect } from 'react'

// Local types for Apple Pay
interface ApplePayPaymentRequest {
    countryCode: string
    currencyCode: string
    supportedNetworks: string[]
    merchantCapabilities: string[]
    total: {
        label: string
        amount: string
    }
    lineItems?: Array<{
        label: string
        amount: string
    }>
}

interface ApplePayPaymentResponse {
    token: {
        paymentData: Record<string, unknown>
        paymentMethod: {
            displayName: string
            network: string
            type: string
        }
        transactionIdentifier: string
    }
    billingContact?: Record<string, unknown>
    shippingContact?: Record<string, unknown>
}

interface ApplePaySession {
    begin(): void
    abort(): void
    completeMerchantValidation(merchantSession: Record<string, unknown>): void
    completePayment(status: number): void
    completeShippingContactSelection(status: number, newShippingMethods: Array<Record<string, unknown>>, newTotal: Record<string, unknown>): void
    completeShippingMethodSelection(status: number, newTotal: Record<string, unknown>): void
    onvalidatemerchant: (event: Record<string, unknown>) => void
    onpaymentauthorized: (event: { payment: { token: Record<string, unknown>; billingContact?: Record<string, unknown>; shippingContact?: Record<string, unknown> } }) => void
    oncancel: (event: Record<string, unknown>) => void
    onshippingcontactselected: (event: Record<string, unknown>) => void
    onshippingmethodselected: (event: Record<string, unknown>) => void
}

interface UseApplePayOptions {
    merchantIdentifier: string
    countryCode?: string
    currencyCode?: string
}

interface UseApplePayResult {
    isApplePayAvailable: boolean
    isApplePaySupported: boolean
    isLoading: boolean
    error: string | null
    canMakePayments: () => boolean
    canMakePaymentsWithActiveCard: () => Promise<boolean>
    openPaymentSetup: () => Promise<void>
    requestPayment: (amount: number, items?: Array<{ label: string; amount: number }>) => Promise<ApplePayPaymentResponse | null>
    abortPayment: () => void
}

declare global {
    interface Window {
        ApplePaySession?: {
            canMakePayments(): boolean
            canMakePaymentsWithActiveCard(merchantIdentifier: string): Promise<boolean>
            openPaymentSetup(): Promise<void>
            new(version: number, paymentRequest: ApplePayPaymentRequest): ApplePaySession
        }
    }
}

export const useApplePay = (options: UseApplePayOptions): UseApplePayResult => {
    const [isApplePayAvailable, setIsApplePayAvailable] = useState(false)
    const [isApplePaySupported, setIsApplePaySupported] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [currentSession, setCurrentSession] = useState<ApplePaySession | null>(null)

    const { merchantIdentifier, countryCode = 'IL', currencyCode = 'ILS' } = options

    // Check if Apple Pay is available
    useEffect(() => {
        const checkApplePayAvailability = () => {
            const isAvailable = typeof window !== 'undefined' && !!window.ApplePaySession
            setIsApplePayAvailable(isAvailable)

            if (isAvailable) {
                const canMakePayments = window.ApplePaySession!.canMakePayments()
                setIsApplePaySupported(canMakePayments)
            }
        }

        checkApplePayAvailability()
    }, [])

    const canMakePayments = useCallback((): boolean => {
        if (!window.ApplePaySession) return false
        return window.ApplePaySession.canMakePayments()
    }, [])

    const canMakePaymentsWithActiveCard = useCallback(async (): Promise<boolean> => {
        if (!window.ApplePaySession) return false
        try {
            return await window.ApplePaySession.canMakePaymentsWithActiveCard(merchantIdentifier)
        } catch (error) {
            console.error('Error checking Apple Pay active card:', error)
            return false
        }
    }, [merchantIdentifier])

    const openPaymentSetup = useCallback(async (): Promise<void> => {
        if (!window.ApplePaySession) {
            throw new Error('Apple Pay is not available')
        }

        try {
            await window.ApplePaySession.openPaymentSetup()
        } catch (error) {
            console.error('Error opening Apple Pay setup:', error)
            throw error
        }
    }, [])

    const requestPayment = useCallback(async (
        amount: number,
        items?: Array<{ label: string; amount: number }>
    ): Promise<ApplePayPaymentResponse | null> => {
        if (!window.ApplePaySession) {
            setError('Apple Pay is not available')
            return null
        }

        if (!canMakePayments()) {
            setError('Apple Pay is not supported on this device')
            return null
        }

        setIsLoading(true)
        setError(null)

        try {
            const paymentRequest: ApplePayPaymentRequest = {
                countryCode,
                currencyCode,
                supportedNetworks: ['visa', 'masterCard', 'amex'],
                merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'],
                total: {
                    label: 'ContractLab Pro',
                    amount: amount.toFixed(2)
                },
                lineItems: items?.map(item => ({
                    label: item.label,
                    amount: item.amount.toFixed(2)
                }))
            }

            return new Promise((resolve, reject) => {
                const session = new window.ApplePaySession!(6, paymentRequest)

                session.onvalidatemerchant = async () => {
                    try {
                        // Mock merchant validation - in real app, this would call the actual service
                        const merchantSession = { /* mock session data */ }
                        session.completeMerchantValidation(merchantSession)
                    } catch (error) {
                        console.error('Merchant validation failed:', error)
                        session.abort()
                        reject(new Error('Merchant validation failed'))
                    }
                }

                session.onpaymentauthorized = async (event: { payment: { token: Record<string, unknown>; billingContact?: Record<string, unknown>; shippingContact?: Record<string, unknown> } }) => {
                    try {
                        const paymentResponse: ApplePayPaymentResponse = {
                            token: event.payment.token as ApplePayPaymentResponse['token'],
                            billingContact: event.payment.billingContact,
                            shippingContact: event.payment.shippingContact
                        }

                        session.completePayment(0) // STATUS_SUCCESS = 0
                        resolve(paymentResponse)
                    } catch (error) {
                        console.error('Payment processing failed:', error)
                        session.completePayment(1) // STATUS_FAILURE = 1
                        reject(error)
                    }
                }

                session.oncancel = () => {
                    console.log('Apple Pay payment cancelled')
                    resolve(null)
                }

                session.onshippingcontactselected = () => {
                    // Handle shipping contact selection if needed
                    session.completeShippingContactSelection(0, [], { // STATUS_SUCCESS = 0
                        label: 'ContractLab Pro',
                        amount: amount.toFixed(2)
                    })
                }

                session.onshippingmethodselected = () => {
                    // Handle shipping method selection if needed
                    session.completeShippingMethodSelection(0, { // STATUS_SUCCESS = 0
                        label: 'ContractLab Pro',
                        amount: amount.toFixed(2)
                    })
                }

                setCurrentSession(session)
                session.begin()
            })
        } catch (error) {
            console.error('Apple Pay request failed:', error)
            setError(error instanceof Error ? error.message : 'Apple Pay request failed')
            return null
        } finally {
            setIsLoading(false)
            setCurrentSession(null)
        }
    }, [countryCode, currencyCode, canMakePayments])

    const abortPayment = useCallback(() => {
        if (currentSession) {
            currentSession.abort()
            setCurrentSession(null)
        }
        setIsLoading(false)
        setError(null)
    }, [currentSession])

    return {
        isApplePayAvailable,
        isApplePaySupported,
        isLoading,
        error,
        canMakePayments,
        canMakePaymentsWithActiveCard,
        openPaymentSetup,
        requestPayment,
        abortPayment
    }
}
