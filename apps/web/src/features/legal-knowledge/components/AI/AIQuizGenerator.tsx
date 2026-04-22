import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  LinearProgress,
  Alert
} from '@mui/material';
import { 
  Psychology as AIIcon,
  Settings as SettingsIcon,
  PlayArrow as StartIcon,
  Refresh as RegenerateIcon
} from '@mui/icons-material';

interface AIQuizConfig {
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
  questionTypes: QuestionType[];
  questionCount: number;
  timeLimit?: number;
  focusAreas: string[];
  userWeaknesses?: string[];
}

type QuestionType = 'multiple-choice' | 'true-false' | 'short-answer' | 'case-study';

interface GeneratedQuiz {
  id: string;
  title: string;
  questions: AIGeneratedQuestion[];
  estimatedTime: number;
  difficulty: string;
  topic: string;
  createdAt: Date;
}

interface AIGeneratedQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  legalBasis: LegalSource[];
  precedents: Precedent[];
  difficulty: number;
  aiConfidence: number;
}

interface LegalSource {
  type: 'basic-law' | 'regular-law' | 'precedent' | 'custom' | 'regulation';
  title: string;
  content: string;
  relevance: number;
}

interface Precedent {
  caseName: string;
  year: number;
  court: string;
  ruling: string;
  relevance: string;
}

const topics = [
  { id: 'laws', label: 'חוקים', icon: '📜', color: '#1976d2' },
  { id: 'precedents', label: 'פסיקה', icon: '⚖️', color: '#7b1fa2' },
  { id: 'customs', label: 'מנהגים', icon: '✨', color: '#f57c00' },
  { id: 'interpretations', label: 'פרשנויות', icon: '🔍', color: '#388e3c' },
  { id: 'constitutional', label: 'משפט חוקתי', icon: '🏛️', color: '#d32f2f' },
  { id: 'mixed', label: 'נושאים מעורבים', icon: '🧩', color: '#455a64' }
];

const questionTypeLabels = {
  'multiple-choice': 'רב ברירה',
  'true-false': 'נכון/לא נכון',
  'short-answer': 'תשובה קצרה',
  'case-study': 'מקרה לניתוח'
};

const difficultyLabels = {
  easy: 'קל',
  medium: 'בינוני', 
  hard: 'קשה',
  'very-hard': 'קשה מאוד'
};

interface AIQuizGeneratorProps {
  onQuizGenerated: (quiz: GeneratedQuiz) => void;
  userProfile?: {
    weakAreas: string[];
    preferredDifficulty: string;
    studyHistory: string[];
  };
}

