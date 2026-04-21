import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { MarketplaceService } from '../services/marketplaceService'
import type {
    MarketplaceState,
    CartItem,
    ProductFilters,
    PaymentDetails,
    ApplePayPaymentResponse
} from '../types/marketplaceTypes'

// Initial state
const initialState: MarketplaceState = {
    products: [],
    categories: [],
    cart: [],
    orders: [],
    reviews: [],
    sellers: [],
    filters: {},
    loading: false,
    error: null
}

// Async thunks
export const fetchProducts = createAsyncThunk(
    'marketplace/fetchProducts',
    async (filters?: ProductFilters) => {
        return await MarketplaceService.getProducts(filters)
    }
)

export const fetchProduct = createAsyncThunk(
    'marketplace/fetchProduct',
    async (id: string) => {
        return await MarketplaceService.getProduct(id)
    }
)

export const searchProducts = createAsyncThunk(
    'marketplace/searchProducts',
    async ({ query, filters }: { query: string, filters?: ProductFilters }) => {
        return await MarketplaceService.searchProducts(query, filters)
    }
)

export const fetchCategories = createAsyncThunk(
    'marketplace/fetchCategories',
    async () => {
        return await MarketplaceService.getCategories()
    }
)

export const fetchCart = createAsyncThunk(
    'marketplace/fetchCart',
    async () => {
        return await MarketplaceService.getCart()
    }
)

export const addToCart = createAsyncThunk(
    'marketplace/addToCart',
    async ({ productId, quantity }: { productId: string, quantity?: number }) => {
        return await MarketplaceService.addToCart(productId, quantity)
    }
)

export const updateCartItem = createAsyncThunk(
    'marketplace/updateCartItem',
    async ({ productId, quantity }: { productId: string, quantity: number }) => {
        return await MarketplaceService.updateCartItem(productId, quantity)
    }
)

export const removeFromCart = createAsyncThunk(
    'marketplace/removeFromCart',
    async (productId: string) => {
        await MarketplaceService.removeFromCart(productId)
        return productId
    }
)

export const clearCart = createAsyncThunk(
    'marketplace/clearCart',
    async () => {
        await MarketplaceService.clearCart()
    }
)

export const fetchOrders = createAsyncThunk(
    'marketplace/fetchOrders',
    async () => {
        return await MarketplaceService.getOrders()
    }
)

export const createOrder = createAsyncThunk(
    'marketplace/createOrder',
    async ({ cartItems, paymentDetails }: { cartItems: CartItem[], paymentDetails: PaymentDetails }) => {
        return await MarketplaceService.createOrder(cartItems, paymentDetails)
    }
)

export const processApplePayPayment = createAsyncThunk(
    'marketplace/processApplePayPayment',
    async ({ orderId, applePayResponse }: { orderId: string, applePayResponse: ApplePayPaymentResponse }) => {
        return await MarketplaceService.processApplePayPayment(orderId, applePayResponse)
    }
)

export const fetchProductReviews = createAsyncThunk(
    'marketplace/fetchProductReviews',
    async (productId: string) => {
        return await MarketplaceService.getProductReviews(productId)
    }
)

export const addReview = createAsyncThunk(
    'marketplace/addReview',
    async ({ productId, rating, comment }: { productId: string, rating: number, comment: string }) => {
        return await MarketplaceService.addReview(productId, rating, comment)
    }
)

export const fetchSellers = createAsyncThunk(
    'marketplace/fetchSellers',
    async () => {
        return await MarketplaceService.getSellers()
    }
)

export const purchaseProduct = createAsyncThunk(
    'marketplace/purchaseProduct',
    async ({ productId, paymentDetails }: { productId: string, paymentDetails: PaymentDetails }) => {
        return await MarketplaceService.purchaseProduct(productId, paymentDetails)
    }
)

// Slice
const marketplaceSlice = createSlice({
    name: 'marketplace',
    initialState,
    reducers: {
        setFilters: (state, action: PayloadAction<ProductFilters>) => {
            state.filters = { ...state.filters, ...action.payload }
        },
        clearFilters: (state) => {
            state.filters = {}
        },
        clearError: (state) => {
            state.error = null
        },
        updateCartItemQuantity: (state, action: PayloadAction<{ productId: string, quantity: number }>) => {
            const item = state.cart.find(item => item.productId === action.payload.productId)
            if (item) {
                item.quantity = action.payload.quantity
            }
        },
        removeCartItem: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.filter(item => item.productId !== action.payload)
        }
    },
    extraReducers: (builder) => {
        // Fetch products
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload.products
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'שגיאה בטעינת מוצרים'
            })

        // Search products
        builder
            .addCase(searchProducts.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(searchProducts.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload.products
            })
            .addCase(searchProducts.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message || 'שגיאה בחיפוש מוצרים'
            })

        // Fetch categories
        builder
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload
            })

        // Cart operations
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.cart = action.payload
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                const existingItem = state.cart.find(item => item.productId === action.payload.productId)
                if (existingItem) {
                    existingItem.quantity += action.payload.quantity
                } else {
                    state.cart.push(action.payload)
                }
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                const item = state.cart.find(item => item.productId === action.payload.productId)
                if (item) {
                    item.quantity = action.payload.quantity
                }
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.cart = state.cart.filter(item => item.productId !== action.payload)
            })
            .addCase(clearCart.fulfilled, (state) => {
                state.cart = []
            })

        // Orders
        builder
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.orders = action.payload
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.orders.unshift(action.payload)
                state.cart = [] // Clear cart after successful order
            })

        // Reviews
        builder
            .addCase(fetchProductReviews.fulfilled, (state, action) => {
                state.reviews = action.payload
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.reviews.push(action.payload)
            })

        // Sellers
        builder
            .addCase(fetchSellers.fulfilled, (state, action) => {
                state.sellers = action.payload
            })
    }
})

export const {
    setFilters,
    clearFilters,
    clearError,
    updateCartItemQuantity,
    removeCartItem
} = marketplaceSlice.actions

export default marketplaceSlice.reducer
