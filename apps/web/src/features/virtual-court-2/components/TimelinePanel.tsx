import React from 'react'
import { Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material'
import type { LegalCase } from '../types'

interface Props {
  legalCase: LegalCase
}

export const TimelinePanel: React.FC<Props> = ({ legalCase }) => {
  const events = [...legalCase.timeline].sort((a, b) => b.at.localeCompare(a.at))

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          ציר זמן התיק
        </Typography>
        {events.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            אין אירועים.
          </Typography>
        ) : (
          <List dense>
            {events.map((e) => (
              <ListItem key={e.id} divider>
                <ListItemText
                  primary={e.title}
                  secondary={`${new Date(e.at).toLocaleString('he-IL')}${e.description ? ` · ${e.description}` : ''}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}
