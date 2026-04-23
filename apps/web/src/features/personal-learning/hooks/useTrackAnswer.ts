/**
 * useTrackAnswer — hook קל לשימוש להזרקה בכל קומפוננט בחינה/משחק
 *
 * שימוש:
 *   const { trackAnswer, userId } = useTrackAnswer()
 *   trackAnswer({ questionId: q.id, topic: 'דיני חוזים', subTopic: 'הפרת חוזה', correct: true, source: 'contracts-exam' })
 */
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../../../store'
import { useUserProgressStore } from '../store/useUserProgressStore'

interface TrackPayload {
  questionId: string
  topic: string
  subTopic?: string
  correct: boolean
  source: string
}

export function useTrackAnswer() {
  const user = useSelector((s: RootState) => s.auth?.user)
  const trackAnswer = useUserProgressStore(s => s.trackAnswer)

  const track = useCallback(
    (payload: TrackPayload) => {
      if (!user?.id) return   // אינו מחובר — אל תרשום
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
    },
    [user, trackAnswer],
  )

  return { trackAnswer: track, userId: user?.id ?? null, isLoggedIn: !!user?.id }
}
