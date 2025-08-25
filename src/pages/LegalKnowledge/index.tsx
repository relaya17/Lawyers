import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Grid,
  Tabs,
  Tab,
  Button,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  Quiz as QuizIcon,
  School as LearnIcon,
  Gavel as CourtIcon,
  MenuBook as BookIcon,
  TrendingUp as ProgressIcon,
  Psychology as AIIcon,
  Balance as BalanceIcon,
  Explore as ExploreIcon,
  Edit as EssayIcon,
  EmojiEvents as TrophyIcon,
  Timeline as TimelineIcon,
  Assessment as ExamIcon,
  History,
  Psychology,
  AccountBalance,
  Flag,
  Lightbulb,
  Description as DescriptionIcon,
  Warning as WarningIcon,
  LocalPolice as LocalPoliceIcon,
  Favorite,
  Work,
  Gavel
} from '@mui/icons-material';

// Import all the components we created
import { ComprehensiveLegalExam } from '../../features/legal-knowledge/components/Testing/ComprehensiveLegalExam';
import { CompleteLegalExam50Questions } from '../../features/legal-knowledge/components/Testing/CompleteLegalExam50Questions';
import { EssayQuestions } from '../../features/legal-knowledge/components/Testing/EssayQuestions';
import { ExamManager } from '../../features/legal-knowledge/components/Testing/ExamManager';
import { DetailedLegalExamWithAnswers } from '../../features/legal-knowledge/components/Testing/DetailedLegalExamWithAnswers';
import { FoundationsOfIsraeliLawExam } from '../../features/legal-knowledge/components/Testing/FoundationsOfIsraeliLawExam';
import { IntroToLawAndContractsExam } from '../../features/legal-knowledge/components/Testing/IntroToLawAndContractsExam';
import { CaseAnalysisAndTrueFalseExam } from '../../features/legal-knowledge/components/Testing/CaseAnalysisAndTrueFalseExam';
import { ComprehensiveLegalSystemExam } from '../../features/legal-knowledge/components/Testing/ComprehensiveLegalSystemExam';
import { LegalSourcesMap } from '../../features/legal-knowledge/components/LegalExplorer/LegalSourcesMap';
import { AdvancedLegalConcepts } from '../../features/legal-knowledge/components/LegalExplorer/AdvancedLegalConcepts';
import { LegalDynamicsEngine } from '../../features/legal-knowledge/components/LegalExplorer/LegalDynamicsEngine';
import { LegalMasterySystem } from '../../features/legal-knowledge/components/Advanced/LegalMasterySystem';
import { LegalConceptsTable } from '../../features/legal-knowledge/components/InteractiveGlossary/LegalConceptsTable';
import { UniversityLegalTopics } from '../../features/legal-knowledge/components/University/UniversityLegalTopics';
import { CaseStudyViewer } from '../../features/legal-knowledge/components/CaseStudies/CaseStudyViewer';
import { LawVsCustomGame } from '../../features/legal-knowledge/components/GameModes/LawVsCustom/LawVsCustomGame';
import { ProgressDashboard } from '../../features/legal-knowledge/components/Statistics/ProgressDashboard';
import { VirtualCourtroomSimulator } from '../../features/legal-knowledge/components/CourtRoom1/VirtualCourtroomSimulator';
import ComprehensiveLegalSourcesExam from '../../features/legal-knowledge/components/Testing/ComprehensiveLegalSourcesExam';
import LawVsCustomQuiz from '../../features/legal-knowledge/components/Interactive/LawVsCustomQuiz';
import ConstitutionalLawComparison from '../../features/legal-knowledge/components/Testing/ConstitutionalLawComparison';
import ParliamentaryAndEqualityLawExam from '../../features/legal-knowledge/components/Testing/ParliamentaryAndEqualityLawExam';
import ContractFormationExam from '../../features/legal-knowledge/components/Testing/ContractFormationExam';
import ContractDefectsExam from '../../features/legal-knowledge/components/Testing/ContractDefectsExam';
import CriminalLawExam from '../../features/legal-knowledge/components/Testing/CriminalLawExam';
import { LegalConceptsSummary } from '../../features/legal-knowledge/components/Reference/LegalConceptsSummary';
import { ComprehensiveContractsExam } from '../../features/legal-knowledge/components/Testing/ComprehensiveContractsExam';
import LawOfReturnExam from '../../features/legal-knowledge/components/Testing/LawOfReturnExam';
import FamilyLawExam from '../../features/legal-knowledge/components/Testing/FamilyLawExam';
import LaborLawExam from '../../features/legal-knowledge/components/Testing/LaborLawExam';
import TortLawExam from '../../features/legal-knowledge/components/Testing/TortLawExam';

