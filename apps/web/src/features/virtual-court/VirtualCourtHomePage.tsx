import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Container,
} from '@mui/material'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import KeyboardAltIcon from '@mui/icons-material/KeyboardAlt'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import HandshakeIcon from '@mui/icons-material/Handshake'
import { VirtualCourtroomSimulator } from '@/features/legal-knowledge/components/CourtRoom1/VirtualCourtroomSimulator'

export const VirtualCourtHomePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Stack spacing={3}>
        <Box sx={{ textAlign: 'center' }}>
          <AccountBalanceIcon sx={{ fontSize: 56, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            בית משפט וירטואלי
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640, mx: 'auto' }}>
            סימולציית אולם, פרוטוקול קלדנית ודירוג תרגול — כלים ללימוד הליך ושיקול דעת שיפוטי.
          </Typography>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          flexWrap="wrap"
          useFlexGap
        >
          <Card variant="outlined" sx={{ flex: '1 1 280px', maxWidth: { sm: 360 } }}>
            <CardContent>
              <KeyboardAltIcon color="primary" sx={{ mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                קלדנית ופרוטוקול
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                צפייה בהדמיית רישום פרוטוקול בזמן דיון מדומה.
              </Typography>
              <Button component={RouterLink} to="clerk" variant="contained" fullWidth>
                לעמוד הקלדנית
              </Button>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ flex: '1 1 280px', maxWidth: { sm: 360 } }}>
            <CardContent>
              <LeaderboardIcon color="primary" sx={{ mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                דירוג תרגול
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                טבלת הדגמה לציונים בסימולציות (נתוני דמו מקומיים).
              </Typography>
              <Button component={RouterLink} to="rankings" variant="outlined" fullWidth>
                לדירוגים
              </Button>
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ flex: '1 1 280px', maxWidth: { sm: 360 } }}>
            <CardContent>
              <HandshakeIcon color="primary" sx={{ mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                משא ומתן
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                ניהול הצעות, צ׳אט ותיעוד סבבים — מופיע כאן ובבית המשפט הווירטואלי 2, לא בשורת הניווט הכללית.
              </Typography>
              <Button component={RouterLink} to="/negotiation" variant="contained" color="secondary" fullWidth>
                לחדר המו״מ
              </Button>
            </CardContent>
          </Card>
        </Stack>

        <Box>
          <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
            סימולציית אולם — אולם 1
          </Typography>
          <VirtualCourtroomSimulator onCaseComplete={() => undefined} />
        </Box>
      </Stack>
    </Container>
  )
}
