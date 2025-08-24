import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Box, Typography, Button, Card, CardContent, TextField, Stack } from '@mui/material'

export const ContractNewPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography variant="h4" component="h1">יצירת חוזה חדש</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <Button variant="outlined" onClick={() => navigate(-1)}>ביטול</Button>
            <Button variant="contained" onClick={() => navigate('/contracts')}>שמירה</Button>
          </Stack>
        </Stack>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <TextField 
                label="כותרת החוזה" 
                fullWidth
                id="contract-title"
                name="contract-title"
                autoComplete="off"
              />
              <TextField 
                label="תיאור" 
                fullWidth 
                multiline 
                minRows={4}
                id="contract-description"
                name="contract-description"
                autoComplete="off"
              />
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  )
}

export default ContractNewPage


