// Marketplace Types
// טיפוסים לשוק התבניות והמוצרים המשפטיים

export interface Product {
    id: string
    title: string
    description: string
    type: 'template' | 'service' | 'course' | 'consultation'
    category: string
    price: number
    currency: 'ILS' | 'USD' | 'EUR'
    rating: number
    reviewCount: number
    sellerId: string
    sellerName: string
    sellerRating: number
    tags: string[]
    features: string[]
    preview?: string
    images: string[]
    createdAt: string
    updatedAt: string
    isActive: boolean
    isPremium: boolean
    downloadCount: number
    language: 'he' | 'en' | 'ar'
}

export interface ProductCategory {
    id: string
    name: string
    description: string
    icon: string
    parentId?: string
    productCount: number
}

export interface CartItem {
    productId: string
    product: Product
    quantity: number
    addedAt: string
}

export interface Order {
    id: string
    customerId: string
    items: OrderItem[]
    totalAmount: number
    currency: string
    status: 'pending' | 'paid' | 'cancelled' | 'refunded'
    paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer'
    createdAt: string
    updatedAt: string
    invoiceUrl?: string
}

export interface OrderItem {
    productId: string
    product: Product
    quantity: number
    price: number
    totalPrice: number
}

export interface Review {
    id: string
    productId: string
    customerId: string
    customerName: string
    rating: number
    comment: string
    createdAt: string
    isVerified: boolean
}

export interface Seller {
    id: string
    name: string
    description: string
    avatar?: string
    rating: number
    reviewCount: number
    productCount: number
    joinedAt: string
    isVerified: boolean
    specialties: string[]
    location: string
}

export interface MarketplaceState {
    products: Product[]
    categories: ProductCategory[]
    cart: CartItem[]
    orders: Order[]
    reviews: Review[]
    sellers: Seller[]
    filters: ProductFilters
    loading: boolean
    error: string | null
}

export interface ProductFilters {
    category?: string
    priceRange?: {
        min: number
        max: number
    }
    rating?: number
    type?: Product['type']
    language?: Product['language']
    isPremium?: boolean
    search?: string
    sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular'
}

export interface PaymentDetails {
    amount: number
    currency: string
    cardNumber: string
    expiryDate: string
    cvv: string
    holderName: string
    billingAddress: {
        street: string
        city: string
        state: string
        zipCode: string
        country: string
    }
    paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'apple_pay'
}

// Apple Pay specific types
export interface ApplePayPaymentRequest {
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
    shippingContact?: {
        emailAddress?: string
        phoneNumber?: string
        givenName?: string
        familyName?: string
        addressLines?: string[]
        locality?: string
        administrativeArea?: string
        postalCode?: string
        country?: string
    }
    billingContact?: {
        emailAddress?: string
        phoneNumber?: string
        givenName?: string
        familyName?: string
        addressLines?: string[]
        locality?: string
        administrativeArea?: string
        postalCode?: string
        country?: string
    }
}

export interface ApplePayPaymentResponse {
    token: {
        paymentData: Record<string, unknown>
        paymentMethod: {
            displayName: string
            network: string
            type: string
        }
        transactionIdentifier: string
    }
    billingContact?: {
        emailAddress?: string
        phoneNumber?: string
        givenName?: string
        familyName?: string
        addressLines?: string[]
        locality?: string
        administrativeArea?: string
        postalCode?: string
        country?: string
    }
    shippingContact?: {
        emailAddress?: string
        phoneNumber?: string
        givenName?: string
        familyName?: string
        addressLines?: string[]
        locality?: string
        administrativeArea?: string
        postalCode?: string
        country?: string
    }
}

export interface ApplePaySession {
    canMakePayments(): boolean
    canMakePaymentsWithActiveCard(merchantIdentifier: string): Promise<boolean>
    openPaymentSetup(): Promise<void>
    begin(): void
    abort(): void
    completeMerchantValidation(merchantSession: Record<string, unknown>): void
    completePayment(status: number): void
    completeShippingContactSelection(status: number, newShippingMethods: Record<string, unknown>[], newTotal: Record<string, unknown>): void
    completeShippingMethodSelection(status: number, newTotal: Record<string, unknown>): void
    onvalidatemerchant: (event: Record<string, unknown>) => void
    onpaymentauthorized: (event: Record<string, unknown>) => void
    onshippingcontactselected: (event: Record<string, unknown>) => void
    onshippingmethodselected: (event: Record<string, unknown>) => void
    oncancel: (event: Record<string, unknown>) => void
}

export interface ApplePayPaymentMethod {
    displayName: string
    network: string
    type: string
}

export interface ApplePayPaymentToken {
    paymentData: Record<string, unknown>
    paymentMethod: ApplePayPaymentMethod
    transactionIdentifier: string
}
