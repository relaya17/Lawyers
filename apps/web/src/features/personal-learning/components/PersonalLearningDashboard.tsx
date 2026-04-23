/**
 * PersonalLearningDashboard — לוח בקרה אישי מותאם AI
 * מציג: התקדמות לפי נושא, חולשות מזוהות, שאלות חיזוק, ותובנות AI
 */
import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  AutoAwesome as AIIcon,
  CheckCircle as CorrectIcon,
  Close as CloseIcon,
  EmojiEvents as TrophyIcon,
  ExpandMore as ExpandMoreIcon,
  FitnessCenter as DrillIcon,
  Lightbulb as TipIcon,
  Psychology as BrainIcon,
  Refresh as RefreshIcon,
  Timeline as TimelineIcon,
  TrendingDown as DeclineIcon,
  TrendingUp as ImprovingIcon,
  Warning as WeakIcon,
} from '@mui/icons-material'
import type { RootState } from '../../../store'
import { useUserProgressStore, type TopicStats } from '../store/useUserProgressStore'
import { generateAIInsight, type ReinforcementQuestion } from '../services/aiProgressService'

// ─── ProgressBar מותאם ───────────────────────────────────────────────────────

function TopicBar({ stat }: { stat: TopicStats }) {
  const color =
    stat.successRate >= 70 ? 'success' : stat.successRate >= 45 ? 'warning' : 'error'
  const trendIcon =
    stat.recentTrend === 'improving' ? (
      <ImprovingIcon sx={{ fontSize: 14, color: 'success.main' }} />
    ) : stat.recentTrend === 'declining' ? (
      <DeclineIcon sx={{ fontSize: 14, color: 'error.main' }} />
    ) : null

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.5}>
        <Stack direction="row" gap={0.5} alignItems="center">
          {stat.isWeak && <WeakIcon sx={{ fontSize: 14, color: 'error.main' }} />}
          <Typography variant="body2" fontWeight={stat.isWeak ? 700 : 400}>
            {stat.topic}
          </Typography>
          {trendIcon}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {stat.successRate}% ({stat.correct}/{stat.totalAttempts})
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={stat.successRate}
        color={color}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  )
}

// ─── ReinforcementDrill dialog ───────────────────────────────────────────────

interface DrillDialogProps {
  questions: ReinforcementQuestion[]
  onClose: () => void
  onAnswered: (questionId: string, topic: string, subTopic: string, correct: boolean) => void
}

