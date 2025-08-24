import React, { useState, useEffect } from 'react'
import { Box, Paper, Typography, Fade, Zoom } from '@mui/material'
import {
  SwipeLeft,
  SwipeRight,
  SwipeUp,
  SwipeDown,
  ZoomIn,
  ZoomOut,
  TouchApp,
  Refresh,
} from '@mui/icons-material'

interface TouchGestureIndicatorProps {
  gesture: string
  scale?: number
  position?: { x: number; y: number }
  onComplete?: () => void
}

export const TouchGestureIndicator: React.FC<TouchGestureIndicatorProps> = ({
  gesture,
  scale = 1,
  position,
  onComplete,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => {
        onComplete?.()
      }, 300)
    }, 1000)

    return () => clearTimeout(timer)
  }, [gesture, onComplete])

  const getGestureIcon = () => {
    switch (gesture) {
      case 'swipe-left':
        return <SwipeLeft sx={{ fontSize: 48, color: 'primary.main' }} />
      case 'swipe-right':
        return <SwipeRight sx={{ fontSize: 48, color: 'primary.main' }} />
      case 'swipe-up':
        return <SwipeUp sx={{ fontSize: 48, color: 'primary.main' }} />
      case 'swipe-down':
        return <SwipeDown sx={{ fontSize: 48, color: 'primary.main' }} />
      case 'pinch-in':
        return <ZoomOut sx={{ fontSize: 48, color: 'warning.main' }} />
      case 'pinch-out':
        return <ZoomIn sx={{ fontSize: 48, color: 'warning.main' }} />
      case 'long-press':
        return <TouchApp sx={{ fontSize: 48, color: 'info.main' }} />
      case 'double-tap':
        return <TouchApp sx={{ fontSize: 48, color: 'success.main' }} />
      case 'pull-to-refresh':
        return <Refresh sx={{ fontSize: 48, color: 'secondary.main' }} />
      default:
        return <TouchApp sx={{ fontSize: 48, color: 'grey.500' }} />
    }
  }

  const getGestureText = () => {
    switch (gesture) {
      case 'swipe-left':
        return 'החלקה שמאלה'
      case 'swipe-right':
        return 'החלקה ימינה'
      case 'swipe-up':
        return 'החלקה למעלה'
      case 'swipe-down':
        return 'החלקה למטה'
      case 'pinch-in':
        return `הקטנה (${Math.round(scale * 100)}%)`
      case 'pinch-out':
        return `הגדלה (${Math.round(scale * 100)}%)`
      case 'long-press':
        return 'לחיצה ארוכה'
      case 'double-tap':
        return 'לחיצה כפולה'
      case 'pull-to-refresh':
        return 'משוך לרענון'
      default:
        return 'מחווה לא מוכרת'
    }
  }

  const getGestureColor = () => {
    switch (gesture) {
      case 'swipe-left':
      case 'swipe-right':
      case 'swipe-up':
      case 'swipe-down':
        return 'primary.main'
      case 'pinch-in':
      case 'pinch-out':
        return 'warning.main'
      case 'long-press':
        return 'info.main'
      case 'double-tap':
        return 'success.main'
      case 'pull-to-refresh':
        return 'secondary.main'
      default:
        return 'grey.500'
    }
  }

  return (
    <Fade in={isVisible} timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          top: position?.y || '50%',
          left: position?.x || '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        <Zoom in={isVisible} timeout={300}>
          <Paper
            elevation={8}
            sx={{
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${getGestureColor()}15, ${getGestureColor()}25)`,
              border: `2px solid ${getGestureColor()}`,
              backdropFilter: 'blur(10px)',
              minWidth: 120,
              textAlign: 'center',
            }}
          >
            <Box sx={{ mb: 1 }}>
              {getGestureIcon()}
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: getGestureColor(),
                fontWeight: 'bold',
                fontSize: '0.875rem',
              }}
            >
              {getGestureText()}
            </Typography>
          </Paper>
        </Zoom>
      </Box>
    </Fade>
  )
}

// Touch Gesture Tutorial Component
interface TouchGestureTutorialProps {
  onComplete?: () => void
}

export const TouchGestureTutorial: React.FC<TouchGestureTutorialProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const tutorialSteps = [
    {
      gesture: 'swipe-left',
      title: 'החלקה שמאלה',
      description: 'החלק שמאלה כדי לחזור לדף הקודם',
      icon: <SwipeLeft sx={{ fontSize: 64, color: 'primary.main' }} />,
    },
    {
      gesture: 'swipe-right',
      title: 'החלקה ימינה',
      description: 'החלק ימינה כדי לעבור לדף הבא',
      icon: <SwipeRight sx={{ fontSize: 64, color: 'primary.main' }} />,
    },
    {
      gesture: 'pinch-out',
      title: 'הגדלה',
      description: 'הרחק את האצבעות כדי להגדיל',
      icon: <ZoomIn sx={{ fontSize: 64, color: 'warning.main' }} />,
    },
    {
      gesture: 'long-press',
      title: 'לחיצה ארוכה',
      description: 'לחץ זמן רב כדי לפתוח תפריט הקשר',
      icon: <TouchApp sx={{ fontSize: 64, color: 'info.main' }} />,
    },
    {
      gesture: 'pull-to-refresh',
      title: 'משוך לרענון',
      description: 'משוך למטה בראש העמוד כדי לרענן',
      icon: <Refresh sx={{ fontSize: 64, color: 'secondary.main' }} />,
    },
  ]

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsVisible(false)
      setTimeout(() => {
        onComplete?.()
      }, 300)
    }
  }

  const handleSkip = () => {
    setIsVisible(false)
    setTimeout(() => {
      onComplete?.()
    }, 300)
  }

  if (!isVisible) return null

  const currentTutorial = tutorialSteps[currentStep]

  return (
    <Fade in={isVisible} timeout={300}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            maxWidth: 400,
            width: '100%',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #1976d2, #42a5f5)',
            color: 'white',
          }}
        >
          <Box sx={{ mb: 3 }}>
            {currentTutorial.icon}
          </Box>
          
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
            {currentTutorial.title}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            {currentTutorial.description}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Typography
              variant="body2"
              sx={{
                cursor: 'pointer',
                textDecoration: 'underline',
                opacity: 0.8,
                '&:hover': { opacity: 1 },
              }}
              onClick={handleSkip}
            >
              דלג
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                cursor: 'pointer',
                textDecoration: 'underline',
                opacity: 0.8,
                '&:hover': { opacity: 1 },
              }}
              onClick={handleNext}
            >
              {currentStep < tutorialSteps.length - 1 ? 'הבא' : 'סיים'}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 1 }}>
            {tutorialSteps.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: index === currentStep ? 'white' : 'rgba(255, 255, 255, 0.3)',
                }}
              />
            ))}
          </Box>
        </Paper>
      </Box>
    </Fade>
  )
}
