import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Button, 
  Chip, 
  Box, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Paper,
  Divider,
  Alert
} from '@mui/material';
import { 
  Gavel as GavelIcon,
  MenuBook as BookIcon,
  AutoFixHigh as CustomIcon,
  PushPin as PinIcon,
  AccountBalance as CourtIcon
} from '@mui/icons-material';
import { LegalCase, CaseOption, LegalBasis } from '../../types';

/** Standalone tab in Legal Knowledge renders this without props; keep a minimal demo case. */
const DEFAULT_CASE_STUDY: LegalCase = {
  id: 'demo-sources-of-law',
  title: 'דוגמה: מקורות המשפט והנוהג',
  description:
    'חברה טוענת כי «מנהג עסקי» בתעשייתה מחייב את הספק לספק בשעת חירום, גם אם לא נכתב במפורש בחוזה.',
  scenario:
    'בחוזה האספקה אין סעיף על אספקה דחופה. הצדדים נוהגים שנים שבמצבי חירום הספק מגיב תוך 24 שעות. הספק סירב הפעם בטענה שאין חובה חוזית.',
  difficulty: 'medium',
  category: 'general',
  correctAnswer: 'b',
  explanation:
    'מנהג עשוי להשלים או לפרש את החוזה (סעיף 25 לחוק החוזים), אך אינו גובר על חוזה מפורש סותר; בדרך כלל נבחנים חוזה, חקיקה ואז מנהג משלים.',
  options: [
    {
      id: 'a',
      text: 'המנהג תמיד גובר על ניסוח החוזה.',
      reasoning: 'לא מדויק: חוזה מפורש דוחה מנהג סותר, והמנהג משמש בעיקר השלמה ופרשנות.'
    },
    {
      id: 'b',
      text: 'מנהג עשוי ליצור חובה משתמעת, בכפוף לחוזה ולחקיקה.',
      reasoning: 'מתאים לדיני מקורות: היררכיה בין חקיקה, חוזה ונוהג משלים.'
    },
    {
      id: 'c',
      text: 'בית המשפט לא יבחן מנהג בעסקים בכלל.',
      reasoning: 'נוהג מקובל נבחן לעיתים קרובות בפרשנות חוזית וחובות משתמעות.'
    }
  ],
  legalBasis: [
    {
      type: 'regular-law',
      source: 'חוק החוזים (כללי), סעיף 25',
      text: 'הסכם יכול להשתמע מהתנהגות הצדדים ומהנסיבות.',
      icon: '📜'
    }
  ],
  precedents: []
};

interface CaseStudyViewerProps {
  case?: LegalCase;
  onAnswer?: (optionId: string) => void;
  showResult?: boolean;
  userAnswer?: string;
}

const getLegalIcon = (type: LegalBasis['type']) => {
  switch (type) {
    case 'basic-law':
    case 'regular-law':
      return <BookIcon />;
    case 'custom':
      return <CustomIcon />;
    case 'precedent':
      return <GavelIcon />;
    default:
      return <PinIcon />;
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'success';
    case 'medium': return 'warning';
    case 'hard': return 'error';
    case 'very-hard': return 'error';
    default: return 'default';
  }
};

export const CaseStudyViewer: React.FC<CaseStudyViewerProps> = ({
  case: legalCaseProp,
  onAnswer = () => {},
  showResult = false,
  userAnswer
}) => {
  const legalCase = legalCaseProp ?? DEFAULT_CASE_STUDY;
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = () => {
    if (selectedOption) {
      onAnswer(selectedOption);
    }
  };

  const isCorrect =
    userAnswer != null && userAnswer !== '' && userAnswer === legalCase.correctAnswer;

  return (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 2 }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={2}>
            <CourtIcon color="primary" />
            <Typography variant="h5" component="h1">
              {legalCase.title}
            </Typography>
          </Box>
        }
        action={
          <Chip 
            label={legalCase.difficulty === 'very-hard' ? 'קשה מאוד' : 
                  legalCase.difficulty === 'hard' ? 'קשה' :
                  legalCase.difficulty === 'medium' ? 'בינוני' : 'קל'}
            color={getDifficultyColor(legalCase.difficulty) as any}
            variant="outlined"
          />
        }
      />
      
      <CardContent>
        {/* תיאור המקרה */}
        <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#f8f9fa' }}>
          <Typography variant="h6" gutterBottom color="primary">
            🏛 תיאור המקרה
          </Typography>
          <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
            {legalCase.description}
          </Typography>
          
          <Typography variant="h6" gutterBottom color="primary" sx={{ mt: 2 }}>
            📋 הסיטואציה
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {legalCase.scenario}
          </Typography>
        </Paper>

        {/* אפשרויות התשובה */}
        <Typography variant="h6" gutterBottom color="primary">
          ⚖️ מה לדעתך יחליט השופט?
        </Typography>
        
        <RadioGroup value={selectedOption} onChange={handleOptionChange}>
          {legalCase.options.map((option: CaseOption) => (
            <Paper 
              key={option.id} 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 2,
                border: selectedOption === option.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                backgroundColor: showResult && userAnswer === option.id ? 
                  (isCorrect ? '#e8f5e8' : '#ffebee') : 'white'
              }}
            >
              <FormControlLabel
                value={option.id}
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {option.text}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      נימוק: {option.reasoning}
                    </Typography>
                  </Box>
                }
                disabled={showResult}
              />
            </Paper>
          ))}
        </RadioGroup>

        {/* כפתור שליחה */}
        {!showResult && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!selectedOption}
              sx={{ minWidth: 200 }}
            >
              הגש החלטה
            </Button>
          </Box>
        )}

        {/* תוצאות ומשוב */}
        {showResult && (
          <Box sx={{ mt: 3 }}>
            <Alert severity={isCorrect ? 'success' : 'error'} sx={{ mb: 3 }}>
              <Typography variant="h6">
                {isCorrect ? '✅ תשובה נכונה!' : '❌ תשובה שגויה'}
              </Typography>
            </Alert>

            <Paper elevation={2} sx={{ p: 3, backgroundColor: '#f0f8ff' }}>
              <Typography variant="h6" gutterBottom color="primary">
                📚 הסבר מפורט
              </Typography>
              <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                {legalCase.explanation}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom color="primary">
                📌 בסיס משפטי
              </Typography>
              {legalCase.legalBasis.map((basis, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {getLegalIcon(basis.type)}
                    <Typography variant="subtitle1" fontWeight="medium">
                      {basis.source}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {basis.text}
                  </Typography>
                </Box>
              ))}

              {legalCase.precedents.length > 0 && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom color="primary">
                    ⚖️ תקדימים רלוונטיים
                  </Typography>
                  {legalCase.precedents.map((precedent, index) => (
                    <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {precedent.caseName} ({precedent.year})
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {precedent.court}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>פסיקה:</strong> {precedent.ruling}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        <strong>רלוונטיות:</strong> {precedent.relevance}
                      </Typography>
                    </Paper>
                  ))}
                </>
              )}
            </Paper>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
