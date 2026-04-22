import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  Chip,
  TextField,
  Alert,
  Divider,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Lightbulb as LightbulbIcon,
  NavigateNext as NextIcon,
  Refresh as RefreshIcon,
  EmojiEvents as TrophyIcon,
  School as SchoolIcon,
  Gavel as GavelIcon,
} from '@mui/icons-material';
import { practiceQuestions, PracticeQuestion } from '../../data/practiceQuestions';

interface PracticeSessionProps {
  subject?: string;
}

const DIFFICULTY_LABEL: Record<string, string> = { easy: 'קל', medium: 'בינוני', hard: 'קשה' };
const DIFFICULTY_COLOR: Record<string, string> = { easy: '#4caf50', medium: '#ff9800', hard: '#f44336' };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function scoreColor(pct: number): string {
  if (pct >= 80) return '#4caf50';
  if (pct >= 60) return '#ff9800';
  return '#f44336';
}

function getOptionSxHelper(
  i: number, answered: boolean,
  correctIndex: number | undefined, selectedMC: number | null
) {
  const base = { borderRadius: 1.5, p: 1.5, mb: 1 };
  if (!answered) {
    return { ...base, border: '1.5px solid #e0e0e0', cursor: 'pointer', transition: 'all 0.2s',
      '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' } };
  }
  if (i === correctIndex) return { ...base, border: '2px solid #4caf50', bgcolor: '#e8f5e9' };
  if (i === selectedMC) return { ...base, border: '2px solid #f44336', bgcolor: '#ffebee' };
  return { ...base, border: '1.5px solid #e0e0e0' };
}

function getOptionIconHelper(
  i: number, answered: boolean,
  correctIndex: number | undefined, selectedMC: number | null
): React.ReactElement | null {
  if (!answered) return null;
  if (i === correctIndex) return <CheckCircleIcon sx={{ color: '#4caf50', ml: 1 }} fontSize="small" />;
  if (i === selectedMC) return <CancelIcon sx={{ color: '#f44336', ml: 1 }} fontSize="small" />;
  return null;
}

function calcIsWrong(answered: boolean, type: string, mcCorrect: boolean, tfCorrect: boolean): boolean {
  if (!answered) return false;
  if (type === 'mc') return !mcCorrect;
  if (type === 'tf') return !tfCorrect;
  return false;
}

interface TFOptionProps {
  val: boolean;
  answered: boolean;
  isCorrectVal: boolean;
  isSelectedVal: boolean;
  onSelect: () => void;
}

const TFOption: React.FC<TFOptionProps> = ({ val, answered, isCorrectVal, isSelectedVal, onSelect }) => {
  let bgcolor = 'background.paper';
  let borderColor = '#e0e0e0';
  if (answered && isCorrectVal) { bgcolor = '#e8f5e9'; borderColor = '#4caf50'; }
  else if (answered && isSelectedVal) { bgcolor = '#ffebee'; borderColor = '#f44336'; }
  return (
    <Paper onClick={onSelect} elevation={2}
      sx={{ flex: 1, p: 2, textAlign: 'center', cursor: answered ? 'default' : 'pointer',
        border: `2px solid ${borderColor}`, bgcolor, transition: 'all 0.2s',
        '&:hover': answered ? {} : { borderColor: 'primary.main', transform: 'scale(1.02)' } }}>
      <Typography variant="h5">{val ? '✅ אמת' : '❌ שקר'}</Typography>
      {answered && isCorrectVal && <CheckCircleIcon sx={{ color: '#4caf50', mt: 0.5 }} />}
      {answered && isSelectedVal && !isCorrectVal && <CancelIcon sx={{ color: '#f44336', mt: 0.5 }} />}
    </Paper>
  );
};

interface DoneScreenProps {
  correct: number;
  wrong: number;
  onRestart: () => void;
  onReviewWrong: () => void;
}

