import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Divider,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel
} from '@mui/material'
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  Payment,
  CreditCard,
  AccountBalance,
  Security
} from '@mui/icons-material'
import ApplePayButton from '@shared/components/ui/ApplePayButton'
import { AppDispatch, RootState } from '@shared/store'
import { 
  fetchCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart,
  createOrder 
} from '../store/marketplaceSlice'
import type { CartItem, PaymentDetails } from '../types/marketplaceTypes'

const Cart: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  
  const { cart, loading, error } = useSelector((state: RootState) => state.marketplace)
  
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    amount: 0,
    currency: 'ILS',
    paymentMethod: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'IL'
    }
  })
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'paypal' | 'bank_transfer' | 'apple_pay'>('credit_card')

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(productId))
    } else {
      dispatch(updateCartItem({ productId, quantity }))
    }
  }

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const calculateSubtotal = () => {
    return cart.reduce((total: number, item: CartItem) => total + (item.product.price * item.quantity), 0)
  }

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.17 // VAT 17% in Israel
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const tax = calculateTax(subtotal)
    return subtotal + tax
  }

  const formatPrice = (price: number, currency: string = 'ILS') => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: currency === 'ILS' ? 'ILS' : currency
    }).format(price)
  }

  const handleCheckout = () => {
    const total = calculateTotal()
    setPaymentDetails(prev => ({ ...prev, amount: total }))
    setCheckoutDialogOpen(true)
  }

  const handlePayment = async () => {
    try {
      await dispatch(createOrder({ cartItems: cart, paymentDetails })).unwrap()
      setCheckoutDialogOpen(false)
      // TODO: Navigate to success page
    } catch (error) {
      console.error('Payment failed:', error)
    }
  }

  const handleApplePaySuccess = async (paymentResponse: Record<string, unknown>) => {
    try {
      const applePayPaymentDetails: PaymentDetails = {
        ...paymentDetails,
        paymentMethod: 'apple_pay'
      }
      
      await dispatch(createOrder({ 
        cartItems: cart, 
        paymentDetails: applePayPaymentDetails 
      })).unwrap()
      
      setCheckoutDialogOpen(false)
      // TODO: Navigate to success page
    } catch (error) {
      console.error('Apple Pay payment failed:', error)
    }
  }

  const handleApplePayError = (error: string) => {
    console.error('Apple Pay error:', error)
    // TODO: Show error message to user
  }

  const isPaymentValid = () => {
    if (paymentMethod === 'credit_card') {
      return (
        paymentDetails.cardNumber.length >= 16 &&
        paymentDetails.expiryDate.length >= 5 &&
        paymentDetails.cvv.length >= 3 &&
        paymentDetails.holderName.trim() !== '' &&
        paymentDetails.billingAddress.street.trim() !== '' &&
        paymentDetails.billingAddress.city.trim() !== ''
      )
    }
    return true
  }

  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            {t('marketplace.emptyCart')}
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            {t('marketplace.emptyCartDescription')}
          </Typography>
          <Button variant="contained" size="large" href="/marketplace">
            {t('marketplace.continueShopping')}
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('marketplace.shoppingCart')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                {t('marketplace.cartItems')} ({cart.length})
              </Typography>
              <Button 
                variant="outlined" 
                color="error" 
                onClick={handleClearCart}
                startIcon={<Delete />}
              >
                {t('marketplace.clearCart')}
              </Button>
            </Box>

            <List>
              {cart.map((item: CartItem, index: number) => (
                <React.Fragment key={item.productId}>
                  <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                    <Card sx={{ display: 'flex', width: '100%', elevation: 0 }}>
                      <CardMedia
                        component="img"
                        sx={{ width: 120, height: 120 }}
                        image={item.product.images[0] || '/placeholder-image.jpg'}
                        alt={item.product.title}
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2 }}>
                        <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip 
                              size="small" 
                              label={t(`marketplace.${item.product.type}`)} 
                              color="primary" 
                              variant="outlined" 
                            />
                            {item.product.isPremium && (
                              <Chip 
                                size="small" 
                                label={t('marketplace.premium')} 
                                color="warning" 
                              />
                            )}
                          </Box>

                          <Typography component="div" variant="h6" gutterBottom>
                            {item.product.title}
                          </Typography>

                          <Typography variant="body2" color="textSecondary" paragraph>
                            {item.product.description.length > 100 
                              ? `${item.product.description.substring(0, 100)}...`
                              : item.product.description
                            }
                          </Typography>

                          <Typography variant="body2" color="textSecondary">
                            {t('marketplace.seller')}: {item.product.sellerName}
                          </Typography>
                        </CardContent>

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton 
                              size="small"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Remove />
                            </IconButton>
                            <TextField
                              size="small"
                              value={item.quantity}
                              onChange={(e) => {
                                const quantity = parseInt(e.target.value) || 1
                                handleUpdateQuantity(item.productId, quantity)
                              }}
                              sx={{ width: 60 }}
                              inputProps={{ min: 1, style: { textAlign: 'center' } }}
                            />
                            <IconButton 
                              size="small"
                              onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Add />
                            </IconButton>
                          </Box>

                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" color="primary">
                              {formatPrice(item.product.price * item.quantity, item.product.currency)}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {formatPrice(item.product.price, item.product.currency)} × {item.quantity}
                            </Typography>
                          </Box>

                          <IconButton 
                            color="error"
                            onClick={() => handleRemoveItem(item.productId)}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </Card>
                  </ListItem>
                  {index < cart.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 24 }}>
            <Typography variant="h6" gutterBottom>
              {t('marketplace.orderSummary')}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {t('marketplace.subtotal')}
                </Typography>
                <Typography variant="body2">
                  {formatPrice(calculateSubtotal())}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {t('marketplace.tax')} (17%)
                </Typography>
                <Typography variant="body2">
                  {formatPrice(calculateTax(calculateSubtotal()))}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  {t('marketplace.total')}
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(calculateTotal())}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleCheckout}
              startIcon={<Payment />}
              disabled={loading}
            >
              {t('marketplace.proceedToCheckout')}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
              href="/marketplace"
            >
              {t('marketplace.continueShopping')}
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Checkout Dialog */}
      <Dialog 
        open={checkoutDialogOpen} 
        onClose={() => setCheckoutDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Payment />
            {t('marketplace.checkout')}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {/* Payment Method Selection */}
            <FormControl component="fieldset" sx={{ mb: 3 }}>
              <FormLabel component="legend">{t('marketplace.paymentMethod')}</FormLabel>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
              >
                <FormControlLabel 
                  value="credit_card" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CreditCard />
                      {t('marketplace.creditCard')}
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="paypal" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Payment />
                      PayPal
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="bank_transfer" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountBalance />
                      {t('marketplace.bankTransfer')}
                    </Box>
                  } 
                />
              </RadioGroup>
            </FormControl>

            {/* Apple Pay Button */}
            <Box sx={{ mt: 2 }}>
              <ApplePayButton
                amount={calculateTotal()}
                currency="ILS"
                merchantIdentifier="merchant.com.contractlab.pro"
                onPaymentSuccess={handleApplePaySuccess}
                onPaymentError={handleApplePayError}
                onPaymentCancel={() => console.log('Apple Pay cancelled')}
                fullWidth
                items={cart.map(item => ({
                  label: item.product.title,
                  amount: item.product.price * item.quantity
                }))}
              />
            </Box>

            {/* Credit Card Form */}
            {paymentMethod === 'credit_card' && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('marketplace.cardholderName')}
                      value={paymentDetails.holderName}
                      onChange={(e) => setPaymentDetails(prev => ({ ...prev, holderName: e.target.value }))}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('marketplace.cardNumber')}
                      value={paymentDetails.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').substring(0, 16)
                        setPaymentDetails(prev => ({ ...prev, cardNumber: value }))
                      }}
                      placeholder="1234 5678 9012 3456"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label={t('marketplace.expiryDate')}
                      value={paymentDetails.expiryDate}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '')
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4)
                        }
                        setPaymentDetails(prev => ({ ...prev, expiryDate: value }))
                      }}
                      placeholder="MM/YY"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      value={paymentDetails.cvv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').substring(0, 4)
                        setPaymentDetails(prev => ({ ...prev, cvv: value }))
                      }}
                      placeholder="123"
                    />
                  </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                  {t('marketplace.billingAddress')}
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('marketplace.street')}
                      value={paymentDetails.billingAddress.street}
                      onChange={(e) => setPaymentDetails(prev => ({
                        ...prev,
                        billingAddress: { ...prev.billingAddress, street: e.target.value }
                      }))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label={t('marketplace.city')}
                      value={paymentDetails.billingAddress.city}
                      onChange={(e) => setPaymentDetails(prev => ({
                        ...prev,
                        billingAddress: { ...prev.billingAddress, city: e.target.value }
                      }))}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label={t('marketplace.zipCode')}
                      value={paymentDetails.billingAddress.zipCode}
                      onChange={(e) => setPaymentDetails(prev => ({
                        ...prev,
                        billingAddress: { ...prev.billingAddress, zipCode: e.target.value }
                      }))}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Payment Summary */}
            <Paper sx={{ p: 2, mt: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                {t('marketplace.paymentSummary')}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{t('marketplace.totalAmount')}</Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(calculateTotal())}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Security color="success" fontSize="small" />
                <Typography variant="caption" color="textSecondary">
                  {t('marketplace.securePayment')}
                </Typography>
              </Box>
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCheckoutDialogOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            variant="contained" 
            onClick={handlePayment}
            disabled={!isPaymentValid() || loading}
            startIcon={<Payment />}
          >
            {t('marketplace.payNow')} {formatPrice(calculateTotal())}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default Cart
