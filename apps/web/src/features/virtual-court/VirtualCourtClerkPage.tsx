import React, { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { VirtualCourtClerk } from '@/features/legal-knowledge/components/CourtSimulator/VirtualCourtClerk'

export const VirtualCourtClerkPage: React.FC = () => {
  const clerkSession = useMemo(
    () => ({
      id: 'virtual-court-demo',
      participants: [
        { id: 'p1', name: 'כבוד השופט', role: 'judge' as const, isActive: true },
        { id: 'p2', name: 'עו״ד התובע', role: 'prosecutor' as const, isActive: false },
        { id: 'p3', name: 'עו״ד הנתבע', role: 'lawyer' as const, isActive: false },
        { id: 'p4', name: 'עד מס׳ 1', role: 'witness' as const, isActive: false },
        { id: 'p5', name: 'סטודנט', role: 'student' as const, isActive: false },
      ],
      isRecording: false,
    }),
    []
  )

  return (
    <Box sx={{ py: 1 }}>
      <Button
        component={RouterLink}
        to="/virtual-court"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        חזרה לבית המשפט הווירטואלי
      </Button>
      <Typography variant="h5" component="h1" gutterBottom>
        קלדנית בית המשפט
      </Typography>
      <VirtualCourtClerk session={clerkSession} />
    </Box>
  )
}
