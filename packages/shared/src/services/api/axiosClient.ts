import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { apiConfig } from '@/app/config/apiConfig'
import { logger } from '../../utils/logger'

// API Response Types
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
  errors?: string[]
}

export interface PaginatedResponse<T = unknown> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// API Client Configuration
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: apiConfig.baseURL,
    timeout: apiConfig.timeoutMs,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  })

  // Request Interceptor
  client.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      // Add language header
      const language = localStorage.getItem('language') || 'he'
      config.headers['Accept-Language'] = language

      // Log request in development
      if (import.meta.env.DEV) {
        logger.debug('API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
          params: config.params,
        })
      }

      return config
    },
    (error) => {
      logger.error('Request Error:', error)
      return Promise.reject(error)
    }
  )

  // Response Interceptor
  client.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      // Log response in development
      if (import.meta.env.DEV) {
        logger.debug('API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        })
      }

      return response
    },
    (error: AxiosError<ApiResponse>) => {
      // Handle common errors
      if (error.response) {
        const { status, data } = error.response

        switch (status) {
          case 401:
            // Unauthorized - redirect to login
            localStorage.removeItem('authToken')
            window.location.href = '/login'
            break
          case 403:
            // Forbidden - show access denied message
            logger.error('Access denied:', data?.message || 'Forbidden')
            break
          case 404:
            // Not found
            logger.error('Resource not found:', data?.message || 'Not found')
            break
          case 422:
            // Validation errors
            logger.error('Validation errors:', data?.errors)
            break
          case 500:
            // Server error
            logger.error('Server error:', data?.message || 'Internal server error')
            break
          default:
            logger.error(`HTTP ${status}:`, data?.message || 'Unknown error')
        }
      } else if (error.request) {
        // Network error
        logger.error('Network error:', error.message)
      } else {
        // Other error
        logger.error('Request error:', error.message)
      }

      return Promise.reject(error)
    }
  )

  return client
}

export const axiosClient = createApiClient()

// API Client Methods
export class ApiClient {
  private client: AxiosInstance

  constructor(client: AxiosInstance = axiosClient) {
    this.client = client
  }

  // Generic GET request
  async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.get<ApiResponse<T>>(url, config)
    return response.data
  }

  // Generic POST request
  async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.post<ApiResponse<T>>(url, data, config)
    return response.data
  }

  // Generic PUT request
  async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.put<ApiResponse<T>>(url, data, config)
    return response.data
  }

  // Generic PATCH request
  async patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.patch<ApiResponse<T>>(url, data, config)
    return response.data
  }

  // Generic DELETE request
  async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.client.delete<ApiResponse<T>>(url, config)
    return response.data
  }

  // Upload file
  async upload<T = unknown>(url: string, file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.client.post<ApiResponse<T>>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    return response.data
  }

  // Download file
  async download(url: string, filename?: string): Promise<void> {
    const response = await this.client.get(url, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }

  // Paginated request
  async getPaginated<T = unknown>(
    url: string,
    page: number = 1,
    limit: number = 10,
    params?: Record<string, unknown>
  ): Promise<PaginatedResponse<T>> {
    const queryParams = {
      page,
      limit,
      ...params,
    }

    const response = await this.client.get<PaginatedResponse<T>>(url, {
      params: queryParams,
    })

    return response.data
  }
}

// Export default instance
export const apiClient = new ApiClient()

// Export for backward compatibility
export default axiosClient