function DrillDialog({ questions, onClose, onAnswered }: DrillDialogProps) {
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = questions[idx]

  function handleConfirm() {
    if (!selected || !q) return
    const correct = selected === q.correctId
    if (correct) setScore(s => s + 1)
    onAnswered(q.id, q.topic, q.subTopic, correct)
    setConfirmed(true)
  }

  function handleNext() {
    if (idx + 1 >= questions.length) {
      setDone(true)
    } else {
      setIdx(i => i + 1)
      setSelected(null)
      setConfirmed(false)
    }
  }

  if (done) {
    return (
      <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          <TrophyIcon sx={{ fontSize: 48, color: 'warning.main' }} />
          <Typography variant="h5">סיימת את מנת החיזוק!</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h4" textAlign="center" color="primary" gutterBottom>
            {score} / {questions.length}
          </Typography>
          <Typography textAlign="center" color="text.secondary">
            {score === questions.length
              ? 'מושלם! שלטת בכל השאלות 🏆'
              : score >= questions.length / 2
                ? 'התקדמות טובה — המשך לתרגל!'
                : 'עוד קצת עבודה — אתה בדרך הנכונה!'}
          </Typography>
          <Box textAlign="center" mt={3}>
            <Button variant="contained" onClick={onClose}>
              חזור לדשבורד
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    )
  }

  if (!q) return null

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" gap={1} alignItems="center">
            <DrillIcon color="primary" />
            <Typography fontWeight={700}>שאלת חיזוק — {q.topic}</Typography>
          </Stack>
          <Stack direction="row" gap={1} alignItems="center">
            <Chip label={`${idx + 1}/${questions.length}`} size="small" />
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" fontWeight={600} mb={2}>
          {q.text}
        </Typography>
        <RadioGroup
          value={selected ?? ''}
          onChange={e => !confirmed && setSelected(e.target.value)}
        >
          {q.options.map(opt => {
            let color: 'inherit' | 'success.light' | 'error.light' = 'inherit'
            if (confirmed) {
              color = opt.id === q.correctId ? 'success.light' : opt.id === selected ? 'error.light' : 'inherit'
            }
            return (
              <FormControlLabel
                key={opt.id}
                value={opt.id}
                control={<Radio disabled={confirmed} />}
                label={opt.label}
                sx={{
                  bgcolor: color,
                  borderRadius: 1,
                  px: 1,
                  mb: 0.5,
                  transition: 'background 0.3s',
                }}
              />
            )
          })}
        </RadioGroup>

        {confirmed && (
          <Alert
            severity={selected === q.correctId ? 'success' : 'error'}
            icon={selected === q.correctId ? <CorrectIcon /> : undefined}
            sx={{ mt: 2 }}
          >
            <Typography variant="body2">{q.explanation}</Typography>
          </Alert>
        )}

        <Box textAlign="center" mt={3}>
          {!confirmed ? (
            <Button
              variant="contained"
              disabled={!selected}
              onClick={handleConfirm}
            >
              אשר תשובה
            </Button>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              {idx + 1 >= questions.length ? 'סיום' : 'שאלה הבאה'}
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

interface PersonalLearningDashboardProps {
  onNavigateToFeature?: (featureId: string) => void
}

export default function PersonalLearningDashboard({ onNavigateToFeature }: PersonalLearningDashboardProps) {
  const user = useSelector((s: RootState) => s.auth?.user)
  const userId = user?.id ?? 'guest'
  const displayName =
    `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || user?.email || 'אורח'

  const getProfile = useUserProgressStore(s => s.getProfile)
  const getTopicStats = useUserProgressStore(s => s.getTopicStats)
  const getWeakTopics = useUserProgressStore(s => s.getWeakTopics)
  const trackAnswer = useUserProgressStore(s => s.trackAnswer)
  const clearProfile = useUserProgressStore(s => s.clearProfile)

  const [drillOpen, setDrillOpen] = useState(false)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const profile = getProfile(userId)
  const topicStats = getTopicStats(userId)
  const weakTopics = getWeakTopics(userId)

  const insight = useMemo(
    () => generateAIInsight(profile, topicStats),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile?.lastUpdated, topicStats.length],
  )

  const levelColor = {
    beginner: '#ef5350',
    intermediate: '#ff9800',
    advanced: '#4caf50',
  }[insight.level]

  const levelLabel = {
    beginner: 'מתחיל',
    intermediate: 'בינוני',
    advanced: 'מתקדם',
  }[insight.level]

  function handleDrillAnswer(questionId: string, topic: string, subTopic: string, correct: boolean) {
    trackAnswer(userId, displayName, {
      questionId,
      topic,
      subTopic,
      correct,
      source: 'ai-drill',
    })
  }

  const overallRate =
    profile && profile.totalAttempts > 0
      ? Math.round((profile.totalCorrect / profile.totalAttempts) * 100)
      : 0

  return (
    <Box dir="rtl" sx={{ maxWidth: 900, mx: 'auto', p: { xs: 1, md: 3 } }}>
      {/* כותרת ופרופיל */}
      <Card
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 60%, #3949ab 100%)',
          color: 'white',
        }}
      >
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} gap={3} alignItems="center">
            <Avatar
              sx={{ width: 72, height: 72, bgcolor: levelColor, fontSize: 28, fontWeight: 700 }}
            >
              {displayName.slice(0, 1).toUpperCase()}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" fontWeight={700}>
                {displayName}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                {user?.email}
              </Typography>
              <Stack direction="row" gap={1} mt={1} flexWrap="wrap">
                <Chip
                  label={`רמה: ${levelLabel}`}
                  size="small"
                  sx={{ bgcolor: levelColor, color: 'white', fontWeight: 700 }}
                />
                <Chip
                  label={`${profile?.totalAttempts ?? 0} שאלות`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
                <Chip
                  label={`${overallRate}% הצלחה`}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                />
              </Stack>
            </Box>
            {profile && profile.totalAttempts > 0 && (
              <Tooltip title="אפס היסטוריה">
                <IconButton
                  size="small"
                  sx={{ color: 'rgba(255,255,255,0.6)' }}
                  onClick={() => {
                    if (window.confirm('למחוק את כל ההיסטוריה שלך?')) clearProfile(userId)
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Stack direction={{ xs: 'column', md: 'row' }} gap={3}>
        {/* עמודה שמאל — AI Coach */}
        <Box flex={1} minWidth={0}>
          {/* AI Coach Panel */}
          <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
            <CardContent>
              <Stack direction="row" gap={1} alignItems="center" mb={2}>
                <AIIcon color="primary" />
                <Typography variant="h6" fontWeight={700} color="primary">
                  מאמן AI אישי
                </Typography>
              </Stack>

              <Alert severity="info" icon={<BrainIcon />} sx={{ mb: 2 }}>
                <Typography variant="body2">{insight.overallMessage}</Typography>
              </Alert>

              {insight.weakAreaMessages.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    נושאים הדורשים חיזוק:
                  </Typography>
                  <Stack gap={1}>
                    {insight.weakAreaMessages.map(w => (
                      <Card
                        key={w.topic}
                        variant="outlined"
                        sx={{ p: 1.5, bgcolor: 'error.50', borderColor: 'error.light' }}
                      >
                        <Typography variant="body2" fontWeight={700} color="error.main">
                          {w.topic}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {w.message}
                        </Typography>
                        <Stack direction="row" gap={0.5} alignItems="flex-start" mt={0.5}>
                          <TipIcon sx={{ fontSize: 14, color: 'warning.main', mt: 0.1 }} />
                          <Typography variant="caption">{w.tip}</Typography>
                        </Stack>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              {insight.strengthAreas.length > 0 && (
                <Box mb={2}>
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom>
                    נקודות חוזקה:
                  </Typography>
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    {insight.strengthAreas.map(s => (
                      <Chip
                        key={s}
                        label={s}
                        size="small"
                        color="success"
                        icon={<CorrectIcon />}
                      />
                    ))}
                  </Stack>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" gap={1} alignItems="flex-start">
                <TipIcon sx={{ color: 'warning.main', mt: 0.2, flexShrink: 0 }} />
                <Typography variant="caption" color="text.secondary" fontStyle="italic">
                  {insight.motivationalQuote}
                </Typography>
              </Stack>

              {insight.reinforcementQuestions.length > 0 && (
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<DrillIcon />}
                  onClick={() => setDrillOpen(true)}
                  sx={{ mt: 2 }}
                  color="primary"
                >
                  התחל מנת חיזוק ({insight.reinforcementQuestions.length} שאלות)
                </Button>
              )}

              {insight.nextStepLabel && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  textAlign="center"
                  mt={1}
                >
                  ➤ {insight.nextStepLabel}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* ציר זמן פעילות */}
          {profile && profile.totalAttempts > 0 && (
            <Card>
              <CardContent>
                <Stack direction="row" gap={1} alignItems="center" mb={2}>
                  <TimelineIcon color="secondary" />
                  <Typography variant="h6" fontWeight={700}>
                    פעילות אחרונה
                  </Typography>
                </Stack>
                <Stack gap={1}>
                  {[...profile.attempts]
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .slice(0, 8)
                    .map(a => (
                      <Stack
                        key={a.id}
                        direction="row"
                        gap={1}
                        alignItems="center"
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: a.correct ? 'success.50' : 'error.50',
                        }}
                      >
                        <CorrectIcon
                          sx={{
                            fontSize: 16,
                            color: a.correct ? 'success.main' : 'error.main',
                          }}
                        />
                        <Box flex={1} minWidth={0}>
                          <Typography variant="caption" noWrap>
                            {a.topic} — {a.subTopic}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                          {new Date(a.timestamp).toLocaleDateString('he-IL', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Typography>
                        <Chip
                          label={a.source}
                          size="small"
                          variant="outlined"
                          sx={{ maxWidth: 100, fontSize: 9 }}
                        />
                      </Stack>
                    ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>

        {/* עמודה ימין — סטטיסטיקות נושאים */}
        <Box flex={1} minWidth={0}>
          <Card>
            <CardContent>
              <Stack direction="row" gap={1} alignItems="center" mb={3}>
                <TrophyIcon color="warning" />
                <Typography variant="h6" fontWeight={700}>
                  התקדמות לפי נושא
                </Typography>
                <Chip label={`${topicStats.length} נושאים`} size="small" variant="outlined" />
              </Stack>

              {topicStats.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <BrainIcon sx={{ fontSize: 64, color: 'text.disabled' }} />
                  <Typography color="text.secondary" mt={2}>
                    טרם ניגשת לשאלות.
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    בחר בחינה כלשהי — הנתונים יופיעו כאן אוטומטית
                  </Typography>
                </Box>
              ) : (
                <Stack gap={2}>
                  {topicStats.map(stat => (
                    <Box key={stat.topic}>
                      <TopicBar stat={stat} />
                      {/* הרחבה — תת-נושאים */}
                      {Object.keys(stat.subTopics).length > 1 && (
                        <>
                          <Button
                            size="small"
                            endIcon={
                              <ExpandMoreIcon
                                sx={{
                                  transform: expanded[stat.topic]
                                    ? 'rotate(180deg)'
                                    : 'rotate(0deg)',
                                  transition: 'transform 0.2s',
                                }}
                              />
                            }
                            sx={{ fontSize: 11, mt: 0.5, color: 'text.secondary' }}
                            onClick={() =>
                              setExpanded(prev => ({
                                ...prev,
                                [stat.topic]: !prev[stat.topic],
                              }))
                            }
                          >
                            תת-נושאים
                          </Button>
                          {expanded[stat.topic] && (
                            <Stack gap={0.5} mt={1} pl={2}>
                              {Object.entries(stat.subTopics).map(([sub, data]) => (
                                <Stack
                                  key={sub}
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Typography variant="caption">{sub}</Typography>
                                  <Stack direction="row" gap={1} alignItems="center">
                                    <LinearProgress
                                      variant="determinate"
                                      value={
                                        data.total > 0
                                          ? Math.round((data.correct / data.total) * 100)
                                          : 0
                                      }
                                      sx={{ width: 60, height: 4, borderRadius: 2 }}
                                      color={
                                        data.total > 0 && data.correct / data.total >= 0.7
                                          ? 'success'
                                          : 'warning'
                                      }
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                      {data.correct}/{data.total}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              ))}
                            </Stack>
                          )}
                        </>
                      )}
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>

          {/* כפתורי ניווט מהיר לנושאים חלשים */}
          {weakTopics.length > 0 && onNavigateToFeature && (
            <Card sx={{ mt: 3, border: '2px solid', borderColor: 'warning.main' }}>
              <CardContent>
                <Stack direction="row" gap={1} alignItems="center" mb={2}>
                  <WeakIcon color="warning" />
                  <Typography variant="subtitle1" fontWeight={700}>
                    לחץ לחיזוק מיידי
                  </Typography>
                </Stack>
                <Stack gap={1}>
                  {weakTopics.slice(0, 3).map(t => (
                    <Button
                      key={t.topic}
                      variant="outlined"
                      color="warning"
                      fullWidth
                      startIcon={<DrillIcon />}
                      onClick={() => onNavigateToFeature('exam-manager')}
                      sx={{ justifyContent: 'flex-start' }}
                    >
                      תרגל: {t.topic} ({t.successRate}% הצלחה)
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Box>
      </Stack>

      {/* Drill Dialog */}
      {drillOpen && (
        <DrillDialog
          questions={insight.reinforcementQuestions}
          onClose={() => setDrillOpen(false)}
          onAnswered={handleDrillAnswer}
        />
      )}
    </Box>
  )
}
