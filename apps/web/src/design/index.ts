/**
 * LexStudy — Shared Design System
 * Single source of truth for motion, gradients, and page layout patterns.
 */

import { motion } from 'framer-motion'
import { Box, Card } from '@mui/material'

// ── Motion primitives ──────────────────────────────────────────────────────────
export const MotionBox = motion(Box)
export const MotionCard = motion(Card)

const easeOut = [0.22, 1, 0.36, 1] as const

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: easeOut },
  }),
}

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
}

// ── Gradient palette ───────────────────────────────────────────────────────────
export const gradients = {
  hero: 'linear-gradient(135deg, #0f0f23 0%, #1e1b4b 50%, #0c1445 100%)',
  indigo: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  sky: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  emerald: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  amber: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  rose: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
  violet: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  blue: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)',
  teal: 'linear-gradient(135deg, #009688 0%, #00796b 100%)',
  card: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
} as const

// ── Hero sx preset ─────────────────────────────────────────────────────────────
export const heroSx = {
  background: gradients.hero,
  color: '#fff',
  borderRadius: 3,
  px: { xs: 3, md: 6 },
  py: { xs: 5, md: 8 },
  mb: 4,
  position: 'relative' as const,
  overflow: 'hidden',
}

// ── Glass card sx ──────────────────────────────────────────────────────────────
export const glassCardSx = {
  background: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 2,
}

// ── Section wrapper sx ─────────────────────────────────────────────────────────
export const sectionSx = {
  mb: { xs: 4, md: 6 },
}
