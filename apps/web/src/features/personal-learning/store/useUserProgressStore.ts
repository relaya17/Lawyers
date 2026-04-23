/**
 * useUserProgressStore — Zustand store עם localStorage
 * מעקב אחר כל ניסיון תשובה של משתמש מחובר, ניתוח חולשות
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── טיפוסים ─────────────────────────────────────────────────────────────────

export interface QuestionAttempt {
  id: string
  questionId: string
  topic: string        // e.g. 'דיני חוזים'
  subTopic: string     // e.g. 'הפרת חוזה'
  correct: boolean
  timestamp: number
  source: string       // שם הבחינה/המשחק שממנו הגיעה התשובה
}

export interface TopicStats {
  topic: string
  totalAttempts: number
  correct: number
  incorrect: number
  failRate: number        // 0–1 (1 = כישלון מלא)
  successRate: number     // 0–100
  lastAttempt: number
  isWeak: boolean         // failRate > 0.4 ו-totalAttempts >= 3
  recentTrend: 'improving' | 'declining' | 'stable' | 'new'
  subTopics: Record<string, { correct: number; total: number }>
}

export interface UserLearningProfile {
  userId: string
  displayName: string
  attempts: QuestionAttempt[]
  lastUpdated: number
  totalCorrect: number
  totalAttempts: number
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface ProgressState {
  profiles: Record<string, UserLearningProfile>
}

interface ProgressActions {
  /** רשום ניסיון תשובה */
  trackAnswer: (
    userId: string,
    displayName: string,
    attempt: Omit<QuestionAttempt, 'id' | 'timestamp'>,
  ) => void
  /** החזר סטטיסטיקות לפי נושא עבור משתמש */
  getTopicStats: (userId: string) => TopicStats[]
  /** רק הנושאים החלשים (failRate > 0.4, >= 3 ניסיונות) */
  getWeakTopics: (userId: string) => TopicStats[]
  /** פרופיל מלא */
  getProfile: (userId: string) => UserLearningProfile | null
  /** מחק היסטוריה */
  clearProfile: (userId: string) => void
  /** עדכון שם תצוגה */
  setDisplayName: (userId: string, name: string) => void
}

// ─── utils ────────────────────────────────────────────────────────────────────

function buildTopicStats(attempts: QuestionAttempt[]): TopicStats[] {
  const map: Record<string, {
    correct: number; total: number; timestamps: number[]
    subTopics: Record<string, { correct: number; total: number }>
  }> = {}

  for (const a of attempts) {
    if (!map[a.topic]) map[a.topic] = { correct: 0, total: 0, timestamps: [], subTopics: {} }
    map[a.topic].total++
    if (a.correct) map[a.topic].correct++
    map[a.topic].timestamps.push(a.timestamp)

    const st = a.subTopic || 'כללי'
    if (!map[a.topic].subTopics[st]) map[a.topic].subTopics[st] = { correct: 0, total: 0 }
    map[a.topic].subTopics[st].total++
    if (a.correct) map[a.topic].subTopics[st].correct++
  }

  return Object.entries(map).map(([topic, d]) => {
    const failRate = d.total > 0 ? (d.total - d.correct) / d.total : 0
    const successRate = d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0
    const sorted = [...d.timestamps].sort((a, b) => a - b)
    const half = Math.floor(sorted.length / 2)
    const lastAttempt = sorted[sorted.length - 1] ?? 0

    let recentTrend: TopicStats['recentTrend'] = 'new'
    if (d.total >= 6) {
      const firstHalfAttempts = attempts
        .filter(a => a.topic === topic)
        .sort((a, b) => a.timestamp - b.timestamp)
      const first = firstHalfAttempts.slice(0, half)
      const last = firstHalfAttempts.slice(half)
      const rateFirst = first.filter(a => a.correct).length / first.length
      const rateLast = last.filter(a => a.correct).length / last.length
      recentTrend = rateLast > rateFirst + 0.1
        ? 'improving'
        : rateLast < rateFirst - 0.1
          ? 'declining'
          : 'stable'
    }

    return {
      topic,
      totalAttempts: d.total,
      correct: d.correct,
      incorrect: d.total - d.correct,
      failRate,
      successRate,
      lastAttempt,
      isWeak: failRate > 0.4 && d.total >= 3,
      recentTrend,
      subTopics: d.subTopics,
    }
  }).sort((a, b) => b.totalAttempts - a.totalAttempts)
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useUserProgressStore = create<ProgressState & ProgressActions>()(
  persist(
    (set, get) => ({
      profiles: {},

      trackAnswer(userId, displayName, attempt) {
        const id = `${userId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
        const now = Date.now()
        set(state => {
          const prev = state.profiles[userId] ?? {
            userId, displayName, attempts: [], lastUpdated: now, totalCorrect: 0, totalAttempts: 0,
          }
          const updated: UserLearningProfile = {
            ...prev,
            displayName,
            lastUpdated: now,
            totalAttempts: prev.totalAttempts + 1,
            totalCorrect: prev.totalCorrect + (attempt.correct ? 1 : 0),
            attempts: [...prev.attempts, { ...attempt, id, timestamp: now }],
          }
          return { profiles: { ...state.profiles, [userId]: updated } }
        })
      },

      getTopicStats(userId) {
        const profile = get().profiles[userId]
        if (!profile) return []
        return buildTopicStats(profile.attempts)
      },

      getWeakTopics(userId) {
        return get().getTopicStats(userId).filter(t => t.isWeak)
      },

      getProfile(userId) {
        return get().profiles[userId] ?? null
      },

      clearProfile(userId) {
        set(state => {
          const { [userId]: _, ...rest } = state.profiles
          return { profiles: rest }
        })
      },

      setDisplayName(userId, name) {
        set(state => {
          const prev = state.profiles[userId]
          if (!prev) return state
          return { profiles: { ...state.profiles, [userId]: { ...prev, displayName: name } } }
        })
      },
    }),
    {
      name: 'lex_user_progress_v1',
    },
  ),
)