const DoneScreen: React.FC<DoneScreenProps> = ({ correct, wrong, onRestart, onReviewWrong }) => {
  const total = correct + wrong;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const color = scoreColor(pct);
  return (
    <Box sx={{ maxWidth: 560, mx: 'auto', p: 3 }}>
      <Card elevation={4}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <TrophyIcon sx={{ fontSize: 80, color: pct >= 70 ? '#ffc107' : '#9e9e9e', mb: 2 }} />
          <Typography variant="h4" gutterBottom color="primary">סיום התרגול!</Typography>
          <Typography variant="h2" fontWeight="bold" sx={{ color }}>{pct}%</Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {correct} נכונות מתוך {total} שאלות
          </Typography>
          <Grid container spacing={2} sx={{ my: 2 }}>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, bgcolor: '#e8f5e9', textAlign: 'center' }}>
                <CheckCircleIcon color="success" />
                <Typography fontWeight="bold">{correct}</Typography>
                <Typography variant="body2">נכון</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper sx={{ p: 2, bgcolor: '#ffebee', textAlign: 'center' }}>
                <CancelIcon color="error" />
                <Typography fontWeight="bold">{wrong}</Typography>
                <Typography variant="body2">שגוי</Typography>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3, flexWrap: 'wrap' }}>
            {wrong > 0 && (
              <Button variant="contained" color="warning" onClick={onReviewWrong} startIcon={<SchoolIcon />}>
                חזור על {wrong} שגויות
              </Button>
            )}
            <Button variant="outlined" onClick={onRestart} startIcon={<RefreshIcon />}>התחל מחדש</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export const PracticeSession: React.FC<PracticeSessionProps> = ({ subject }) => {
  const deck = useMemo<PracticeQuestion[]>(() => {
    const filtered = subject
      ? practiceQuestions.filter(q => q.subject === subject)
      : practiceQuestions;
    return shuffle(filtered);
  }, [subject]);

  const [index, setIndex] = useState(0);
  const [selectedMC, setSelectedMC] = useState<number | null>(null);
  const [selectedTF, setSelectedTF] = useState<boolean | null>(null);
  const [fillText, setFillText] = useState('');
  const [answered, setAnswered] = useState(false);
  const [fillChecked, setFillChecked] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [reviewDeck, setReviewDeck] = useState<PracticeQuestion[]>([]);

  const activeDeck = reviewDeck.length > 0 ? reviewDeck : deck;
  const currentQ = activeDeck[index];

  const progress = activeDeck.length > 0 ? (index / activeDeck.length) * 100 : 0;

  const recordResult = (correct: boolean, id: string) => {
    setScore(s => correct ? { ...s, correct: s.correct + 1 } : { ...s, wrong: s.wrong + 1 });
    if (!correct) setWrongIds(ids => [...ids, id]);
  };

  const handleSelectMC = (i: number) => {
    if (answered) return;
    setSelectedMC(i);
    setAnswered(true);
    recordResult(i === currentQ.correctIndex, currentQ.id);
  };

  const handleSelectTF = (val: boolean) => {
    if (answered) return;
    setSelectedTF(val);
    setAnswered(true);
    recordResult(val === currentQ.correctBool, currentQ.id);
  };

  const handleCheckFill = () => {
    setFillChecked(true);
    const cleaned = fillText.trim().toLowerCase();
    const variants = (currentQ.fillAnswer || '').toLowerCase().split('/').map(v => v.trim());
    const autoCorrect = variants.some(v => cleaned === v || cleaned.includes(v) || v.includes(cleaned));
    if (autoCorrect) { recordResult(true, currentQ.id); setAnswered(true); }
  };

  const handleSelfEval = (knew: boolean) => {
    recordResult(knew, currentQ.id);
    setAnswered(true);
    advance();
  };

  const advance = () => {
    const next = index + 1;
    if (next >= activeDeck.length) {
      setDone(true);
    } else {
      setIndex(next);
      setSelectedMC(null);
      setSelectedTF(null);
      setFillText('');
      setAnswered(false);
      setFillChecked(false);
    }
  };

  const restart = () => {
    setIndex(0);
    setSelectedMC(null);
    setSelectedTF(null);
    setFillText('');
    setAnswered(false);
    setFillChecked(false);
    setScore({ correct: 0, wrong: 0 });
    setWrongIds([]);
    setDone(false);
    setReviewDeck([]);
  };

  const startReviewWrong = () => {
    const wrong = practiceQuestions.filter(q => wrongIds.includes(q.id));
    setReviewDeck(shuffle(wrong));
    setIndex(0); setSelectedMC(null); setSelectedTF(null); setFillText('');
    setAnswered(false); setFillChecked(false);
    setScore({ correct: 0, wrong: 0 }); setWrongIds([]); setDone(false);
  };

  // ── Done screen ──────────────────────────────────────────────────────
  if (done) {
    return <DoneScreen correct={score.correct} wrong={score.wrong} onRestart={restart} onReviewWrong={startReviewWrong} />;
  }

  if (!currentQ) return null;

  // ── MC option styling (module-level helpers) ────────────────────────
  const getOptionSx = (i: number) => getOptionSxHelper(i, answered, currentQ.correctIndex, selectedMC);
  const getOptionIcon = (i: number) => getOptionIconHelper(i, answered, currentQ.correctIndex, selectedMC);

  const mcCorrect = answered && selectedMC === currentQ.correctIndex;
  const tfCorrect = answered && selectedTF === currentQ.correctBool;
  const isWrong = calcIsWrong(answered, currentQ.type, mcCorrect, tfCorrect);

  // ── Main question render ─────────────────────────────────────────────
  return (
    <Box sx={{ maxWidth: 680, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <GavelIcon color="primary" />
        <Typography variant="h6" fontWeight="bold" color="primary" flex={1}>
          מצב תרגול {subject ? `— ${subject}` : ''}
        </Typography>
        <Chip label={`${index + 1} / ${activeDeck.length}`} size="small" />
      </Box>

      {/* Progress */}
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 2, height: 6, borderRadius: 3 }} />

      {/* Question card */}
      <Paper elevation={3} sx={{ p: 3, mb: 2, borderTop: `4px solid ${DIFFICULTY_COLOR[currentQ.difficulty]}` }}>
        {/* Meta */}
        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Chip label={currentQ.subject} size="small" color="primary" variant="outlined" />
          <Chip label={currentQ.topic} size="small" variant="outlined" />
          <Chip
            label={DIFFICULTY_LABEL[currentQ.difficulty]}
            size="small"
            sx={{ bgcolor: DIFFICULTY_COLOR[currentQ.difficulty], color: 'white' }}
          />
        </Box>

        <Typography variant="h6" fontWeight="medium" gutterBottom>
          {currentQ.question}
        </Typography>

        {/* ── Multiple Choice ── */}
        {currentQ.type === 'mc' && (
          <Box mt={2}>
            {(currentQ.options || []).map((opt, i) => (
              <Box key={opt} sx={getOptionSx(i)} onClick={() => handleSelectMC(i)}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2">{opt}</Typography>
                  {getOptionIcon(i)}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {/* ── True / False ── */}
        {currentQ.type === 'tf' && (
          <Box display="flex" gap={2} mt={2}>
            {([true, false] as boolean[]).map(val => (
              <TFOption
                key={String(val)}
                val={val}
                answered={answered}
                isCorrectVal={val === currentQ.correctBool}
                isSelectedVal={selectedTF === val}
                onSelect={() => handleSelectTF(val)}
              />
            ))}
          </Box>
        )}

        {/* ── Fill in the blank ── */}
        {currentQ.type === 'fill' && (
          <Box mt={2}>
            <TextField
              fullWidth
              placeholder="הקלד את תשובתך כאן..."
              value={fillText}
              onChange={e => setFillText(e.target.value)}
              disabled={fillChecked}
              onKeyDown={e => { if (e.key === 'Enter' && !fillChecked && fillText.trim()) handleCheckFill(); }}
              variant="outlined"
              size="small"
              sx={{ mb: 1.5 }}
            />
            {!fillChecked && (
              <Button
                variant="contained"
                onClick={handleCheckFill}
                disabled={!fillText.trim()}
              >
                בדוק תשובה
              </Button>
            )}
            {fillChecked && (
              <Alert
                severity={answered ? 'success' : 'info'}
                icon={answered ? <CheckCircleIcon /> : <LightbulbIcon />}
                sx={{ mt: 1 }}
              >
                <Typography variant="subtitle2">
                  תשובה נכונה: <strong>{currentQ.fillAnswer}</strong>
                </Typography>
              </Alert>
            )}
          </Box>
        )}
      </Paper>

      {/* ── Feedback & Explanation ── */}
      {(answered || fillChecked) && (
        <Paper
          elevation={2}
          sx={{
            p: 2, mb: 2,
            borderRight: `4px solid ${isWrong ? '#f44336' : '#4caf50'}`,
            bgcolor: isWrong ? '#fff8f8' : '#f8fff8'
          }}
        >
          {/* Result banner (for MC/TF) */}
          {currentQ.type !== 'fill' && (
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              {isWrong
                ? <><CancelIcon color="error" /><Typography color="error" fontWeight="bold">לא נכון</Typography></>
                : <><CheckCircleIcon color="success" /><Typography color="success.main" fontWeight="bold">נכון!</Typography></>
              }
            </Box>
          )}

          <Divider sx={{ mb: 1.5 }} />

          {/* Explanation */}
          <Box display="flex" gap={1} mb={1.5}>
            <LightbulbIcon color="warning" fontSize="small" sx={{ mt: 0.3, flexShrink: 0 }} />
            <Typography variant="body2">{currentQ.explanation}</Typography>
          </Box>

          {/* Legal source */}
          {currentQ.legalSource && (
            <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 1, mb: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">
                📜 מקור חוקי: 
              </Typography>
              <Typography variant="caption" sx={{ mr: 0.5 }}>
                {currentQ.legalSource}
              </Typography>
            </Box>
          )}

          {/* Case example */}
          {currentQ.caseExample && (
            <Box sx={{ p: 1, bgcolor: '#f3e5f5', borderRadius: 1 }}>
              <Typography variant="caption" color="secondary" fontWeight="bold">
                ⚖️ דוגמה מהפסיקה: 
              </Typography>
              <Typography variant="caption" sx={{ mr: 0.5 }}>
                {currentQ.caseExample}
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* ── Navigation ── */}
      {currentQ.type === 'fill' && fillChecked && !answered && (
        // Self-evaluation buttons for fill-in
        <Box display="flex" gap={2}>
          <Button
            fullWidth variant="outlined" color="error" size="large"
            startIcon={<CancelIcon />}
            onClick={() => handleSelfEval(false)}
          >
            לא ידעתי
          </Button>
          <Button
            fullWidth variant="contained" color="success" size="large"
            startIcon={<CheckCircleIcon />}
            onClick={() => handleSelfEval(true)}
          >
            ידעתי!
          </Button>
        </Box>
      )}

      {answered && (
        <Button
          fullWidth variant="contained" size="large"
          endIcon={<NextIcon />}
          onClick={advance}
          sx={{ mt: 1 }}
        >
          {index + 1 >= activeDeck.length ? 'סיום תרגול' : 'שאלה הבאה'}
        </Button>
      )}
    </Box>
  );
};
