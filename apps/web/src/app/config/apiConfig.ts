// API Configuration
// הגדרות API מרכזיות

export const apiConfig = {
	// Base URL for API requests
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',

	// Request timeout in milliseconds
	timeoutMs: 20000,

	// Default headers
	defaultHeaders: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},

	// Retry configuration
	retry: {
		maxAttempts: 3,
		delayMs: 1000,
		backoffMultiplier: 2,
	},

	// Cache configuration
	cache: {
		enabled: true,
		maxAge: 5 * 60 * 1000, // 5 minutes
		maxSize: 100, // Maximum number of cached responses
	},

	// Rate limiting
	rateLimit: {
		enabled: true,
		maxRequests: 100,
		windowMs: 15 * 60 * 1000, // 15 minutes
	},

	// Authentication
	auth: {
		tokenKey: 'auth_token',
		refreshTokenKey: 'refresh_token',
		autoRefresh: true,
		refreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
	},

	// Error handling
	errorHandling: {
		retryOnNetworkError: true,
		retryOnServerError: true,
		maxRetries: 3,
		showUserFriendlyErrors: true,
	},

	// Logging
	logging: {
		enabled: import.meta.env.DEV,
		level: import.meta.env.DEV ? 'debug' : 'error',
		includeRequestData: import.meta.env.DEV,
		includeResponseData: import.meta.env.DEV,
	},

	// WebSocket configuration
	websocket: {
		url: import.meta.env.VITE_WS_URL || 'ws://localhost:5174',
		reconnectAttempts: 5,
		reconnectDelay: 1000,
		heartbeatInterval: 30000,
	},

	// File upload
	upload: {
		maxFileSize: 10 * 1024 * 1024, // 10MB
		allowedTypes: ['image/*', 'application/pdf', 'text/plain'],
		chunkSize: 1024 * 1024, // 1MB chunks
		concurrentUploads: 3,
	},

	// Analytics
	analytics: {
		enabled: true,
		endpoint: '/api/analytics',
		batchSize: 10,
		flushInterval: 30000, // 30 seconds
	},

	// Feature flags
	features: {
		aiAnalysis: true,
		virtualCourt: true,
		marketplace: true,
		integrations: false,
		pwa: true,
	},
} as const

// Environment-specific configurations
export const getApiConfig = () => {
	const env = import.meta.env.MODE

	switch (env) {
		case 'development':
			return {
				...apiConfig,
				baseURL: 'http://localhost:4000',
				logging: {
					...apiConfig.logging,
					enabled: true,
					level: 'debug',
				},
			}

		case 'staging':
			return {
				...apiConfig,
				baseURL: 'https://staging-api.contractlab.ai',
				logging: {
					...apiConfig.logging,
					enabled: true,
					level: 'info',
				},
			}

		case 'production':
			return {
				...apiConfig,
				baseURL: 'https://api.contractlab.ai',
				logging: {
					...apiConfig.logging,
					enabled: false,
					level: 'error',
				},
				cache: {
					...apiConfig.cache,
					maxAge: 15 * 60 * 1000, // 15 minutes in production
				},
			}

		default:
			return apiConfig
	}
}

// Export the current configuration
export const currentApiConfig = getApiConfig()
