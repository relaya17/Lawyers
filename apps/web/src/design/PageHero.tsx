/**
 * PageHero — Premium hero section used across all LexStudy pages.
 * Keeps design consistent with the homepage.
 */
import React from 'react'
import { Box, Typography, Chip, Stack } from '@mui/material'
import { gradients, MotionBox, fadeUp } from './index'

interface PageHeroProps {
  /** Main title */
  title: string
  /** Subtitle / description */
  subtitle?: string
  /** Small badge chips above the title */
  chips?: string[]
  /** Gradient override – uses hero gradient by default */
  gradient?: string
  /** Optional right-side decorative element */
  side?: React.ReactNode
  /** Optional action buttons */
  actions?: React.ReactNode
  /** Icon above title */
  icon?: React.ReactNode
}


export const PageHero: React.FC<PageHeroProps> = ({
  title,
  subtitle,
  chips,
  gradient,
  side,
  actions,
  icon,
}) => {
  return (
    <Box
      sx={{
        background: gradient ?? gradients.hero,
        borderRadius: { xs: 2, md: 3 },
        px: { xs: 3, md: 6 },
        py: { xs: 4, md: 6 },
        mb: 3,
        position: 'relative',
        overflow: 'hidden',
        color: '#fff',
      }}
    >
      {/* Decorative blobs */}
      <Box
        sx={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -40,
          left: -40,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.03)',
          pointerEvents: 'none',
        }}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ flex: 1 }}>
          {/* Icon */}
          {icon && (
            <MotionBox
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              sx={{ mb: 2, fontSize: 48, lineHeight: 1 }}
            >
              {icon}
            </MotionBox>
          )}

          {/* Chips */}
          {chips && chips.length > 0 && (
            <MotionBox
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              sx={{ mb: 2 }}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {chips.map((c) => (
                  <Chip
                    key={c}
                    label={c}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: '#fff',
                      fontWeight: 600,
                      backdropFilter: 'blur(8px)',
                    }}
                  />
                ))}
              </Stack>
            </MotionBox>
          )}

          {/* Title */}
          <MotionBox
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: 800, mb: subtitle ? 1.5 : 0, lineHeight: 1.15 }}
            >
              {title}
            </Typography>
          </MotionBox>

          {/* Subtitle */}
          {subtitle && (
            <MotionBox
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
            >
              <Typography
                variant="h6"
                sx={{ opacity: 0.85, fontWeight: 400, mb: actions ? 3 : 0 }}
              >
                {subtitle}
              </Typography>
            </MotionBox>
          )}

          {/* Actions */}
          {actions && (
            <MotionBox initial="hidden" animate="visible" variants={fadeUp} custom={3}>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                {actions}
              </Stack>
            </MotionBox>
          )}
        </Box>

        {/* Side decoration */}
        {side && (
          <Box sx={{ display: { xs: 'none', md: 'block' }, flexShrink: 0 }}>
            {side}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default PageHero
