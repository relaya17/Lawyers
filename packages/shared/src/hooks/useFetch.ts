import { useState, useEffect, useCallback } from 'react'

// iOS Detection Hook
export const useIOS = () => {
    const [isIOS, setIsIOS] = useState(false)
    const [isSafari, setIsSafari] = useState(false)

    useEffect(() => {
        const userAgent = navigator.userAgent
        const isIOSDevice = /iPad|iPhone|iPod/.test(userAgent)
        const isSafariBrowser = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)

        setIsIOS(isIOSDevice)
        setIsSafari(isSafariBrowser)
    }, [])

    return { isIOS, isSafari }
}

// Mobile Detection Hook
export const useMobile = () => {
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => {
        const checkDevice = () => {
            const width = window.innerWidth
            setIsMobile(width < 768)
            setIsTablet(width >= 768 && width < 1024)
        }

        checkDevice()
        window.addEventListener('resize', checkDevice)

        return () => window.removeEventListener('resize', checkDevice)
    }, [])

    return { isMobile, isTablet }
}

// Touch Gesture Hook
export const useTouchGesture = (threshold = 50) => {
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
    const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null)

    const onTouchStart = useCallback((e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY,
        })
    }, [])

    const onTouchMove = useCallback((e: React.TouchEvent) => {
        setTouchEnd({
            x: e.targetTouches[0].clientX,
            y: e.targetTouches[0].clientY,
        })
    }, [])

    const onTouchEnd = useCallback((callbacks: {
        onSwipeLeft?: () => void
        onSwipeRight?: () => void
        onSwipeUp?: () => void
        onSwipeDown?: () => void
    }) => {
        if (!touchStart || !touchEnd) return

        const distanceX = touchStart.x - touchEnd.x
        const distanceY = touchStart.y - touchEnd.y
        const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY)
        const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX)

        if (isHorizontalSwipe && Math.abs(distanceX) > threshold) {
            if (distanceX > 0) {
                callbacks.onSwipeLeft?.()
            } else {
                callbacks.onSwipeRight?.()
            }
        }

        if (isVerticalSwipe && Math.abs(distanceY) > threshold) {
            if (distanceY > 0) {
                callbacks.onSwipeUp?.()
            } else {
                callbacks.onSwipeDown?.()
            }
        }
    }, [touchStart, touchEnd, threshold])

    return {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
    }
}

// Safe Area Hook
export const useSafeArea = () => {
    const [safeAreaInsets, setSafeAreaInsets] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    })

    useEffect(() => {
        const updateSafeArea = () => {
            const style = getComputedStyle(document.documentElement)
            setSafeAreaInsets({
                top: parseInt(style.getPropertyValue('--sat') || '0'),
                bottom: parseInt(style.getPropertyValue('--sab') || '0'),
                left: parseInt(style.getPropertyValue('--sal') || '0'),
                right: parseInt(style.getPropertyValue('--sar') || '0'),
            })
        }

        updateSafeArea()
        window.addEventListener('resize', updateSafeArea)

        return () => window.removeEventListener('resize', updateSafeArea)
    }, [])

    return safeAreaInsets
}

// Original useFetch hook
export const useFetch = <T>(url: string, options?: RequestInit) => {
    const [data, setData] = useState<T | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchData = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await fetch(url, options)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const result = await response.json()
            setData(result)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }, [url, options])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return { data, loading, error, refetch: fetchData }
}
