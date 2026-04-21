// Signature Pad Component
// רכיב חתימה דיגיטלית

import React, { useRef, useEffect, useState, useCallback } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material'
import {
  Clear,
  Download,
  Upload,
  Save,
  Undo,
  Redo,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface SignaturePadProps {
  width?: number
  height?: number
  onSave?: (signature: string) => void
  onClear?: () => void
  readOnly?: boolean
  defaultValue?: string
}

interface Point {
  x: number
  y: number
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  width = 400,
  height = 200,
  onSave,
  onClear,
  readOnly = false,
  defaultValue,
}) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])

  const getContext = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    // Set canvas properties
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = theme.palette.text.primary

    return ctx
  }, [theme.palette.text.primary])

  const getCanvasCoordinates = useCallback((event: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    let clientX: number
    let clientY: number

    if ('touches' in event) {
      clientX = event.touches[0].clientX
      clientY = event.touches[0].clientY
    } else {
      clientX = event.clientX
      clientY = event.clientY
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }, [])

  const saveState = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const imageData = canvas.toDataURL()
    setUndoStack(prev => [...prev, imageData])
    setRedoStack([])
  }, [])

  const clearCanvas = useCallback(() => {
    const ctx = getContext()
    const canvas = canvasRef.current
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    onClear?.()
  }, [getContext, onClear])

  const undo = useCallback(() => {
    if (undoStack.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = getContext()
    if (!ctx) return

    // Save current state to redo stack
    const currentState = canvas.toDataURL()
    setRedoStack(prev => [...prev, currentState])

    // Restore previous state
    const previousState = undoStack[undoStack.length - 1]
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      setHasSignature(true)
    }
    img.src = previousState

    setUndoStack(prev => prev.slice(0, -1))
  }, [undoStack, getContext])

  const redo = useCallback(() => {
    if (redoStack.length === 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = getContext()
    if (!ctx) return

    // Save current state to undo stack
    const currentState = canvas.toDataURL()
    setUndoStack(prev => [...prev, currentState])

    // Restore next state
    const nextState = redoStack[redoStack.length - 1]
    const img = new Image()
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0)
      setHasSignature(true)
    }
    img.src = nextState

    setRedoStack(prev => prev.slice(0, -1))
  }, [redoStack, getContext])

  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (readOnly) return

    event.preventDefault()
    const coords = getCanvasCoordinates(event)
    if (!coords) return

    const ctx = getContext()
    if (!ctx) return

    setIsDrawing(true)
    setHasSignature(true)
    saveState()

    ctx.beginPath()
    ctx.moveTo(coords.x, coords.y)
  }, [readOnly, getCanvasCoordinates, getContext, saveState])

  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || readOnly) return

    event.preventDefault()
    const coords = getCanvasCoordinates(event)
    if (!coords) return

    const ctx = getContext()
    if (!ctx) return

    ctx.lineTo(coords.x, coords.y)
    ctx.stroke()
  }, [isDrawing, readOnly, getCanvasCoordinates, getContext])

  const stopDrawing = useCallback(() => {
    setIsDrawing(false)
  }, [])

  const saveSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const signatureData = canvas.toDataURL('image/png')
    onSave?.(signatureData)
  }, [onSave])

  const downloadSignature = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'signature.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  const loadSignature = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = canvasRef.current
        const ctx = getContext()
        if (!canvas || !ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        setHasSignature(true)
        saveState()
      }
      img.src = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }, [getContext, saveState])

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = width
    canvas.height = height

    const ctx = getContext()
    if (!ctx) return

    // Set background
    ctx.fillStyle = theme.palette.background.paper
    ctx.fillRect(0, 0, width, height)

    // Load default value if provided
    if (defaultValue) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height)
        setHasSignature(true)
      }
      img.src = defaultValue
    }
  }, [width, height, getContext, theme.palette.background.paper, defaultValue])

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t('signature.title')}
      </Typography>
      
      <Box sx={{ position: 'relative', display: 'inline-block' }}>
        <Box
          component="canvas"
          ref={canvasRef}
          sx={{
            border: `2px dashed ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius,
            cursor: readOnly ? 'default' : 'crosshair',
            touchAction: 'none',
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {!hasSignature && !readOnly && (
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
            }}
          >
            {t('signature.placeholder')}
          </Typography>
        )}
      </Box>

      {!readOnly && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Tooltip title={t('signature.clear')}>
            <IconButton onClick={clearCanvas} color="error">
              <Clear />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('signature.undo')}>
            <IconButton onClick={undo} disabled={undoStack.length === 0}>
              <Undo />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('signature.redo')}>
            <IconButton onClick={redo} disabled={redoStack.length === 0}>
              <Redo />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('signature.download')}>
            <IconButton onClick={downloadSignature} disabled={!hasSignature}>
              <Download />
            </IconButton>
          </Tooltip>
          
          <Tooltip title={t('signature.upload')}>
            <IconButton component="label" disabled={readOnly}>
              <Upload />
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={loadSignature}
              />
            </IconButton>
          </Tooltip>
          
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={saveSignature}
            disabled={!hasSignature}
          >
            {t('signature.save')}
          </Button>
        </Box>
      )}
    </Paper>
  )
}

export default SignaturePad
