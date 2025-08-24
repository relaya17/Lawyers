import React, { useEffect, useState } from 'react'
import { Box, Snackbar, Alert } from '@mui/material'

interface AccessibilityProviderProps {
  children: React.ReactNode
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [showAccessibilityMessage, setShowAccessibilityMessage] = useState(false)
  const [accessibilityMessage, setAccessibilityMessage] = useState('')

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip to main content
      if (event.key === 'Tab' && event.altKey) {
        event.preventDefault()
        const mainContent = document.getElementById('main-content')
        if (mainContent) {
          mainContent.focus()
          setAccessibilityMessage('עברת לתוכן הראשי')
          setShowAccessibilityMessage(true)
        }
      }

      // Increase font size
      if (event.key === '+' && event.ctrlKey) {
        event.preventDefault()
        const root = document.documentElement
        const currentSize = parseFloat(getComputedStyle(root).fontSize)
        root.style.fontSize = `${Math.min(currentSize + 2, 24)}px`
        setAccessibilityMessage('הגדלת גופן')
        setShowAccessibilityMessage(true)
      }

      // Decrease font size
      if (event.key === '-' && event.ctrlKey) {
        event.preventDefault()
        const root = document.documentElement
        const currentSize = parseFloat(getComputedStyle(root).fontSize)
        root.style.fontSize = `${Math.max(currentSize - 2, 12)}px`
        setAccessibilityMessage('הקטנת גופן')
        setShowAccessibilityMessage(true)
      }

      // Reset font size
      if (event.key === '0' && event.ctrlKey) {
        event.preventDefault()
        document.documentElement.style.fontSize = '16px'
        setAccessibilityMessage('איפוס גודל גופן')
        setShowAccessibilityMessage(true)
      }

      // High contrast mode
      if (event.key === 'h' && event.ctrlKey && event.altKey) {
        event.preventDefault()
        document.body.classList.toggle('high-contrast')
        const isHighContrast = document.body.classList.contains('high-contrast')
        setAccessibilityMessage(isHighContrast ? 'מצב ניגודיות גבוהה מופעל' : 'מצב ניגודיות גבוהה כבוי')
        setShowAccessibilityMessage(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleCloseMessage = () => {
    setShowAccessibilityMessage(false)
  }

  return (
    <Box>
      {children}
      <Snackbar
        open={showAccessibilityMessage}
        autoHideDuration={3000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        role="status"
        aria-live="polite"
      >
        <Alert 
          onClose={handleCloseMessage} 
          severity="info" 
          sx={{ 
            width: '100%',
            direction: 'rtl',
            textAlign: 'right'
          }}
        >
          {accessibilityMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}