export const AIQuizGenerator: React.FC<AIQuizGeneratorProps> = ({
  onQuizGenerated,
  userProfile
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [config, setConfig] = useState<AIQuizConfig>({
    topic: '',
    difficulty: 'medium',
    questionTypes: ['multiple-choice'],
    questionCount: 10,
    focusAreas: [],
    userWeaknesses: userProfile?.weakAreas || []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null);
  const [aiStatus, setAiStatus] = useState<'idle' | 'analyzing' | 'generating' | 'completed'>('idle');

  const steps = ['בחירת נושא', 'הגדרות מתקדמות', 'יצירת מבחן'];

  // סימולציית AI - יצירת מבחן
  const generateQuiz = async () => {
    setIsGenerating(true);
    setAiStatus('analyzing');
    
    // שלב 1: ניתוח פרופיל המשתמש
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAiStatus('generating');
    
    // שלב 2: יצירת שאלות
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // יצירת מבחן מדומה (בפועל יקרא ל-AI API)
    const quiz = await generateAIQuiz(config);
    
    setGeneratedQuiz(quiz);
    setAiStatus('completed');
    setIsGenerating(false);
    onQuizGenerated(quiz);
  };

  // פונקציה לסימולציית יצירת מבחן AI
  const generateAIQuiz = async (config: AIQuizConfig): Promise<GeneratedQuiz> => {
    const sampleQuestions: AIGeneratedQuestion[] = [
      {
        id: '1',
        type: 'multiple-choice',
        question: 'מה קובע חוק יסוד כבוד האדם וחירותו בנוגע לחופש הביטוי?',
        options: [
          'חופש ביטוי אינו מוגבל כלל',
          'חופש ביטוי מוגבל רק בזמן חירום',
          'חופש ביטוי יכול להיות מוגבל בחוק הולם לערכי המדינה',
          'חופש ביטוי מוגבל רק על ידי בית המשפט'
        ],
        correctAnswer: 'חופש ביטוי יכול להיות מוגבל בחוק הולם לערכי המדינה',
        explanation: 'חוק יסוד כבוד האדם וחירותו קובע שניתן להגביל זכויות יסוד, אך רק בחוק הולם לערכי המדינה, לתכלית ראויה ובמידה שאינה עולה על הנדרש.',
        legalBasis: [
          {
            type: 'basic-law',
            title: 'חוק יסוד: כבוד האדם וחירותו',
            content: 'סעיף 8: אין פוגעים בזכויות שלפי חוק יסוד זה אלא בחוק הולם לערכי מדינת ישראל',
            relevance: 95
          }
        ],
        precedents: [
          {
            caseName: 'בג"ץ 4769/95 מנחם נגד שר התחבורה',
            year: 1997,
            court: 'בית המשפט העליון',
            ruling: 'חופש הביטוי הוא זכות יסוד המוגנת חוקתית, אך ניתן להגבילה בתנאים מסוימים',
            relevance: 'קובע את המבחן לבחינת הגבלות על חופש הביטוי'
          }
        ],
        difficulty: 75,
        aiConfidence: 92
      },
      {
        id: '2',
        type: 'case-study',
        question: 'בעיר קטנה יש מנהג עתיק לחלוקת מים לפי סדר קדימות משפחתי. עיריית העיר מנסה לשנות את המערכת לפי חוק המים החדש. תושבים מתנגדים. מה יגבר?',
        correctAnswer: 'חוק המים החדש יגבר, אך יש לתת משקל למנהג בביצוע',
        explanation: 'חקיקה ברורה גוברת על מנהג, אך בתי המשפט נוטים לחפש דרכים לכבד מנהגים עתיקים במסגרת החוק החדש.',
        legalBasis: [
          {
            type: 'regular-law',
            title: 'חוק המים',
            content: 'קובע חלוקה שוויונית של מים עירוניים',
            relevance: 85
          },
          {
            type: 'custom',
            title: 'מנהג עתיק של חלוקת מים',
            content: 'מסורת של מאות שנים לחלוקת מים לפי משפחות',
            relevance: 70
          }
        ],
        precedents: [
          {
            caseName: 'ע"א 294/91 חברת קדישא גחש נגד קסטנר',
            year: 1992,
            court: 'בית המשפט העליון',
            ruling: 'מנהגים דתיים וקהילתיים זוכים להכרה, אך בכפוף לחוק',
            relevance: 'קובע את היחס בין מנהג לחקיקה'
          }
        ],
        difficulty: 85,
        aiConfidence: 88
      }
    ];

    return {
      id: Date.now().toString(),
      title: `מבחן ${topics.find(t => t.id === config.topic)?.label} - רמת ${difficultyLabels[config.difficulty]}`,
      questions: sampleQuestions.slice(0, config.questionCount),
      estimatedTime: config.questionCount * 2,
      difficulty: config.difficulty,
      topic: config.topic,
      createdAt: new Date()
    };
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      generateQuiz();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const getAIStatusMessage = () => {
    switch (aiStatus) {
      case 'analyzing':
        return 'הבינה המלאכותית מנתחת את הפרופיל שלך...';
      case 'generating':
        return 'יוצרת שאלות מותאמות אישית...';
      case 'completed':
        return 'המבחן מוכן! ✨';
      default:
        return '';
    }
  };

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 3 }}>
      <CardHeader
        avatar={
          <Box sx={{ 
            p: 2, 
            borderRadius: '50%', 
            backgroundColor: '#e3f2fd',
            animation: isGenerating ? 'pulse 2s infinite' : 'none'
          }}>
            <AIIcon sx={{ fontSize: '2rem', color: '#1976d2' }} />
          </Box>
        }
        title={
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            🤖 מחולל מבחנים בינה מלאכותית
          </Typography>
        }
        subheader="יצירת מבחנים מותאמים אישית לפי הצרכים שלך"
      />

      <CardContent>
        {/* Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* שלב 1: בחירת נושא */}
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              📚 בחר נושא ללימוד
            </Typography>
            <Grid container spacing={2}>
              {topics.map((topic) => (
                <Grid item xs={12} sm={6} md={4} key={topic.id}>
                  <Paper
                    elevation={config.topic === topic.id ? 3 : 1}
                    sx={{
                      p: 2,
                      cursor: 'pointer',
                      border: config.topic === topic.id ? `2px solid ${topic.color}` : '1px solid #e0e0e0',
                      backgroundColor: config.topic === topic.id ? `${topic.color}10` : 'white',
                      '&:hover': { 
                        backgroundColor: `${topic.color}05`,
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease'
                      }
                    }}
                    onClick={() => setConfig(prev => ({ ...prev, topic: topic.id }))}
                  >
                    <Box textAlign="center">
                      <Typography variant="h3" sx={{ mb: 1 }}>
                        {topic.icon}
                      </Typography>
                      <Typography variant="h6" sx={{ color: topic.color }}>
                        {topic.label}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* המלצות AI */}
            {userProfile?.weakAreas && userProfile.weakAreas.length > 0 && (
              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  🎯 המלצת הבינה המלאכותית:
                </Typography>
                <Typography variant="body2">
                  לפי הניתוח שלך, מומלץ להתמקד ב: {userProfile.weakAreas.join(', ')}
                </Typography>
              </Alert>
            )}
          </Box>
        )}

        {/* שלב 2: הגדרות מתקדמות */}
        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              ⚙️ הגדרות מתקדמות
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>רמת קושי</InputLabel>
                  <Select
                    value={config.difficulty}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      difficulty: e.target.value as 'easy' | 'medium' | 'hard' | 'very-hard' 
                    }))}
                  >
                    {Object.entries(difficultyLabels).map(([key, label]) => (
                      <MenuItem key={key} value={key}>{label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>מספר שאלות</InputLabel>
                  <Select
                    value={config.questionCount}
                    onChange={(e) => setConfig(prev => ({ 
                      ...prev, 
                      questionCount: e.target.value as number 
                    }))}
                  >
                    <MenuItem value={5}>5 שאלות</MenuItem>
                    <MenuItem value={10}>10 שאלות</MenuItem>
                    <MenuItem value={15}>15 שאלות</MenuItem>
                    <MenuItem value={20}>20 שאלות</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  סוגי שאלות:
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {Object.entries(questionTypeLabels).map(([type, label]) => (
                    <Chip
                      key={type}
                      label={label}
                      color={config.questionTypes.includes(type as QuestionType) ? 'primary' : 'default'}
                      onClick={() => {
                        const newTypes = config.questionTypes.includes(type as QuestionType)
                          ? config.questionTypes.filter(t => t !== type)
                          : [...config.questionTypes, type as QuestionType];
                        setConfig(prev => ({ ...prev, questionTypes: newTypes }));
                      }}
                      variant={config.questionTypes.includes(type as QuestionType) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* שלב 3: יצירת מבחן */}
        {activeStep === 2 && (
          <Box textAlign="center">
            {!isGenerating && !generatedQuiz && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  🚀 מוכן ליצירת המבחן שלך?
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  הבינה המלאכותית תיצור מבחן מותאם אישית בהתאם להעדפות שלך
                </Typography>
                <Paper elevation={2} sx={{ p: 3, mt: 2, backgroundColor: '#f8f9fa' }}>
                  <Typography variant="subtitle2" gutterBottom>
                    סיכום המבחן:
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                    <Chip label={`נושא: ${topics.find(t => t.id === config.topic)?.label}`} />
                    <Chip label={`קושי: ${difficultyLabels[config.difficulty]}`} />
                    <Chip label={`${config.questionCount} שאלות`} />
                    <Chip label={`זמן משוער: ${config.questionCount * 2} דקות`} />
                  </Box>
                </Paper>
              </Box>
            )}

            {isGenerating && (
              <Box>
                <CircularProgress size={60} sx={{ mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {getAIStatusMessage()}
                </Typography>
                <LinearProgress sx={{ mt: 2, mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  הבינה המלאכותית מתאמת את השאלות לרמה שלך...
                </Typography>
              </Box>
            )}

            {generatedQuiz && (
              <Box>
                <Typography variant="h5" gutterBottom sx={{ color: '#4caf50' }}>
                  ✅ המבחן מוכן!
                </Typography>
                <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {generatedQuiz.title}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {generatedQuiz.questions.length} שאלות • זמן משוער: {generatedQuiz.estimatedTime} דקות
                  </Typography>
                  <Box display="flex" gap={1} justifyContent="center" mb={2}>
                    <Chip label="נוצר בבינה מלאכותית" color="primary" icon={<AIIcon />} />
                    <Chip label="מותאם אישית" color="success" />
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        )}

        {/* כפתורי ניווט */}
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            חזור
          </Button>
          
          <Box display="flex" gap={2}>
            {activeStep === 2 && generatedQuiz && (
              <Button
                variant="outlined"
                startIcon={<RegenerateIcon />}
                onClick={() => {
                  setGeneratedQuiz(null);
                  setAiStatus('idle');
                  generateQuiz();
                }}
              >
                צור מחדש
              </Button>
            )}
            
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={
                (activeStep === 0 && !config.topic) ||
                (activeStep === 1 && config.questionTypes.length === 0) ||
                isGenerating
              }
              startIcon={
                activeStep === steps.length - 1 ? <StartIcon /> : <SettingsIcon />
              }
            >
              {activeStep === steps.length - 1 ? 
                (generatedQuiz ? 'התחל מבחן' : 'צור מבחן') : 
                'המשך'
              }
            </Button>
          </Box>
        </Box>

        {/* אנימציית CSS */}
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      </CardContent>
    </Card>
  );
};
