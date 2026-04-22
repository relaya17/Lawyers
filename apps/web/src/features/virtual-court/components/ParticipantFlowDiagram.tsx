import React from 'react'
import { Box, Typography, Chip, useTheme, alpha } from '@mui/material'
import { Gavel, Person, SmartToy, GroupAdd } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

const role = (
  icon: React.ReactNode,
  label: string,
  sub: string,
  color: string
) => (
  <Box
    sx={{
      flex: '1 1 140px',
      minWidth: 120,
      p: 2,
      borderRadius: 2,
      textAlign: 'center',
      border: '1px solid',
      borderColor: alpha(color, 0.4),
      bgcolor: alpha(color, 0.08),
    }}
  >
    <Box sx={{ color, mb: 0.5, display: 'flex', justifyContent: 'center' }}>{icon}</Box>
    <Typography variant="subtitle2" fontWeight={700}>
      {label}
    </Typography>
    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
      {sub}
    </Typography>
  </Box>
)

export const ParticipantFlowDiagram: React.FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          justifyContent: 'center',
          alignItems: 'stretch',
        }}
      >
        {role(
          <Person />,
          t('virtualCourtApp.diagram.plaintiff'),
          t('virtualCourtApp.diagram.plaintiffSub'),
          theme.palette.primary.main
        )}
        {role(
          <Person />,
          t('virtualCourtApp.diagram.defendant'),
          t('virtualCourtApp.diagram.defendantSub'),
          theme.palette.secondary.main
        )}
        {role(
          <SmartToy />,
          t('virtualCourtApp.diagram.judge'),
          t('virtualCourtApp.diagram.judgeSub'),
          theme.palette.error.main
        )}
        {role(
          <Gavel />,
          t('virtualCourtApp.diagram.clerk'),
          t('virtualCourtApp.diagram.clerkSub'),
          theme.palette.warning.main
        )}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Chip
          icon={<GroupAdd fontSize="small" />}
          color="info"
          label={t('virtualCourtApp.diagram.chip')}
          variant="outlined"
        />
      </Box>
    </Box>
  )
}
