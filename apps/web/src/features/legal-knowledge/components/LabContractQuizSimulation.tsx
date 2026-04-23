import React, { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import { CheckCircle, ErrorOutline, Quiz } from '@mui/icons-material'

export type LabContractPackId = 'rental' | 'employment' | 'sale'

type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

type Pack = {
  title: string
  subtitle: string
  questions: QuizQuestion[]
}

const PACKS: Record<LabContractPackId, Pack> = {
  rental: {
    title: 'סימולציית חוזי שכירות',
    subtitle: 'תרחישים מעשיים לחוזי שכירות בישראל',
    questions: [
      {
        id: 'r1',
        question: 'בחוזה שכירות ללא תקופת הודמה מפורשת – מהו המצב המשפטי?',
        options: [
          'השוכר רשאי לעזוב בכל עת ללא הודעה מוקדמת',
          'נדרשת הודעה סבירה לפי נוהג וחוזה, גם אם לא נכתב במפורש',
          'השוכר חייב לשלם את כל תקופת החוזה ללא יוצא מן הכלל',
          'רק בית המשפט רשאי לקבוע את תקופת ההודמה',
        ],
        correctIndex: 1,
        explanation:
          'גם כאשר לא נכתבה תקופת הודמה, נדרשת התנהגות סבירה והודעה מוקדמת בהתאם לנסיבות ולנוהג.',
      },
      {
        id: 'r2',
        question: 'מהי משמעות "שכירות מוגנת" בדירת מגורים?',
        options: [
          'השוכר רשאי לעזוב בכל עת בלי תשלום',
          'השוכר מקבל הגנות מסוימות מפני פינוי מהיר ושינוי תנאים חד-צדדיים',
          'המשכיר רשאי להעלות שכר דירה ללא הגבלה',
          'החוזה בטל אוטומטית אחרי שנה',
        ],
        correctIndex: 1,
        explanation:
          'בדירת מגורים קיימות לעיתים הגנות על השוכר; הפרטים תלויים בדין ובחוזה.',
      },
      {
        id: 'r3',
        question: 'נזק קל במקרקעין – מי אחראי בדרך כלל?',
        options: [
          'תמיד המשכיר',
          'תמיד השוכר',
          'לפי סוג הנזק והסכם: בלאי סביר לעומת רשלנות',
          'רק חברת הביטוח',
        ],
        correctIndex: 2,
        explanation:
          'חלוקת האחריות תלויה בין בלאי סביר, תחזוקה, רשלנות והוראות החוזה.',
      },
    ],
  },
  employment: {
    title: 'סימולציית הסכמי עבודה',
    subtitle: 'תנאי העסקה, שעות, פיטורים והגנות עובדים',
    questions: [
      {
        id: 'e1',
        question: 'מהו "יום עבודה מלא" לפי נוהג רגיל בישראל?',
        options: [
          '6 שעות',
          '7 שעות',
          '8 שעות (בהתאם להסכמים ולחוק)',
          '10 שעות',
        ],
        correctIndex: 2,
        explanation:
          'בדרך כלל יום עבודה מלא הוא כ־8 שעות, כפי שמקובל בהסכמים קיבוציים ובחוק.',
      },
      {
        id: 'e2',
        question: 'פיטורים שלא כדין – מה עשוי להיות הסעד?',
        options: [
          'אין סעד אפשרי',
          'שכר בלבד עד סוף החודש',
          'פיצוי או השבה לעבודה בהתאם לנסיבות',
          'רק בקשה לביטוח לאומי',
        ],
        correctIndex: 2,
        explanation:
          'במקרים מתאימים ניתן לבקש פיצוי או השבה לעבודה, בהתאם לדין ולעובדות.',
      },
      {
        id: 'e3',
        question: 'האם ניתן לוותר מראש על זכויות מזעריות מהחוק?',
        options: [
          'כן, תמיד',
          'לא, לעיתים הוראות מקנות לא ניתנות לויתור',
          'רק אם העובד חתם',
          'רק אם המעסיק הוא חברה ציבורית',
        ],
        correctIndex: 1,
        explanation:
          'זכויות מזעריות מהחוק אינן ניתנות לויתור במקרים רבים, גם בחוזה.',
      },
    ],
  },
  sale: {
    title: 'סימולציית חוזי מכר מורכבים',
    subtitle: 'מקרקעין, מוצרים, אחריות ותנאי תשלום',
    questions: [
      {
        id: 's1',
        question: 'מהי משמעות "אחריות לסתירות" במכר מקרקעין?',
        options: [
          'אחריות על עיכובים בלבד',
          'אחריות על כך שהמוכר לא יודע על זכויות של צד שלישי',
          'אחריות שהנכס חופשי מזכויות ועיקולים שלא נמסרו לקונה',
          'אחריות רק על פגמים גלויים',
        ],
        correctIndex: 2,
        explanation:
          'במכר מקרקעין נפוץ סעיף אחריות לסתירות ביחס לזכויות צדדים שלישיים.',
      },
      {
        id: 's2',
        question: 'מוצר עם פגם נסתר שנמסר לאחרונה – מהו מעמד הקונה לעיתים?',
        options: [
          'אין כל סעד',
          'רק החזר מלא מיד',
          'תיקון, החזר חלקי או הפחתת מחיר לפי דין',
          'רק תביעה פלילית',
        ],
        correctIndex: 2,
        explanation:
          'בדין החוזים והצרכנות קיימים סעדים כמו תיקון, החזר או הפחתת מחיר.',
      },
      {
        id: 's3',
        question: 'תנאי תשלום "שלבים" – מה חשוב לתעד?',
        options: [
          'רק הסכום הכולל',
          'מועדי תשלום, תלות באבני דרך והשלכות איחור',
          'רק חתימת הצדדים',
          'אין צורך בתיעוד',
        ],
        correctIndex: 1,
        explanation:
          'חשוב לתעד אבני דרך, קשר לביצוע, ועיכובים כדי למנוע מחלוקות.',
      },
    ],
  },
}

export interface LabContractQuizSimulationProps {
  packId: LabContractPackId
}

export const LabContractQuizSimulation: React.FC<LabContractQuizSimulationProps> = ({
  packId,
}) => {
  const pack = PACKS[packId]
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  const q = pack.questions[idx]
  const progress = useMemo(
    () => ((idx + (selected !== null ? 1 : 0)) / pack.questions.length) * 100,
    [idx, selected, pack.questions.length],
  )

  const onPick = (i: number) => {
    if (selected !== null) return
    setSelected(i)
    if (i === q.correctIndex) setScore((s) => s + 1)
  }

  const onNext = () => {
    if (idx + 1 < pack.questions.length) {
      setIdx((i) => i + 1)
      setSelected(null)
    } else {
      setFinished(true)
    }
  }

  const onRestart = () => {
    setIdx(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }

  if (finished) {
    const pct = Math.round((score / pack.questions.length) * 100)
    return (
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Quiz color="primary" sx={{ fontSize: 48 }} />
            <Typography variant="h6">{pack.title} — סיום</Typography>
            <Typography color="text.secondary">
              ציון: {score}/{pack.questions.length} ({pct}%)
            </Typography>
            <Button variant="contained" onClick={onRestart}>
              נסו שוב
            </Button>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
            <Typography variant="h6">{pack.title}</Typography>
            <Chip size="small" label={`שאלה ${idx + 1}/${pack.questions.length}`} />
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {pack.subtitle}
          </Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 1 }} />

          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {q.question}
          </Typography>

          <Stack spacing={1}>
            {q.options.map((opt, i) => {
              const isSel = selected === i
              const isCor = i === q.correctIndex
              const show = selected !== null
              let color: 'primary' | 'success' | 'error' | undefined
              if (show) {
                if (isCor) color = 'success'
                else if (isSel && !isCor) color = 'error'
              }
              return (
                <Button
                  key={i}
                  fullWidth
                  variant={isSel ? 'contained' : 'outlined'}
                  color={color ?? 'inherit'}
                  onClick={() => onPick(i)}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', py: 1.25 }}
                >
                  {opt}
                </Button>
              )
            })}
          </Stack>

          {selected !== null && (
            <>
              <Divider />
              <Stack direction="row" spacing={1} alignItems="flex-start">
                {selected === q.correctIndex ? (
                  <CheckCircle color="success" />
                ) : (
                  <ErrorOutline color="error" />
                )}
                <Typography variant="body2" color="text.secondary">
                  {q.explanation}
                </Typography>
              </Stack>
              <Box>
                <Button variant="contained" onClick={onNext}>
                  {idx + 1 < pack.questions.length ? 'המשך' : 'סיום'}
                </Button>
              </Box>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

/** עטיפות לרישום ב־LegalKnowledge (ללא props) */
export const LabRentalContractQuizSimulation: React.FC = () => (
  <LabContractQuizSimulation packId="rental" />
)
export const LabEmploymentContractQuizSimulation: React.FC = () => (
  <LabContractQuizSimulation packId="employment" />
)
export const LabSaleContractQuizSimulation: React.FC = () => (
  <LabContractQuizSimulation packId="sale" />
)
