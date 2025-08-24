import React, { Component, ErrorInfo, ReactNode } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Alert, 
  Paper,
  Stack,
  Divider,

  Collapse
} from '@mui/material'
import { 
  Error as ErrorIcon, 
  Refresh, 
  Home, 
  BugReport, 
  ExpandMore, 
  ExpandLess 
} from '@mui/icons-material'


interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails: boolean
  errorId: string | null
}

export class AppErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      errorId: null
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo)
    
    // Report error to monitoring service (Sentry, LogRocket, etc.)
    this.reportError(error, errorInfo)
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo)
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // Mock error reporting - replace with actual service
    const errorReport = {
      id: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }

    // Send to error reporting service
    console.log('Error Report:', errorReport)
    
    // In production, send to actual service:
    // Sentry.captureException(error, { extra: errorReport })
    // LogRocket.captureException(error)
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      errorId: null
    })
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private handleReportBug = () => {
    const error = this.state.error
    const errorInfo = this.state.errorInfo
    
    if (!error) return

    const bugReport = `
Error Report:
ID: ${this.state.errorId}
Message: ${error.message}
Stack: ${error.stack}
Component Stack: ${errorInfo?.componentStack}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}
    `.trim()

    // Copy to clipboard
    navigator.clipboard.writeText(bugReport).then(() => {
      alert('דוח השגיאה הועתק ללוח. אנא שלח אותו לצוות התמיכה.')
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = bugReport
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('דוח השגיאה הועתק ללוח. אנא שלח אותו לצוות התמיכה.')
    })
  }

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }))
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Container maxWidth="md">
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Stack spacing={3} alignItems="center">
                <ErrorIcon color="error" sx={{ fontSize: 64 }} />
                
                <Typography variant="h4" component="h1" gutterBottom>
                  משהו השתבש
                </Typography>
                
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500 }}>
                  אירעה שגיאה לא צפויה. הצוות שלנו כבר יודע על הבעיה ועובד על פתרון.
                </Typography>

                <Alert severity="info" sx={{ width: '100%', maxWidth: 500 }}>
                  <Typography variant="body2">
                    <strong>מזהה שגיאה:</strong> {this.state.errorId}
                  </Typography>
                </Alert>

                <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<Refresh />}
                    onClick={this.handleRetry}
                  >
                    נסה שוב
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<Home />}
                    onClick={this.handleGoHome}
                  >
                    חזור לדף הבית
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<BugReport />}
                    onClick={this.handleReportBug}
                  >
                    דווח על שגיאה
                  </Button>
                </Stack>

                <Divider sx={{ width: '100%' }} />

                <Box sx={{ width: '100%' }}>
                  <Button
                    variant="text"
                    endIcon={this.state.showDetails ? <ExpandLess /> : <ExpandMore />}
                    onClick={this.toggleDetails}
                    sx={{ mb: 2 }}
                  >
                    פרטי שגיאה
                  </Button>
                  
                  <Collapse in={this.state.showDetails}>
                    <Paper variant="outlined" sx={{ p: 2, textAlign: 'left' }}>
                      <Typography variant="h6" gutterBottom>
                        פרטי השגיאה:
                      </Typography>
                      
                      <Typography variant="body2" component="pre" sx={{ 
                        whiteSpace: 'pre-wrap', 
                        fontSize: '0.75rem',
                        backgroundColor: 'grey.100',
                        p: 1,
                        borderRadius: 1,
                        overflow: 'auto',
                        maxHeight: 200
                      }}>
                        {this.state.error?.message}
                      </Typography>
                      
                      {this.state.errorInfo && (
                        <>
                          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                            Component Stack:
                          </Typography>
                          <Typography variant="body2" component="pre" sx={{ 
                            whiteSpace: 'pre-wrap', 
                            fontSize: '0.75rem',
                            backgroundColor: 'grey.100',
                            p: 1,
                            borderRadius: 1,
                            overflow: 'auto',
                            maxHeight: 200
                          }}>
                            {this.state.errorInfo.componentStack}
                          </Typography>
                        </>
                      )}
                    </Paper>
                  </Collapse>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Container>
      )
    }

    return this.props.children
  }
}

// Hook for functional components to trigger error boundary
// Note: useErrorHandler is now exported from './utils/errorBoundary'
