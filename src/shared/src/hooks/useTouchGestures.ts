import { useEffect, useRef, useCallback, useState } from 'react'

export interface TouchGestureConfig {
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    onSwipeUp?: () => void
    onSwipeDown?: () => void
    onPinchIn?: (scale: number) => void
    onPinchOut?: (scale: number) => void
    onLongPress?: () => void
    onDoubleTap?: () => void
    onPullToRefresh?: () => void
    swipeThreshold?: number
    longPressDelay?: number
    doubleTapDelay?: number
    pullToRefreshThreshold?: number
    enabled?: boolean
}

export interface TouchState {
    startX: number
    startY: number
    currentX: number
    currentY: number
    startTime: number
    isLongPress: boolean
    isDoubleTap: boolean
    lastTapTime: number
    touchCount: number
    initialDistance: number
    currentDistance: number
    isPinching: boolean
}

export const useTouchGestures = (config: TouchGestureConfig = {}) => {
    const {
        onSwipeLeft,
        onSwipeRight,
        onSwipeUp,
        onSwipeDown,
        onPinchIn,
        onPinchOut,
        onLongPress,
        onDoubleTap,
        onPullToRefresh,
        swipeThreshold = 50,
        longPressDelay = 500,
        doubleTapDelay = 300,
        pullToRefreshThreshold = 100,
        enabled = true,
    } = config

    const [touchState, setTouchState] = useState<TouchState>({
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        startTime: 0,
        isLongPress: false,
        isDoubleTap: false,
        lastTapTime: 0,
        touchCount: 0,
        initialDistance: 0,
        currentDistance: 0,
        isPinching: false,
    })

    const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
    const elementRef = useRef<HTMLDivElement | null>(null)

    // Calculate distance between two touch points
    const getDistance = useCallback((touch1: Touch, touch2: Touch) => {
        const dx = touch1.clientX - touch2.clientX
        const dy = touch1.clientY - touch2.clientY
        return Math.sqrt(dx * dx + dy * dy)
    }, [])

    // Calculate center point between two touches
    const getCenter = useCallback((touch1: Touch, touch2: Touch) => {
        return {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2,
        }
    }, [])

    // Handle touch start
    const handleTouchStart = useCallback((e: TouchEvent) => {
        if (!enabled) return

        const touch = e.touches[0]
        const now = Date.now()

        setTouchState(prev => ({
            ...prev,
            startX: touch.clientX,
            startY: touch.clientY,
            currentX: touch.clientX,
            currentY: touch.clientY,
            startTime: now,
            touchCount: e.touches.length,
        }))

        // Handle pinch gesture
        if (e.touches.length === 2) {
            const distance = getDistance(e.touches[0], e.touches[1])
            setTouchState(prev => ({
                ...prev,
                initialDistance: distance,
                currentDistance: distance,
                isPinching: true,
            }))
        }

        // Start long press timer
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current)
        }

        longPressTimerRef.current = setTimeout(() => {
            if (onLongPress) {
                onLongPress()
                setTouchState(prev => ({ ...prev, isLongPress: true }))
            }
        }, longPressDelay)
    }, [enabled, onLongPress, longPressDelay, getDistance])

    // Handle touch move
    const handleTouchMove = useCallback((e: TouchEvent) => {
        if (!enabled) return

        const touch = e.touches[0]
        const now = Date.now()

        setTouchState(prev => ({
            ...prev,
            currentX: touch.clientX,
            currentY: touch.clientY,
        }))

        // Handle pinch gesture
        if (e.touches.length === 2 && touchState.isPinching) {
            const distance = getDistance(e.touches[0], e.touches[1])
            const scale = distance / touchState.initialDistance

            setTouchState(prev => ({
                ...prev,
                currentDistance: distance,
            }))

            if (scale < 0.8 && onPinchIn) {
                onPinchIn(scale)
            } else if (scale > 1.2 && onPinchOut) {
                onPinchOut(scale)
            }
        }

        // Handle pull to refresh
        if (e.touches.length === 1 && onPullToRefresh) {
            const deltaY = touch.clientY - touchState.startY
            if (deltaY > pullToRefreshThreshold && touchState.startY < 100) {
                onPullToRefresh()
            }
        }
    }, [enabled, touchState, onPinchIn, onPinchOut, onPullToRefresh, pullToRefreshThreshold, getDistance])

    // Handle touch end
    const handleTouchEnd = useCallback((e: TouchEvent) => {
        if (!enabled) return

        const now = Date.now()
        const deltaX = touchState.currentX - touchState.startX
        const deltaY = touchState.currentY - touchState.startY
        const deltaTime = now - touchState.startTime

        // Clear long press timer
        if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current)
            longPressTimerRef.current = null
        }

        // Handle swipe gestures
        if (Math.abs(deltaX) > swipeThreshold || Math.abs(deltaY) > swipeThreshold) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 0 && onSwipeRight) {
                    onSwipeRight()
                } else if (deltaX < 0 && onSwipeLeft) {
                    onSwipeLeft()
                }
            } else {
                // Vertical swipe
                if (deltaY > 0 && onSwipeDown) {
                    onSwipeDown()
                } else if (deltaY < 0 && onSwipeUp) {
                    onSwipeUp()
                }
            }
        }

        // Handle double tap
        if (deltaTime < 200 && !touchState.isLongPress) {
            const timeSinceLastTap = now - touchState.lastTapTime
            if (timeSinceLastTap < doubleTapDelay && onDoubleTap) {
                onDoubleTap()
                setTouchState(prev => ({ ...prev, isDoubleTap: true }))
            }
            setTouchState(prev => ({ ...prev, lastTapTime: now }))
        }

        // Reset pinch state
        if (e.touches.length < 2) {
            setTouchState(prev => ({
                ...prev,
                isPinching: false,
                initialDistance: 0,
                currentDistance: 0,
            }))
        }

        // Reset long press state
        setTouchState(prev => ({
            ...prev,
            isLongPress: false,
            isDoubleTap: false,
        }))
    }, [
        enabled,
        touchState,
        swipeThreshold,
        doubleTapDelay,
        onSwipeLeft,
        onSwipeRight,
        onSwipeUp,
        onSwipeDown,
        onDoubleTap,
    ])

    // Attach event listeners
    useEffect(() => {
        const element = elementRef.current
        if (!element || !enabled) return

        element.addEventListener('touchstart', handleTouchStart, { passive: false })
        element.addEventListener('touchmove', handleTouchMove, { passive: false })
        element.addEventListener('touchend', handleTouchEnd, { passive: false })

        return () => {
            element.removeEventListener('touchstart', handleTouchStart)
            element.removeEventListener('touchmove', handleTouchMove)
            element.removeEventListener('touchend', handleTouchEnd)
        }
    }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (longPressTimerRef.current) {
                clearTimeout(longPressTimerRef.current)
            }
        }
    }, [])

    return {
        elementRef,
        touchState,
    }
}
