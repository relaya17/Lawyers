import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
  CardContent,
  Stack,
} from '@mui/material'
import { ExpandMore, Gavel, Email, Leaderboard, School } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { ParticipantFlowDiagram } from '../components/ParticipantFlowDiagram'
import { heroSx } from '@/design'

const LevelAccordion: React.FC<{ summary: string; details: string }> = ({ summary, details }) => (
  <Accordion
    disableGutters
    elevation={0}
    sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1, bgcolor: 'background.paper' }}
  >
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Gavel color="primary" fontSize="small" />
        <Typography fontWeight={700}>{summary}</Typography>
      </Stack>
    </AccordionSummary>
    <AccordionDetails>
      <Typography variant="body2" color="text.secondary">
        {details}
      </Typography>
    </AccordionDetails>
  </Accordion>
)

export const VirtualCourtHomePage: React.FC = () => {
  const { t } = useTranslation()
  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', width: '100%' }}>
      <Box
        sx={{
          ...heroSx,
          background: 'linear-gradient(135deg, #0f0f23 0%, #1e1b4b 45%, #312e81 100%)',
          color: '#fff',
          mb: 3,
        }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 2, color: 'rgba(255,255,255,0.7)' }}>
          {t('virtualCourtApp.badge')}
        </Typography>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mt: 1, mb: 1 }}>
          {t('virtualCourtApp.headline')}
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)', mb: 2 }}>
          {t('virtualCourtApp.strapline')}
        </Typography>
        <Typography
          component="blockquote"
          variant="h6"
          sx={{
            fontStyle: 'italic',
            borderRight: '4px solid',
            borderColor: 'primary.light',
            pr: 2,
            my: 2,
            color: 'rgba(255,255,255,0.95)',
            lineHeight: 1.6,
          }}
        >
          {t('virtualCourtApp.quote')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
          {t('virtualCourtApp.intro')}
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <School color="primary" />
            <Typography variant="h6" fontWeight={700}>
              {t('virtualCourtApp.diagramTitle')}
            </Typography>
          </Stack>
          <ParticipantFlowDiagram />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {t('virtualCourtApp.inviteHint')}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            disabled
            title={String(t('virtualCourtApp.inviteSoon'))}
          >
            {t('virtualCourtApp.inviteCta')}
          </Button>
        </CardContent>
      </Card>

      <Typography variant="h6" fontWeight={700} gutterBottom>
        {t('virtualCourtApp.levelsSectionTitle')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('virtualCourtApp.levelsSub')}
      </Typography>
      <LevelAccordion summary={t('virtualCourtApp.levels.peace.title')} details={t('virtualCourtApp.levels.peace.desc')} />
      <LevelAccordion
        summary={t('virtualCourtApp.levels.district.title')}
        details={t('virtualCourtApp.levels.district.desc')}
      />
      <LevelAccordion
        summary={t('virtualCourtApp.levels.supreme.title')}
        details={t('virtualCourtApp.levels.supreme.desc')}
      />
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
        {t('virtualCourtApp.comingMultiplayer')}
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 4, mb: 2 }}>
        <Button
          component={RouterLink}
          to="clerk"
          variant="outlined"
          size="large"
          startIcon={<Email />}
          fullWidth
        >
          {t('virtualCourtApp.nav.clerk')}
        </Button>
        <Button
          component={RouterLink}
          to="rankings"
          variant="outlined"
          size="large"
          startIcon={<Leaderboard />}
          fullWidth
        >
          {t('virtualCourtApp.nav.rankings')}
        </Button>
      </Stack>
    </Box>
  )
}
