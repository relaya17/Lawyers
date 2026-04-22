import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export const VirtualCourtRankingsPage: React.FC = () => {
  const { t } = useTranslation()
  const demo = [
    { name: 'סטודנט.א', score: 120 },
    { name: 'סטודנט.ב', score: 98 },
    { name: 'סטודנט.ג', score: 76 },
  ]
  return (
    <Box sx={{ maxWidth: 640, mx: 'auto' }}>
      <Button component={RouterLink} to=".." startIcon={<ArrowBack />} sx={{ mb: 2 }}>
        {t('virtualCourtApp.headline')}
      </Button>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        {t('virtualCourtApp.rankings.title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {t('virtualCourtApp.rankings.intro')}
      </Typography>
      <Card>
        <CardContent>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('virtualCourtApp.rankings.colName')}</TableCell>
                <TableCell align="right">{t('virtualCourtApp.rankings.colScore')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {demo.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell align="right">{row.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  )
}
