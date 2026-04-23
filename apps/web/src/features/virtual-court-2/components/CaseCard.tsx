import React from 'react'
import { Card, CardActionArea, CardContent, Chip, Stack, Typography, Box } from '@mui/material'
import GavelIcon from '@mui/icons-material/Gavel'
import type { LegalCase } from '../types'
import { courtLevelLabel, judgeModeLabel, statusColor, statusLabel, trackLabel } from '../utils/labels'

interface Props {
  legalCase: LegalCase
  onOpen: (id: string) => void
}

export const CaseCard: React.FC<Props> = ({ legalCase, onOpen }) => {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardActionArea onClick={() => onOpen(legalCase.id)} sx={{ height: '100%' }}>
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
            <GavelIcon fontSize="small" color="primary" />
            <Typography variant="caption" color="text.secondary">
              {legalCase.caseNumber}
            </Typography>
            <Box flex={1} />
            <Chip size="small" label={statusLabel[legalCase.status]} color={statusColor[legalCase.status]} />
          </Stack>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            {legalCase.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
            {legalCase.summary}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip size="small" variant="outlined" label={`ערכאה: ${courtLevelLabel[legalCase.level]}`} />
            <Chip size="small" variant="outlined" label={`מסלול: ${trackLabel[legalCase.track]}`} />
            <Chip size="small" variant="outlined" label={judgeModeLabel[legalCase.judgeMode]} />
            <Chip
              size="small"
              variant="outlined"
              label={`משתתפים: ${legalCase.participants.length}`}
            />
            <Chip
              size="small"
              variant="outlined"
              label={`דיונים: ${legalCase.hearings.length}`}
            />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
