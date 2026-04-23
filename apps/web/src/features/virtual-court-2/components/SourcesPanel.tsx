import React from 'react'
import { Card, CardContent, Divider, Link, List, ListItem, ListItemText, Typography } from '@mui/material'
import type { LegalCase } from '../types'

interface Props {
  legalCase: LegalCase
}

export const SourcesPanel: React.FC<Props> = ({ legalCase }) => {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" sx={{ mb: 1 }}>
          מקורות: חקיקה ופסיקה
        </Typography>

        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
          חקיקה
        </Typography>
        {legalCase.referenceStatutes.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            לא הוזנה חקיקה רלוונטית לתיק.
          </Typography>
        ) : (
          <List dense>
            {legalCase.referenceStatutes.map((s) => (
              <ListItem key={s.id} disableGutters alignItems="flex-start">
                <ListItemText
                  primary={`${s.title}${s.section ? ` — ${s.section}` : ''}`}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary" component="span">
                        {s.excerpt}
                      </Typography>
                      {s.sourceUrl && (
                        <>
                          {' · '}
                          <Link href={s.sourceUrl} target="_blank" rel="noopener noreferrer">
                            מקור
                          </Link>
                        </>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        <Divider sx={{ my: 1 }} />

        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
          פסיקה / תקדימים
        </Typography>
        {legalCase.referencePrecedents.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            לא הוזנו תקדימים לתיק.
          </Typography>
        ) : (
          <List dense>
            {legalCase.referencePrecedents.map((p) => (
              <ListItem key={p.id} disableGutters alignItems="flex-start">
                <ListItemText
                  primary={`${p.title} (${p.citation})`}
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary" component="span">
                        {p.summary}
                      </Typography>
                      <br />
                      <em>רלוונטיות: {p.relevance}</em>
                      {p.sourceUrl && (
                        <>
                          {' · '}
                          <Link href={p.sourceUrl} target="_blank" rel="noopener noreferrer">
                            מקור
                          </Link>
                        </>
                      )}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  )
}