interface LegalKnowledgeFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  category: 'exams' | 'learning' | 'games' | 'advanced' | 'simulation' | 'reference';
  component: React.ComponentType<any>;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'all' | 'hard';
  estimatedTime: number;
}

const legalFeatures: LegalKnowledgeFeature[] = [
  // מבחנים ובחינות
  {
    id: 'exam-manager',
    title: 'מרכז המבחנים',
    description: 'מערכת מבחנים מקיפה עם מעקב התקדמות והישגים',
    icon: <ExamIcon />,
    color: '#1976d2',
    category: 'exams',
    component: ExamManager,
    difficulty: 'intermediate',
    estimatedTime: 45
  },
  {
    id: 'comprehensive-exam',
    title: 'מבחן תרגול מהיר',
    description: 'מבחן של 10 שאלות עם הסברים מפורטים',
    icon: <QuizIcon />,
    color: '#4caf50',
    category: 'exams',
    component: ComprehensiveLegalExam,
    difficulty: 'beginner',
    estimatedTime: 20
  },
  {
    id: 'complete-50-exam',
    title: 'מבחן מקיף - 50 שאלות',
    description: 'מבחן מקיף הכולל רב-ברירה, נכון/לא נכון ושאלות חיבור',
    icon: <TrophyIcon />,
    color: '#f44336',
    category: 'exams',
    component: CompleteLegalExam50Questions,
    difficulty: 'expert',
    estimatedTime: 120
  },
  {
    id: 'essay-questions',
    title: 'שאלות חיבור ותמצות',
    description: 'שאלות פתוחות מעמיקות עם הערכה עצמית',
    icon: <EssayIcon />,
    color: '#9c27b0',
    category: 'exams',
    component: EssayQuestions,
    difficulty: 'advanced',
    estimatedTime: 60
  },
  {
    id: 'detailed-exam-with-answers',
    title: 'מבחן מפורט עם תשובות',
    description: 'מבחן מקיף עם הסברים מפורטים, דוגמאות ונקודות דגש',
    icon: <Lightbulb />,
    color: '#00bcd4',
    category: 'exams',
    component: DetailedLegalExamWithAnswers,
    difficulty: 'expert',
    estimatedTime: 90
  },
  {
    id: 'foundations-israel-law',
    title: 'יסודות המשפט הישראלי',
    description: 'מבחן על התפתחות שיטת המשפט הישראלית והמעבר מהמשפט העות\'מאני והבריטי',
    icon: <History />,
    color: '#795548',
    category: 'exams',
    component: FoundationsOfIsraeliLawExam,
    difficulty: 'advanced',
    estimatedTime: 75
  },
  {
    id: 'intro-law-contracts',
    title: 'מבוא למשפט ודיני חוזים',
    description: 'מבחן יסודי על מקורות המשפט, תקדימים, ועקרונות בסיסיים בדיני חוזים',
    icon: <BalanceIcon />,
    color: '#607d8b',
    category: 'exams',
    component: IntroToLawAndContractsExam,
    difficulty: 'intermediate',
    estimatedTime: 60
  },
  {
    id: 'case-analysis-tf',
    title: 'ניתוח מקרים ואמת/שקר',
    description: 'מבחן מתקדם לפיתוח חשיבה משפטית עם מקרים מעשיים ושאלות אמת/שקר',
    icon: <Psychology />,
    color: '#8e24aa',
    category: 'exams',
    component: CaseAnalysisAndTrueFalseExam,
    difficulty: 'expert',
    estimatedTime: 80
  },
  {
    id: 'comprehensive-legal-system',
    title: 'מערכת המשפט המקיפה',
    description: 'מבחן מקיף עם 20 שאלות רב-ברירה על כל נושאי מערכת המשפט הישראלית',
    icon: <AccountBalance />,
    color: '#d32f2f',
    category: 'exams',
    component: ComprehensiveLegalSystemExam,
    difficulty: 'expert',
    estimatedTime: 100
  },
  {
    id: 'comprehensive-sources-exam',
    title: 'מבחן מקיף מקורות המשפט - 50 שאלות',
    description: 'מבחן מקיף ביותר עם 50 שאלות בכל רמות הקושי, כולל סימולציות בית משפט',
    icon: <TrophyIcon />,
    color: '#ff4444',
    category: 'exams',
    component: ComprehensiveLegalSourcesExam,
    difficulty: 'expert',
    estimatedTime: 150
  },
      {
      id: 'constitutional-comparison',
      title: 'משפט חוקתי השוואתי',
      description: 'השוואה מעמיקה בין המערכת החוקתית האמריקאית לישראלית',
      icon: <Flag />,
      color: '#3f51b5',
      category: 'exams',
      component: ConstitutionalLawComparison,
      difficulty: 'advanced',
      estimatedTime: 45
    },
    {
      id: 'parliamentary-equality-exam',
      title: 'מבחן תנאי מועמדות ושוויון במשפט',
      description: 'מבחן מקיף על תנאי מועמדות לכנסת, שוויון הזדמנויות בעבודה ואיסור הפליה',
      icon: <AccountBalance />,
      color: '#673ab7',
      category: 'exams',
      component: ParliamentaryAndEqualityLawExam,
      difficulty: 'advanced',
      estimatedTime: 90
    },
    {
      id: 'contract-formation-exam',
      title: 'מבחן דיני חוזים - כריתת חוזה',
      description: 'מבחן מקיף על כריתת חוזה, פירוש, השלמה ופגמים בכריתת חוזה',
      icon: <DescriptionIcon />,
      color: '#009688',
      category: 'exams', 
      component: ContractFormationExam,
      difficulty: 'advanced',
      estimatedTime: 75
    },
    {
      id: 'contract-defects-exam',
      title: 'מבחן פגמים בכריתת חוזה',
      description: 'מבחן מתקדם על עושק, חוזה למראית עין, חוזה על תנאי ותום לב',
      icon: <WarningIcon />,
      color: '#ff9800',
      category: 'exams',
      component: ContractDefectsExam,
      difficulty: 'expert',
      estimatedTime: 80
    },
    {
      id: 'criminal-law-exam',
      title: 'מבחן דיני עונשין',
      description: 'מבחן מקיף על יסודות עבירות פליליות, יסוד נפשי וריבוב',
      icon: <LocalPoliceIcon />,
      color: '#d32f2f',
      category: 'exams',
      component: CriminalLawExam,
      difficulty: 'expert',
      estimatedTime: 90
    },
    {
      id: 'legal-concepts-summary',
      title: 'מדריך מושגים משפטיים',
      description: 'אוסף מקיף של מושגים יסודיים במשפט הישראלי עם הגדרות ודוגמאות',
      icon: <DescriptionIcon />,
      color: '#7b1fa2',
      category: 'reference',
      component: LegalConceptsSummary,
      difficulty: 'all',
      estimatedTime: 0
    },
    {
      id: 'comprehensive-contracts-exam',
      title: 'מבחן מקיף בדיני חוזים',
      description: 'מבחן מקיף ומעמיק בכל היבטי דיני החוזים הישראליים - מיסודות החוזה ועד הפרות וסעדים',
      icon: <DescriptionIcon />,
      color: '#1976d2',
      category: 'exams',
      component: ComprehensiveContractsExam,
      difficulty: 'hard',
      estimatedTime: 75
    },
    {
      id: 'law-of-return-exam',
      title: 'מבחן חוק השבות',
      description: 'מבחן מקיף על חוק השבות, הגדרת יהודי, זכויות בני משפחה ופסיקה מכוננת',
      icon: <Flag />,
      color: '#ff5722',
      category: 'exams',
      component: LawOfReturnExam,
      difficulty: 'advanced',
      estimatedTime: 60
    },
    {
      id: 'family-law-exam',
      title: 'מבחן דיני משפחה',
      description: 'מבחן מקיף על נישואין, גירושין, מזונות, משמורת וחלוקת רכוש',
      icon: <Favorite />,
      color: '#e91e63',
      category: 'exams',
      component: FamilyLawExam,
      difficulty: 'advanced',
      estimatedTime: 45
    },
    {
      id: 'labor-law-exam',
      title: 'מבחן דיני עבודה',
      description: 'מבחן מקיף על חוקי עבודה, זכויות עובדים, פיטורין ושכר',
      icon: <Work />,
      color: '#4caf50',
      category: 'exams',
      component: LaborLawExam,
      difficulty: 'advanced',
      estimatedTime: 40
    },
    {
      id: 'tort-law-exam',
      title: 'מבחן דיני נזיקין',
      description: 'מבחן מקיף על עוולות, אחריות, פיצויים ורשלנות',
      icon: <Gavel />,
      color: '#ff9800',
      category: 'exams',
      component: TortLawExam,
      difficulty: 'advanced',
      estimatedTime: 35
    },

  // למידה וחקירה
  {
    id: 'legal-sources-map',
    title: 'מפת מקורות המשפט',
    description: 'חקירה אינטראקטיבית של מקורות המשפט הישראלי',
    icon: <ExploreIcon />,
    color: '#00bcd4',
    category: 'learning',
    component: LegalSourcesMap,
    difficulty: 'intermediate',
    estimatedTime: 30
  },
  {
    id: 'advanced-concepts',
    title: 'מושגים מתקדמים',
    description: 'עומק, מורכבות ודילמות בעולם המשפט הישראלי',
    icon: <BookIcon />,
    color: '#ff9800',
    category: 'learning',
    component: AdvancedLegalConcepts,
    difficulty: 'advanced',
    estimatedTime: 45
  },
  {
    id: 'legal-dynamics',
    title: 'מנוע הדינמיקה המשפטית',
    description: 'חקירת יחסים, קונפליקטים ומנגנוני איזון במערכת המשפט',
    icon: <TimelineIcon />,
    color: '#673ab7',
    category: 'learning',
    component: LegalDynamicsEngine,
    difficulty: 'expert',
    estimatedTime: 50
  },
  {
    id: 'legal-concepts-table',
    title: 'מילון מושגים אינטראקטיבי',
    description: 'טבלה מקיפה של מושגים משפטיים עם דוגמאות ופסיקה',
    icon: <BookIcon />,
    color: '#795548',
    category: 'learning',
    component: LegalConceptsTable,
    difficulty: 'beginner',
    estimatedTime: 25
  },
  {
    id: 'university-topics',
    title: 'נושאי למידה אוניברסיטאיים',
    description: 'מערכת למידה מובנית לפי נושאים אקדמיים',
    icon: <LearnIcon />,
    color: '#3f51b5',
    category: 'learning',
    component: UniversityLegalTopics,
    difficulty: 'intermediate',
    estimatedTime: 40
  },

  // משחקים ותרגול
  {
    id: 'case-studies',
    title: 'מקרי מבחן משפטיים',
    description: 'ניתוח מקרים אמיתיים והחלטות שיפוטיות',
    icon: <CourtIcon />,
    color: '#e91e63',
    category: 'games',
    component: CaseStudyViewer,
    difficulty: 'advanced',
    estimatedTime: 35
  },
  {
    id: 'law-vs-custom',
    title: 'חוק נגד מנהג',
    description: 'משחק אינטראקטיבי ללימוד היררכיה משפטית',
    icon: <BalanceIcon />,
    color: '#607d8b',
    category: 'games',
    component: LawVsCustomGame,
    difficulty: 'intermediate',
    estimatedTime: 20
  },
  {
    id: 'law-vs-custom-quiz',
    title: 'חידון: חוק נגד מנהג',
    description: 'חידון אינטראקטיבי עם סיטואציות סותרות בין חקיקה למנהגים',
    icon: <BalanceIcon />,
    color: '#2196f3',
    category: 'games',
    component: LawVsCustomQuiz,
    difficulty: 'intermediate',
    estimatedTime: 25
  },
  {
    id: 'virtual-courtroom',
    title: 'אולם בית משפט וירטואלי',
    description: 'סימולציה של דיון משפטי עם קבלת החלטות בזמן אמת',
    icon: <CourtIcon />,
    color: '#8bc34a',
    category: 'simulation',
    component: VirtualCourtroomSimulator,
    difficulty: 'expert',
    estimatedTime: 60
  },

  // מערכות מתקדמות
  {
    id: 'mastery-system',
    title: 'מערכת מאסטרי משפטי',
    description: 'לימוד מתקדם ותרגול פרקטי של מקורות המשפט',
    icon: <TrophyIcon />,
    color: '#ff5722',
    category: 'advanced',
    component: LegalMasterySystem,
    difficulty: 'expert',
    estimatedTime: 90
  },
  {
    id: 'progress-dashboard',
    title: 'לוח התקדמות',
    description: 'מעקב מפורט אחרי ההתקדמות והישגים בלמידה',
    icon: <ProgressIcon />,
    color: '#009688',
    category: 'advanced',
    component: ProgressDashboard,
    difficulty: 'beginner',
    estimatedTime: 15
  }
];

