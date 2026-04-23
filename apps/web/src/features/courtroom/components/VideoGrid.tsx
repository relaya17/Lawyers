import React from 'react'
import { Avatar, Box, Card, Chip, Grid, Stack, Typography } from '@mui/material'
import type { SessionParticipant } from '../types'
import { themeForRole } from '../theme/roleColors'

interface Props {
  participants: SessionParticipant[]
  currentSpeakerUserId?: string | null
  jitsiUrl?: string
}

/**
 * Grid של Avatars צבעוניים — מקביל לוידאו בזום.
 * Jitsi iframe מוצג מעל כשכולל URL.
 */
export const VideoGrid: React.FC<Props> = ({ participants, currentSpeakerUserId, jitsiUrl }) => {
  const active = participants.filter((p) => !p.leftAt)

  return (
    <Stack spacing={2}>
      {jitsiUrl && (
        <Box
          component="iframe"
          title="Jitsi Meet"
          src={`${jitsiUrl}#config.prejoinPageEnabled=false&config.startWithAudioMuted=false`}
          sx={{
            border: 'none',
            width: '100%',
            height: { xs: 260, md: 340 },
            borderRadius: 2,
            bgcolor: '#000',
          }}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
        />
      )}

      <Grid container spacing={1}>
        {active.map((p) => {
          const theme = themeForRole(p.role)
          const isSpeaking = currentSpeakerUserId === p.userId
          return (
            <Grid item xs={6} sm={4} md={3} key={p.userId}>
              <Card
                variant="outlined"
                sx={{
                  p: 1,
                  borderColor: isSpeaking ? theme.color : 'divider',
                  borderWidth: isSpeaking ? 3 : 1,
                  boxShadow: isSpeaking ? `0 0 0 4px ${theme.secondary}` : 'none',
                  bgcolor: theme.secondary,
                  transition: 'all .2s',
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar
                    src={p.avatarUrl}
                    sx={{ bgcolor: theme.color, width: 40, height: 40 }}
                  >
                    {p.displayName?.slice(0, 1) ?? '?'}
                  </Avatar>
                  <Box minWidth={0} flex={1}>
                    <Typography variant="body2" fontWeight={700} noWrap color={theme.color}>
                      {p.displayName}
                    </Typography>
                    <Chip
                      size="small"
                      label={theme.label}
                      sx={{
                        bgcolor: theme.color,
                        color: '#fff',
                        height: 18,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Stack>
              </Card>
            </Grid>
          )
        })}
        {active.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              טרם הצטרפו משתתפים.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Stack>
  )
}
