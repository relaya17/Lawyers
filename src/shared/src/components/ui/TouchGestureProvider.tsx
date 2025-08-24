import React, { createContext, useContext, useCallback, ReactNode } from 'react'
import { useTouchGestures, TouchGestureConfig } from '@shared/hooks/useTouchGestures'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Snackbar, Alert } from '@mui/material'

interface TouchGestureContextType {
  showGestureFeedback: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void
}

const TouchGestureContext = createContext<TouchGestureContextType | null>(null)

export const useTouchGestureContext = () => {
  const context = useContext(TouchGestureContext)
  if (!context) {
    throw new Error('useTouchGestureContext must be used within TouchGestureProvider')
  }
  return context
}

interface TouchGestureProviderProps {
  children: ReactNode
}

export const TouchGestureProvider: React.FC<TouchGestureProviderProps> = ({ children }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [feedback, setFeedback] = React.useState<{
    message: string
    type: 'success' | 'info' | 'warning' | 'error'
    open: boolean
  }>({
    message: '',
    type: 'info',
    open: false,
  })

  const showGestureFeedback = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error') => {
    setFeedback({ message, type, open: true })
  }, [])

  // Handle swipe left - go back
  const handleSwipeLeft = useCallback(() => {
    navigate(-1)
    showGestureFeedback('חזרה לדף הקודם', 'info')
  }, [navigate, showGestureFeedback])

  // Handle swipe right - go forward
  const handleSwipeRight = useCallback(() => {
    navigate(1)
    showGestureFeedback('מעבר לדף הבא', 'info')
  }, [navigate, showGestureFeedback])

  // Handle swipe up - scroll to top
  const handleSwipeUp = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    showGestureFeedback('גלילה לראש העמוד', 'info')
  }, [showGestureFeedback])

  // Handle swipe down - scroll to bottom
  const handleSwipeDown = useCallback(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    showGestureFeedback('גלילה לתחתית העמוד', 'info')
  }, [showGestureFeedback])

  // Handle pinch in - zoom out
  const handlePinchIn = useCallback((scale: number) => {
    // Implement zoom out functionality
    showGestureFeedback(`הקטנה (${Math.round(scale * 100)}%)`, 'info')
  }, [showGestureFeedback])

  // Handle pinch out - zoom in
  const handlePinchOut = useCallback((scale: number) => {
    // Implement zoom in functionality
    showGestureFeedback(`הגדלה (${Math.round(scale * 100)}%)`, 'info')
  }, [showGestureFeedback])

  // Handle long press - context menu
  const handleLongPress = useCallback(() => {
    showGestureFeedback('תפריט הקשר', 'info')
  }, [showGestureFeedback])

  // Handle double tap - quick action
  const handleDoubleTap = useCallback(() => {
    showGestureFeedback('פעולה מהירה', 'success')
  }, [showGestureFeedback])

  // Handle pull to refresh
  const handlePullToRefresh = useCallback(() => {
    window.location.reload()
    showGestureFeedback('רענון העמוד', 'success')
  }, [showGestureFeedback])

  const gestureConfig: TouchGestureConfig = {
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    onSwipeUp: handleSwipeUp,
    onSwipeDown: handleSwipeDown,
    onPinchIn: handlePinchIn,
    onPinchOut: handlePinchOut,
    onLongPress: handleLongPress,
    onDoubleTap: handleDoubleTap,
    onPullToRefresh: handlePullToRefresh,
    swipeThreshold: 50,
    longPressDelay: 500,
    doubleTapDelay: 300,
    pullToRefreshThreshold: 100,
    enabled: true,
  }

  const { elementRef } = useTouchGestures(gestureConfig)

  const handleCloseFeedback = () => {
    setFeedback(prev => ({ ...prev, open: false }))
  }

  return (
    <TouchGestureContext.Provider value={{ showGestureFeedback }}>
      <div
        ref={elementRef}
        style={{
          minHeight: '100vh',
          touchAction: 'manipulation', // Optimize for touch
          WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        }}
      >
        {children}
      </div>
      
      <Snackbar
        open={feedback.open}
        autoHideDuration={2000}
        onClose={handleCloseFeedback}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseFeedback} severity={feedback.type} sx={{ width: '100%' }}>
          {feedback.message}
        </Alert>
      </Snackbar>
    </TouchGestureContext.Provider>
  )
}
