import React, { useState, useEffect } from 'react'
import { Box, Button, Typography, Alert, CircularProgress, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useApplePay } from '@shared/hooks/useApplePay'
import { useIOS } from '@shared/hooks/useFetch'

interface ApplePayButtonProps {
    amount: number
    currency?: string
    merchantIdentifier: string
    onPaymentSuccess: (paymentResponse: Record<string, unknown>) => void
    onPaymentError: (error: string) => void
    onPaymentCancel?: () => void
    disabled?: boolean
    variant?: 'text' | 'outlined' | 'contained'
    size?: 'small' | 'medium' | 'large'
    fullWidth?: boolean
    items?: Array<{ label: string; amount: number }>
}

const ApplePayButton: React.FC<ApplePayButtonProps> = ({
    amount,
    currency = 'ILS',
    merchantIdentifier,
    onPaymentSuccess,
    onPaymentError,
    onPaymentCancel,
    disabled = false,
    variant = 'contained',
    size = 'large',
    fullWidth = false,
    items = []
}) => {
    const { t } = useTranslation()
    const { isIOS } = useIOS()
    
    const {
        isApplePayAvailable,
        isApplePaySupported,
        isLoading,
        error,
        canMakePaymentsWithActiveCard,
        openPaymentSetup,
        requestPayment
    } = useApplePay({
        merchantIdentifier,
        countryCode: 'IL',
        currencyCode: currency
    })

    const [showSetupPrompt, setShowSetupPrompt] = useState(false)
    const [hasActiveCard, setHasActiveCard] = useState(false)

    // Check if user has active card
    useEffect(() => {
        const checkActiveCard = async () => {
            if (isApplePaySupported) {
                try {
                    const hasCard = await canMakePaymentsWithActiveCard()
                    setHasActiveCard(hasCard)
                } catch (error) {
                    console.error('Error checking active card:', error)
                    setHasActiveCard(false)
                }
            }
        }

        checkActiveCard()
    }, [isApplePaySupported, canMakePaymentsWithActiveCard])

    const handlePayment = async () => {
        if (!isApplePayAvailable || !isApplePaySupported) {
            onPaymentError('Apple Pay is not available on this device')
            return
        }

        if (!hasActiveCard) {
            setShowSetupPrompt(true)
            return
        }

        try {
            const paymentResponse = await requestPayment(amount, items)
            
            if (paymentResponse) {
                onPaymentSuccess(paymentResponse as unknown as Record<string, unknown>)
            } else {
                onPaymentCancel?.()
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Payment failed'
            onPaymentError(errorMessage)
        }
    }

    const handleSetupPayment = async () => {
        try {
            await openPaymentSetup()
            setShowSetupPrompt(false)
            // Re-check if user now has active card
            const hasCard = await canMakePaymentsWithActiveCard()
            setHasActiveCard(hasCard)
        } catch (error) {
            console.error('Error setting up Apple Pay:', error)
            onPaymentError('Failed to set up Apple Pay')
        }
    }

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('he-IL', {
            style: 'currency',
            currency: currency === 'ILS' ? 'ILS' : currency
        }).format(amount)
    }

    // Don't show Apple Pay button on non-iOS devices
    if (!isIOS) {
        return null
    }

    // Show setup prompt if Apple Pay is available but no active card
    if (showSetupPrompt) {
        return (
            <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                        {t('payment.applePaySetupRequired')}
                    </Typography>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleSetupPayment}
                        sx={{ mt: 1 }}
                    >
                        {t('payment.setupApplePay')}
                    </Button>
                </Alert>
            </Box>
        )
    }

    // Show error if Apple Pay is not available
    if (!isApplePayAvailable) {
        return null
    }

    // Show error if Apple Pay is not supported
    if (!isApplePaySupported) {
        return (
            <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
                <Alert severity="warning">
                    {t('payment.applePayNotSupported')}
                </Alert>
            </Box>
        )
    }

    return (
        <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            <Tooltip 
                title={!hasActiveCard ? t('payment.setupApplePayFirst') : ''}
                placement="top"
            >
                <span>
                    <Button
                        variant={variant}
                        size={size}
                        fullWidth={fullWidth}
                        disabled={disabled || isLoading || !hasActiveCard}
                        onClick={handlePayment}
                        sx={{
                            background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                            color: 'white',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: size === 'large' ? '1.1rem' : size === 'medium' ? '1rem' : '0.9rem',
                            padding: size === 'large' ? '12px 24px' : size === 'medium' ? '10px 20px' : '8px 16px',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #333333 0%, #555555 100%)',
                            },
                            '&:disabled': {
                                background: '#cccccc',
                                color: '#666666',
                            },
                            // Apple Pay specific styling
                            '&::before': {
                                content: '""',
                                display: 'inline-block',
                                width: '20px',
                                height: '20px',
                                marginRight: '8px',
                                backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'white\'%3E%3Cpath d=\'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z\'/%3E%3C/svg%3E")',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                verticalAlign: 'middle'
                            }
                        }}
                    >
                        {isLoading ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <>
                                {t('payment.payWithApplePay')} {formatAmount(amount, currency)}
                            </>
                        )}
                    </Button>
                </span>
            </Tooltip>
        </Box>
    )
}

export default ApplePayButton
