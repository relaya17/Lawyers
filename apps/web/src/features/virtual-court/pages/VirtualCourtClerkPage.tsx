import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export const VirtualCourtClerkPage: React.FC = () => {
  const { t } = useTranslation()
  const rows = ['mockRow1', 'mockRow2', 'mockRow3'] as const
  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Button component={RouterLink} to=".." startIcon={<ArrowBack />} sx={{ mb: 2 }}>
        {t('virtualCourtApp.headline')}
      </Button>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {t('virtualCourtApp.clerk.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('virtualCourtApp.clerk.intro')}
      </Typography>
      <Card>
        <CardContent>
          <List dense>
            {rows.map((key) => (
              <ListItem key={key} divider>
                <ListItemText primary={t(`virtualCourtApp.clerk.${key}`)} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  )
}