export const LegalKnowledgePage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedFeature, setSelectedFeature] = useState<LegalKnowledgeFeature | null>(null);

  const categories = [
    { id: 'all', label: 'הכל', icon: <ExploreIcon /> },
    { id: 'exams', label: 'מבחנים', icon: <QuizIcon /> },
    { id: 'learning', label: 'למידה', icon: <LearnIcon /> },
    { id: 'games', label: 'משחקים', icon: <BalanceIcon /> },
    { id: 'simulation', label: 'סימולציות', icon: <CourtIcon /> },
    { id: 'reference', label: 'חומרי עיון', icon: <DescriptionIcon /> },
    { id: 'advanced', label: 'מתקדם', icon: <AIIcon /> }
  ];

  const filteredFeatures = selectedTab === 0 
    ? legalFeatures 
    : legalFeatures.filter(feature => feature.category === categories[selectedTab].id);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#4caf50';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#f44336';
      case 'expert': return '#9c27b0';
      default: return '#9e9e9e';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'מתחיל';
      case 'intermediate': return 'בינוני';
      case 'advanced': return 'מתקדם';
      case 'expert': return 'מומחה';
      default: return 'לא ידוע';
    }
  };

  if (selectedFeature) {
    const FeatureComponent = selectedFeature.component;
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Button
              variant="outlined"
              onClick={() => setSelectedFeature(null)}
            >
              ← חזרה למקורות המשפט
            </Button>
            <Typography variant="h5" color="primary">
              {selectedFeature.title}
            </Typography>
          </Box>
          {selectedFeature.id === 'progress-dashboard' ? (
            <FeatureComponent userProgress={{
              totalStudyTime: 120,
              completedLessons: 15,
              totalLessons: 50,
              currentStreak: 7,
              averageScore: 85,
              weakAreas: ['Contract Law', 'Constitutional Law'],
              strongAreas: ['Criminal Law', 'Administrative Law'],
              recentActivity: []
            }} />
          ) : (
            <FeatureComponent />
          )}
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* כותרת */}
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1e88e5 0%, #1565c0 100%)', color: 'white' }}>
          <CardHeader
            title={
              <Typography variant="h3" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                🏛️ מקורות המשפט הישראלי
              </Typography>
            }
            subheader={
              <Typography variant="h5" sx={{ textAlign: 'center', opacity: 0.9 }}>
                מערכת למידה אינטראקטיבית מקיפה למקורות המשפט, מבחנים ותרגול מעשי
              </Typography>
            }
          />
        </Card>

        {/* סטטיסטיקות כלליות */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#4caf50', margin: 'auto', mb: 2, width: 56, height: 56 }}>
                <ExamIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="h4" color="primary">
                {legalFeatures.filter(f => f.category === 'exams').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                מערכות מבחנים
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#ff9800', margin: 'auto', mb: 2, width: 56, height: 56 }}>
                <LearnIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="h4" color="primary">
                {legalFeatures.filter(f => f.category === 'learning').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                כלי למידה
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#f44336', margin: 'auto', mb: 2, width: 56, height: 56 }}>
                <BalanceIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="h4" color="primary">
                {legalFeatures.filter(f => f.category === 'games').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                משחקים אינטראקטיביים
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#7b1fa2', margin: 'auto', mb: 2, width: 56, height: 56 }}>
                <DescriptionIcon />
              </Avatar>
              <Typography variant="h4" color="primary">
                {legalFeatures.filter(f => f.category === 'reference').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                חומרי עיון ומדריכים
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} sx={{ p: 3, textAlign: 'center' }}>
              <Avatar sx={{ bgcolor: '#9c27b0', margin: 'auto', mb: 2, width: 56, height: 56 }}>
                <AIIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="h4" color="primary">
                {legalFeatures.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                סה"כ פיצ'רים
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* טאבים לסינון */}
        <Card sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={selectedTab} 
              onChange={(_, newValue) => setSelectedTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              {categories.map((category, index) => (
                <Tab 
                  key={category.id}
                  icon={category.icon}
                  label={category.label}
                  value={index}
                />
              ))}
            </Tabs>
          </Box>
        </Card>

        {/* רשת הפיצ'רים */}
        <Grid container spacing={3}>
          {filteredFeatures.map(feature => (
            <Grid item xs={12} sm={6} lg={4} key={feature.id}>
              <Card 
                elevation={3}
                sx={{ 
                  height: '100%',
                  border: `2px solid ${feature.color}20`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': { 
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                    borderColor: feature.color
                  }
                }}
                onClick={() => setSelectedFeature(feature)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: feature.color, width: 56, height: 56 }}>
                      {feature.icon}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {feature.title}
                      </Typography>
                      <Box display="flex" gap={1} mt={1}>
                        <Chip 
                          label={getDifficultyLabel(feature.difficulty)}
                          size="small"
                          sx={{ 
                            backgroundColor: getDifficultyColor(feature.difficulty),
                            color: 'white'
                          }}
                        />
                        <Chip 
                          label={`${feature.estimatedTime} דק'`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {feature.description}
                  </Typography>
                  
                  <Box mt={2}>
                    <Button 
                      variant="contained"
                      fullWidth
                      sx={{ 
                        backgroundColor: feature.color,
                        '&:hover': {
                          backgroundColor: feature.color,
                          filter: 'brightness(0.9)'
                        }
                      }}
                    >
                      התחל
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* מידע נוסף */}
        <Card sx={{ mt: 4, bgcolor: '#f8f9fa' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              💡 איך להתחיל?
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <QuizIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="מתחילים? התחילו עם 'מרכז המבחנים' ומבחן תרגול מהיר"
                  secondary="בנו ביטחון עם שאלות בסיסיות והסברים מפורטים"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <ExploreIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="רוצים להעמיק? חקרו את 'מפת מקורות המשפט'"
                  secondary="הבינו את הקשרים והיררכיה בין מקורות המשפט השונים"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <TrophyIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="מוכנים לאתגר? נסו את 'המבחן המקיף 50 שאלות'"
                  secondary="מבחן מקצועי עם כל סוגי השאלות ומערכת ציונים מתקדמת"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
