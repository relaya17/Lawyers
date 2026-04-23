import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Container, Box, Typography, Button, Card, CardContent, Stack } from '@mui/material'

export const ContractViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h4" component="h1">פרטי חוזה</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="outlined" onClick={() => navigate(-1)}>חזרה</Button>
            <Button variant="contained" onClick={() => navigate(`/contracts/${id}/edit`)}>עריכה</Button>
          </Stack>
        </Stack>

        <Card>
          <CardContent>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>מזהה חוזה</Typography>
            <Typography variant="h6" sx={{ mb: 3 }}>{id}</Typography>

            <Typography variant="body1" sx={{ mb: 1 }}>זהו דף תצוגה בסיסי לחוזה. ניתן להרחיב בהתאם לדרישות.</Typography>
            <Typography variant="body2" color="text.secondary">כל הלינקים הובילו לכאן בהצלחה ללא 404.</Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default ContractViewPage


