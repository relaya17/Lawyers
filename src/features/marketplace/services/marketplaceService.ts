import { axiosClient } from '@shared/services/api/axiosClient'
import type {
    Product,
    ProductCategory,
    ProductFilters,
    CartItem,
    Order,
    Review,
    Seller,
    PaymentDetails,
    ApplePayPaymentRequest,
    ApplePayPaymentResponse,
    ApplePaySession
} from '../types/marketplaceTypes'

export class MarketplaceService {
    // Products
    static async getProducts(filters?: ProductFilters): Promise<{ products: Product[], total: number }> {
        const response = await axiosClient.get<{ products: Product[], total: number }>('/marketplace/products', { params: filters })
        return response.data
    }

    static async getProduct(id: string): Promise<Product> {
        const response = await axiosClient.get<Product>(`/marketplace/products/${id}`)
        return response.data
    }

    static async searchProducts(query: string, filters?: ProductFilters): Promise<{ products: Product[], total: number }> {
        const response = await axiosClient.get<{ products: Product[], total: number }>('/marketplace/products/search', {
            params: { q: query, ...filters }
        })
        return response.data
    }

    static async getFeaturedProducts(): Promise<Product[]> {
        const response = await axiosClient.get<Product[]>('/marketplace/products/featured')
        return response.data
    }

    static async getPopularProducts(): Promise<Product[]> {
        const response = await axiosClient.get<Product[]>('/marketplace/products/popular')
        return response.data
    }

    // Categories
    static async getCategories(): Promise<ProductCategory[]> {
        const response = await axiosClient.get<ProductCategory[]>('/marketplace/categories')
        return response.data
    }

    static async getCategory(id: string): Promise<ProductCategory> {
        const response = await axiosClient.get<ProductCategory>(`/marketplace/categories/${id}`)
        return response.data
    }

    static async getProductsByCategory(categoryId: string, filters?: ProductFilters): Promise<{ products: Product[], total: number }> {
        const response = await axiosClient.get<{ products: Product[], total: number }>(`/marketplace/categories/${categoryId}/products`, { params: filters })
        return response.data
    }

    // Cart
    static async getCart(): Promise<CartItem[]> {
        const response = await axiosClient.get<CartItem[]>('/marketplace/cart')
        return response.data
    }

    static async addToCart(productId: string, quantity: number = 1): Promise<CartItem> {
        const response = await axiosClient.post<CartItem>('/marketplace/cart', { productId, quantity })
        return response.data
    }

    static async updateCartItem(productId: string, quantity: number): Promise<CartItem> {
        const response = await axiosClient.put<CartItem>(`/marketplace/cart/${productId}`, { quantity })
        return response.data
    }

    static async removeFromCart(productId: string): Promise<void> {
        await axiosClient.delete(`/marketplace/cart/${productId}`)
    }

    static async clearCart(): Promise<void> {
        await axiosClient.delete('/marketplace/cart')
    }

    // Orders
    static async getOrders(): Promise<Order[]> {
        const response = await axiosClient.get<Order[]>('/marketplace/orders')
        return response.data
    }

    static async getOrder(id: string): Promise<Order> {
        const response = await axiosClient.get<Order>(`/marketplace/orders/${id}`)
        return response.data
    }

    static async createOrder(cartItems: CartItem[], paymentDetails: PaymentDetails): Promise<Order> {
        const response = await axiosClient.post<Order>('/marketplace/orders', { cartItems, paymentDetails })
        return response.data
    }

    static async processPayment(orderId: string, paymentDetails: PaymentDetails): Promise<{ success: boolean, transactionId?: string }> {
        const response = await axiosClient.post<{ success: boolean, transactionId?: string }>(`/marketplace/orders/${orderId}/payment`, paymentDetails)
        return response.data
    }

    // Apple Pay specific methods
    static async validateApplePayMerchant(validationURL: string): Promise<any> {
        const response = await axiosClient.post('/marketplace/apple-pay/validate-merchant', { validationURL })
        return response.data
    }

    static async processApplePayPayment(orderId: string, applePayResponse: ApplePayPaymentResponse): Promise<{ success: boolean, transactionId?: string }> {
        const response = await axiosClient.post<{ success: boolean, transactionId?: string }>(`/marketplace/orders/${orderId}/apple-pay`, applePayResponse)
        return response.data
    }

    static async createApplePaySession(paymentRequest: ApplePayPaymentRequest): Promise<ApplePaySession> {
        // This would typically be handled by the Apple Pay JS API
        // For now, we'll return a mock implementation
        return {
            canMakePayments: () => true,
            canMakePaymentsWithActiveCard: async () => true,
            openPaymentSetup: async () => { },
            begin: () => { },
            abort: () => { },
            completeMerchantValidation: () => { },
            completePayment: () => { },
            completeShippingContactSelection: () => { },
            completeShippingMethodSelection: () => { },
            onvalidatemerchant: () => { },
            onpaymentauthorized: () => { },
            onshippingcontactselected: () => { },
            onshippingmethodselected: () => { },
            oncancel: () => { }
        }
    }

    // Reviews
    static async getProductReviews(productId: string): Promise<Review[]> {
        const response = await axiosClient.get<Review[]>(`/marketplace/products/${productId}/reviews`)
        return response.data
    }

    static async addReview(productId: string, rating: number, comment: string): Promise<Review> {
        const response = await axiosClient.post<Review>(`/marketplace/products/${productId}/reviews`, { rating, comment })
        return response.data
    }

    static async updateReview(reviewId: string, rating: number, comment: string): Promise<Review> {
        const response = await axiosClient.put<Review>(`/marketplace/reviews/${reviewId}`, { rating, comment })
        return response.data
    }

    static async deleteReview(reviewId: string): Promise<void> {
        await axiosClient.delete(`/marketplace/reviews/${reviewId}`)
    }

    // Sellers
    static async getSellers(): Promise<Seller[]> {
        const response = await axiosClient.get<Seller[]>('/marketplace/sellers')
        return response.data
    }

    static async getSeller(id: string): Promise<Seller> {
        const response = await axiosClient.get<Seller>(`/marketplace/sellers/${id}`)
        return response.data
    }

    static async getSellerProducts(sellerId: string, filters?: ProductFilters): Promise<{ products: Product[], total: number }> {
        const response = await axiosClient.get<{ products: Product[], total: number }>(`/marketplace/sellers/${sellerId}/products`, { params: filters })
        return response.data
    }

    // Purchase
    static async purchaseProduct(productId: string, paymentDetails: PaymentDetails): Promise<Order> {
        const response = await axiosClient.post<Order>('/marketplace/purchase', { productId, paymentDetails })
        return response.data
    }

    static async downloadProduct(productId: string): Promise<{ downloadUrl: string }> {
        const response = await axiosClient.get<{ downloadUrl: string }>(`/marketplace/products/${productId}/download`)
        return response.data
    }

    static async getMyPurchases(): Promise<Product[]> {
        const response = await axiosClient.get<Product[]>('/marketplace/my-purchases')
        return response.data
    }
}

export default MarketplaceService
