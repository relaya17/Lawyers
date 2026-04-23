import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const DEMO_ROWS = [
  { rank: 1, name: 'דמו — עו״ד א׳', score: 920, cases: 12 },
  { rank: 2, name: 'דמו — סטודנט ב׳', score: 885, cases: 11 },
  { rank: 3, name: 'דמו — מתרגל ג׳', score: 840, cases: 10 },
  { rank: 4, name: 'דמו — משתמש ד׳', score: 790, cases: 9 },
  { rank: 5, name: 'דמו — אורח ה׳', score: 720, cases: 8 },
]

export const VirtualCourtRankingsPage: React.FC = () => {
  return (
    <Box sx={{ py: 1, maxWidth: 720, mx: 'auto' }}>
      <Button
        component={RouterLink}
        to="/virtual-court"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        חזרה לבית המשפט הווירטואלי
      </Button>
      <Typography variant="h5" component="h1" gutterBottom>
        דירוג תרגול (דמו)
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        הנתונים להמחשה בלבד. בעתיד ניתן לחבר לשירות ציונים ולמשתמש מחובר.
      </Typography>
      <Chip label="מצב הדגמה" size="small" color="default" sx={{ mb: 2 }} />
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>מיקום</TableCell>
              <TableCell>שם</TableCell>
              <TableCell align="right">ציון</TableCell>
              <TableCell align="right">מקרים</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {DEMO_ROWS.map((row) => (
              <TableRow key={row.rank}>
                <TableCell>{row.rank}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell align="right">{row.score}</TableCell>
                <TableCell align="right">{row.cases}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
