/**
 * useTrackAnswer — hook קל לשימוש להזרקה בכל קומפוננט בחינה/משחק
 *
 * שימוש:
 *   const { trackAnswer, userId } = useTrackAnswer()
 *   await trackAnswer({ questionId: q.id, topic: 'דיני חוזים', subTopic: 'הפרת חוזה', correct: true, source: 'contracts-exam' })
 */
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store'
import { useSessionAuth } from '@/features/auth/providers/SessionAuthProvider'
import { recordQuestionUsage } from '@/features/billing/api/billingHttp'
import { useUserProgressStore } from '../store/useUserProgressStore'

export type TrackAnswerResult =
  | { ok: true }
  | { ok: false; dailyLimitReached: true }

interface TrackPayload {
  questionId: string
  topic: string
  subTopic?: string
  correct: boolean
  source: string
}

export function useTrackAnswer() {
  const user = useSelector((s: RootState) => s.auth?.user)
  const { accessToken } = useSessionAuth()
  const trackAnswer = useUserProgressStore(s => s.trackAnswer)

  const track = useCallback(
    async (payload: TrackPayload): Promise<TrackAnswerResult> => {
      if (!user?.id) return { ok: true }

      if (accessToken) {
        try {
          await recordQuestionUsage(accessToken)
        } catch (e) {
          const err = e as { status?: number }
          if (err.status === 429) {
            return { ok: false, dailyLimitReached: true }
          }
        }
      }

      trackAnswer(
        user.id,
        `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email,
        {
          questionId: payload.questionId,
          topic: payload.topic,
          subTopic: payload.subTopic ?? 'כללי',
          correct: payload.correct,
          source: payload.source,
        },
      )
      return { ok: true }
    },
    [user, accessToken, trackAnswer],
  )

  return { trackAnswer: track, userId: user?.id ?? null, isLoggedIn: !!user?.id }
}
