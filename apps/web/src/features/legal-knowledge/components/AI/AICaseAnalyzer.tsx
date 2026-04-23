import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box,
  Paper,
  Chip,
  LinearProgress,
  Alert,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar
} from '@mui/material';
import { 
  Psychology as AIIcon,
  ExpandMore as ExpandIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';

interface CaseAnalysisRequest {
  scenario: string;
  userAnswer: string;
  context: {
    topic: string;
    difficulty: string;
    userLevel: string;
  };
}

interface AIAnalysis {
  correctness: number; // 0-100
  reasoning: AnalysisReasoning;
  legalPrinciples: LegalPrinciple[];
  improvements: string[];
  strengthsIdentified: string[];
  relatedCases: RelatedCase[];
  nextSteps: string[];
  confidence: number;
  analysisTime: number;
}

interface AnalysisReasoning {
  mainPoints: string[];
  logicalFlow: string;
  legalAccuracy: string;
  practicalApplication: string;
  missingElements?: string[];
}

interface LegalPrinciple {
  name: string;
  explanation: string;
  application: string;
  importance: 'critical' | 'important' | 'supplementary';
  icon: string;
}

interface RelatedCase {
  name: string;
  year: number;
  court: string;
  relevance: string;
  keyLearning: string;
  similarity: number;
}

interface AICaseAnalyzerProps {
  caseScenario: string;
  userResponse: string;
  onAnalysisComplete: (analysis: AIAnalysis) => void;
  userProfile?: {
    level: string;
    strengths: string[];
    weaknesses: string[];
  };
}

export const AICaseAnalyzer: React.FC<AICaseAnalyzerProps> = ({
  caseScenario,
  userResponse,
  onAnalysisComplete,
  userProfile
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [analysisStage, setAnalysisStage] = useState<'thinking' | 'researching' | 'analyzing' | 'completing'>('thinking');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (userResponse && caseScenario) {
      performAIAnalysis();
    }
  }, [userResponse, caseScenario]);

  const performAIAnalysis = async () => {
    setIsAnalyzing(true);
    setProgress(0);
    
    // שלב 1: חשיבה וניתוח ראשוני
    setAnalysisStage('thinking');
    await simulateProgress(0, 25, 2000);
    
    // שלב 2: חיפוש במקורות משפטיים
    setAnalysisStage('researching');
    await simulateProgress(25, 60, 2500);
    
    // שלב 3: ניתוח מעמיק
    setAnalysisStage('analyzing');
    await simulateProgress(60, 90, 3000);
    
    // שלב 4: השלמת הניתוח
    setAnalysisStage('completing');
    await simulateProgress(90, 100, 1000);
    
    // יצירת ניתוח מדומה (בפועל יקרא ל-AI API)
    const aiAnalysis = await generateAIAnalysis();
    setAnalysis(aiAnalysis);
    setIsAnalyzing(false);
    onAnalysisComplete(aiAnalysis);
  };

  const simulateProgress = (start: number, end: number, duration: number) => {
    return new Promise<void>((resolve) => {
      const steps = 20;
      const stepDuration = duration / steps;
      const stepSize = (end - start) / steps;
      let currentProgress = start;
      
      const interval = setInterval(() => {
        currentProgress += stepSize;
        setProgress(Math.min(currentProgress, end));
        
        if (currentProgress >= end) {
          clearInterval(interval);
          resolve();
        }
      }, stepDuration);
    });
  };

  const generateAIAnalysis = async (): Promise<AIAnalysis> => {
    // סימולציה של ניתוח AI מתקדם
    return {
      correctness: 78,
      reasoning: {
        mainPoints: [
          'זיהיתי נכון את העקרון המשפטי הראשי',
          'ניתוח הסיטואציה מדויק ומבוסס',
          'התייחסת לרוב הפרטים הרלוונטיים'
        ],
        logicalFlow: 'הטיעון שלך בנוי היטב ועוקב רצף לוגי ברור. התחלת בזיהוי העובדות, המשכת לניתוח משפטי ובסוף הגעת למסקנה מבוססת.',
        legalAccuracy: 'הידע המשפטי שהפגנת מדויק ברובו. הבנת נכון את העקרונות הבסיסיים ויישמת אותם כראוי על המקרה.',
        practicalApplication: 'הצלחת ליישם את הידע התיאורטי על מקרה מעשי בצורה טובה, תוך התחשבות בנסיבות הייחודיות.',
        missingElements: [
          'לא התייחסת לפסיקה רלוונטית',
          'חסר ניתוח של תרחיש חלופי',
          'יכולת להעמיק יותר בהשלכות המעשיות'
        ]
      },
      legalPrinciples: [
        {
          name: 'עקרון היחסיות',
          explanation: 'כל פגיעה בזכות חייבת להיות מידתית ולא לעלות על הנדרש להשגת התכלית',
          application: 'במקרה זה, יש לבחון האם הפגיעה בזכות מידתית לתכלית שהחוק מבקש להשיג',
          importance: 'critical',
          icon: '⚖️'
        },
        {
          name: 'זכות הגנה',
          explanation: 'לכל אדם זכות להגן על עצמו ולהביא את טענותיו בפני בית המשפט',
          application: 'הנתבע זכאי להגיש את כל הראיות והטענות הרלוונטיות להגנתו',
          importance: 'important',
          icon: '🛡️'
        },
        {
          name: 'עקרון השימוע',
          explanation: 'יש לאפשר לכל צד להשמיע את עמדתו לפני קבלת החלטה',
          application: 'בית המשפט חייב לתת לכל הצדדים הזדמנות שווה להציג את טענותיהם',
          importance: 'supplementary',
          icon: '👂'
        }
      ],
      improvements: [
        'הוסף התייחסות לפסיקה רלוונטית כמו פרשת מנחם נגד שר התחבורה',
        'נתח גם תרחיש חלופי - מה היה קורה אם הנסיבות היו שונות מעט',
        'העמק יותר בהשלכות המעשיות של ההחלטה על הצדדים',
        'שקול את האיזון בין האינטרסים השונים בצורה מפורטת יותר'
      ],
      strengthsIdentified: [
        'זיהוי נכון של העקרונות המשפטיים הרלוונטיים',
        'ניתוח עובדתי מדויק ושיטתי',
        'הבנה טובה של ההקשר המשפטי הרחב',
        'כתיבה ברורה ומסודרת'
      ],
      relatedCases: [
        {
          name: 'בג"ץ 4769/95 מנחם נגד שר התחבורה',
          year: 1997,
          court: 'בית המשפט העליון',
          relevance: 'קובע את המבחן לבחינת הגבלות על זכויות יסוד',
          keyLearning: 'המבחן המשולש: תכלית ראויה, אמצעי הולם, פגיעה מידתית',
          similarity: 85
        },
        {
          name: 'בג"ץ 6055/95 צמח נגד שר הביטחון',
          year: 1999,
          court: 'בית המשפט העליון',
          relevance: 'עוסק באיזון בין ביטחון לזכויות אדם',
          keyLearning: 'גם בנושאי ביטחון יש לשמור על זכויות הפרט',
          similarity: 72
        }
      ],
      nextSteps: [
        'לימוד מעמיק של פסיקת בג"ץ בנושא זכויות יסוד',
        'תרגול ניתוח מקרים נוספים בנושא דומה',
        'חיזוק הידע בתחום המשפט החוקתי',
        'תרגול כתיבת חוות דעת משפטיות'
      ],
      confidence: 91,
      analysisTime: 8.5
    };
  };

  const getStageMessage = () => {
    switch (analysisStage) {
      case 'thinking':
        return 'הבינה המלאכותית חושבת ומנתחת את התשובה שלך...';
      case 'researching':
        return 'מחפשת במאגר הפסיקה והחקיקה הרלוונטית...';
      case 'analyzing':
        return 'מבצעת ניתוח משפטי מעמיק ומשווה למקרים דומים...';
      case 'completing':
        return 'משלימה את הניתוח ומכינה המלצות אישיות...';
      default:
        return '';
    }
  };

  const getCorrectnessColor = (score: number) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'critical': return '🔴';
      case 'important': return '🟡';
      case 'supplementary': return '🔵';
      default: return '⚪';
    }
  };

  if (isAnalyzing) {
    return (
      <Card sx={{ maxWidth: 800, margin: 'auto', mt: 3 }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Avatar sx={{ 
            width: 80, 
            height: 80, 
            margin: 'auto', 
            mb: 2,
            backgroundColor: '#e3f2fd',
            animation: 'pulse 2s infinite'
          }}>
            <AIIcon sx={{ fontSize: '2.5rem', color: '#1976d2' }} />
          </Avatar>
          
          <Typography variant="h5" gutterBottom>
            🧠 ניתוח בינה מלאכותית
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            {getStageMessage()}
          </Typography>
          
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              mb: 2,
              backgroundColor: '#f0f0f0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#1976d2'
              }
            }}
          />
          
          <Typography variant="caption" color="text.secondary">
            {Math.round(progress)}% הושלם
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) return null;

  return (
    <Card sx={{ maxWidth: 1000, margin: 'auto', mt: 3 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: '#4caf50' }}>
            <CheckIcon />
          </Avatar>
        }
        title="🎯 ניתוח AI הושלם"
        subheader={`זמן ניתוח: ${analysis.analysisTime} שניות • רמת ביטחון: ${analysis.confidence}%`}
      />
      
      <CardContent>
        {/* ציון כללי */}
        <Box mb={3}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="h4" sx={{ 
              color: getCorrectnessColor(analysis.correctness),
              fontWeight: 'bold' 
            }}>
              {analysis.correctness}/100
            </Typography>
            <Box flex={1}>
              <Typography variant="h6" gutterBottom>
                ציון התשובה שלך
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={analysis.correctness} 
                sx={{ 
                  height: 12, 
                  borderRadius: 6,
                  backgroundColor: '#f0f0f0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: getCorrectnessColor(analysis.correctness)
                  }
                }}
              />
            </Box>
          </Box>
        </Box>

        {/* נימוק מפורט */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Typography variant="h6">🧠 ניתוח החשיבה שלך</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom color="primary">
                נקודות חוזק שזוהו:
              </Typography>
              {analysis.reasoning.mainPoints.map((point, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                  ✅ {point}
                </Typography>
              ))}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom color="primary">
                רצף לוגי:
              </Typography>
              <Typography variant="body2" paragraph>
                {analysis.reasoning.logicalFlow}
              </Typography>
            </Box>

            <Box mb={2}>
              <Typography variant="subtitle2" gutterBottom color="primary">
                דיוק משפטי:
              </Typography>
              <Typography variant="body2" paragraph>
                {analysis.reasoning.legalAccuracy}
              </Typography>
            </Box>

            {analysis.reasoning.missingElements && (
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  אלמנטים שחסרו:
                </Typography>
                {analysis.reasoning.missingElements.map((element, index) => (
                  <Typography key={index} variant="body2">
                    • {element}
                  </Typography>
                ))}
              </Alert>
            )}
          </AccordionDetails>
        </Accordion>

        {/* עקרונות משפטיים */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Typography variant="h6">⚖️ עקרונות משפטיים רלוונטיים</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {analysis.legalPrinciples.map((principle, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Box component="span" sx={{ fontSize: '1.2rem' }}>{principle.icon}</Box>
                  <Typography variant="h6">
                    {principle.name}
                  </Typography>
                  <Chip 
                    size="small" 
                    label={getImportanceIcon(principle.importance)} 
                  />
                </Box>
                <Typography variant="body2" paragraph>
                  {principle.explanation}
                </Typography>
                <Typography variant="body2" sx={{ 
                  fontStyle: 'italic',
                  backgroundColor: '#f8f9fa',
                  p: 1,
                  borderRadius: 1 
                }}>
                  יישום: {principle.application}
                </Typography>
              </Paper>
            ))}
          </AccordionDetails>
        </Accordion>

        {/* מקרים דומים */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Typography variant="h6">📚 פסיקה רלוונטיה</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {analysis.relatedCases.map((caseItem, index) => (
              <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {caseItem.name}
                  </Typography>
                  <Chip 
                    label={`${caseItem.similarity}% דמיון`}
                    color={caseItem.similarity > 80 ? 'success' : 'warning'}
                    size="small"
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {caseItem.court} • {caseItem.year}
                </Typography>
                <Typography variant="body2" paragraph sx={{ mt: 1 }}>
                  {caseItem.relevance}
                </Typography>
                <Typography variant="body2" sx={{ 
                  backgroundColor: '#e8f5e8',
                  p: 1,
                  borderRadius: 1,
                  fontWeight: 'medium'
                }}>
                  💡 לקח מרכזי: {caseItem.keyLearning}
                </Typography>
              </Paper>
            ))}
          </AccordionDetails>
        </Accordion>

        {/* המלצות לשיפור */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Typography variant="h6">🚀 המלצות לשיפור</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                נקודות חוזק שזוהו:
              </Typography>
              {analysis.strengthsIdentified.map((strength, index) => (
                <Typography key={index} variant="body2">
                  🌟 {strength}
                </Typography>
              ))}
            </Alert>

            <Typography variant="subtitle2" gutterBottom color="primary" sx={{ mt: 2 }}>
              איך לשפר:
            </Typography>
            {analysis.improvements.map((improvement, index) => (
              <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                📈 {improvement}
              </Typography>
            ))}

            <Typography variant="subtitle2" gutterBottom color="primary" sx={{ mt: 3 }}>
              צעדים הבאים מומלצים:
            </Typography>
            {analysis.nextSteps.map((step, index) => (
              <Chip 
                key={index}
                label={step}
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* אנימציית CSS */}
        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.05); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      </CardContent>
    </Card>
  );
};
