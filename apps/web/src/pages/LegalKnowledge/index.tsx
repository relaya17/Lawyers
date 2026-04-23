import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Grid,
  Tabs,
  Tab,
  Button,
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
  Gavel,
  HomeWork,
  Sell as SellIcon,
  AccountTree as AppellateLadderIcon,
} from '@mui/icons-material';
import { PageHero } from '@/design/PageHero';

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
import { LegalFlashcards } from '../../features/legal-knowledge/components/Flashcards/LegalFlashcards';
import { CaseStudyViewer } from '../../features/legal-knowledge/components/CaseStudies/CaseStudyViewer';
import { LawVsCustomGame } from '../../features/legal-knowledge/components/GameModes/LawVsCustom/LawVsCustomGame';
import { ProgressDashboard } from '../../features/legal-knowledge/components/Statistics/ProgressDashboard';
import ComprehensiveLegalSourcesExam from '../../features/legal-knowledge/components/Testing/ComprehensiveLegalSourcesExam';
import LawVsCustomQuiz from '../../features/legal-knowledge/components/Interactive/LawVsCustomQuiz';
import { AppellateLadderGame } from '../../features/legal-knowledge/components/GameModes/AppellateLadder/AppellateLadderGame';
import ConstitutionalLawComparison from '../../features/legal-knowledge/components/Testing/ConstitutionalLawComparison';
import ParliamentaryAndEqualityLawExam from '../../features/legal-knowledge/components/Testing/ParliamentaryAndEqualityLawExam';
import ContractFormationExam from '../../features/legal-knowledge/components/Testing/ContractFormationExam';
import ContractDefectsExam from '../../features/legal-knowledge/components/Testing/ContractDefectsExam';
import CriminalLawExam from '../../features/legal-knowledge/components/Testing/CriminalLawExam';
import { ComprehensiveContractsExam } from '../../features/legal-knowledge/components/Testing/ComprehensiveContractsExam';
import LawOfReturnExam from '../../features/legal-knowledge/components/Testing/LawOfReturnExam';
import FamilyLawExam from '../../features/legal-knowledge/components/Testing/FamilyLawExam';
import LaborLawExam from '../../features/legal-knowledge/components/Testing/LaborLawExam';
import LaborLawExam2 from '../../features/legal-knowledge/components/Testing/LaborLawExam2';
import TortLawExam from '../../features/legal-knowledge/components/Testing/TortLawExam';
import TortLawExam2 from '../../features/legal-knowledge/components/Testing/TortLawExam2';
import PropertyLawExam from '../../features/legal-knowledge/components/Testing/PropertyLawExam';
import PropertyLawExam2 from '../../features/legal-knowledge/components/Testing/PropertyLawExam2';
import AdministrativeLawExam from '../../features/legal-knowledge/components/Testing/AdministrativeLawExam';
import AdministrativeLawExam2 from '../../features/legal-knowledge/components/Testing/AdministrativeLawExam2';
import LaborLawExam3 from '../../features/legal-knowledge/components/Testing/LaborLawExam3';
import LaborLawExam4 from '../../features/legal-knowledge/components/Testing/LaborLawExam4';
import TortLawExam3 from '../../features/legal-knowledge/components/Testing/TortLawExam3';
import TortLawExam4 from '../../features/legal-knowledge/components/Testing/TortLawExam4';
import PropertyLawExam3 from '../../features/legal-knowledge/components/Testing/PropertyLawExam3';
import PropertyLawExam4 from '../../features/legal-knowledge/components/Testing/PropertyLawExam4';
import AdministrativeLawExam3 from '../../features/legal-knowledge/components/Testing/AdministrativeLawExam3';
import AdministrativeLawExam4 from '../../features/legal-knowledge/components/Testing/AdministrativeLawExam4';
import MixedLegalSimulation from '../../features/legal-knowledge/components/Testing/MixedLegalSimulation';
import InheritanceLawExam from '../../features/legal-knowledge/components/Testing/InheritanceLawExam';
import ConsumerProtectionExam from '../../features/legal-knowledge/components/Testing/ConsumerProtectionExam';
import PrivacyLawExam from '../../features/legal-knowledge/components/Testing/PrivacyLawExam';
import CompanyLawExam from '../../features/legal-knowledge/components/Testing/CompanyLawExam';
import InsolvencyLawExam from '../../features/legal-knowledge/components/Testing/InsolvencyLawExam';
import EnvironmentalLawExam from '../../features/legal-knowledge/components/Testing/EnvironmentalLawExam';
import {
  LabRentalContractQuizSimulation,
  LabEmploymentContractQuizSimulation,
  LabSaleContractQuizSimulation,
} from '../../features/legal-knowledge/components/LabContractQuizSimulation';
import PersonalLearningDashboard from '../../features/personal-learning/components/PersonalLearningDashboard';

/** מבחנים שלא מציגים כפתור "תרגול" נפרד (ממשק פנימי או שאלות פתוחות) */
const EXAM_SINGLE_LAUNCH_IDS = new Set<string>(['exam-manager', 'essay-questions']);

interface LegalKnowledgeFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  category: 'exams' | 'learning' | 'games' | 'advanced' | 'simulation' | 'reference';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert' | 'all' | 'hard';
  estimatedTime: number;
  subCategory?: string;
}

function featureSupportsExamAndPractice(f: LegalKnowledgeFeature): boolean {
  if (f.category !== 'exams') return false;
  if (EXAM_SINGLE_LAUNCH_IDS.has(f.id)) return false;
  return true;
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
    estimatedTime: 45,
    subCategory: 'כללי'
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
    estimatedTime: 20,
    subCategory: 'כללי'
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
    estimatedTime: 120,
    subCategory: 'כללי'
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
    estimatedTime: 60,
    subCategory: 'כללי'
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
    estimatedTime: 90,
    subCategory: 'מקורות המשפט'
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
    estimatedTime: 75,
    subCategory: 'מקורות המשפט',
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
    estimatedTime: 60,
    subCategory: 'מקורות המשפט',
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
    estimatedTime: 80,
    subCategory: 'כללי'
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
    estimatedTime: 100,
    subCategory: 'כללי'
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
    estimatedTime: 150,
    subCategory: 'כללי'
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
      estimatedTime: 45,
      subCategory: 'חוקתי',
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
      estimatedTime: 90,
      subCategory: 'חוקתי'
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
      estimatedTime: 75,
      subCategory: 'חוזים',
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
      estimatedTime: 80,
      subCategory: 'חוזים',
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
      estimatedTime: 90,
      subCategory: 'עונשין',
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
      estimatedTime: 75,
      subCategory: 'חוזים',
    },
    {
      id: 'lab-sim-rental-contracts',
      title: 'סימולציית חוזי שכירות (מעבדה)',
      description: 'תרחישים מעשיים ושאלות רב־ברירה על חוזי שכירות בישראל — הועבר מדף המעבדה',
      icon: <HomeWork />,
      color: '#00897b',
      category: 'exams',
      component: LabRentalContractQuizSimulation,
      difficulty: 'beginner',
      estimatedTime: 15,
      subCategory: 'חוזים',
    },
    {
      id: 'lab-sim-sale-contracts',
      title: 'סימולציית חוזי מכר מורכבים (מעבדה)',
      description: 'מקרקעין, מוצרים, אחריות ותנאי תשלום — תרגול מהמעבדה',
      icon: <SellIcon />,
      color: '#5c6bc0',
      category: 'exams',
      component: LabSaleContractQuizSimulation,
      difficulty: 'advanced',
      estimatedTime: 15,
      subCategory: 'חוזים',
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
      estimatedTime: 60,
      subCategory: 'משפחה וירושה'
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
      estimatedTime: 45,
      subCategory: 'משפחה וירושה',
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
      estimatedTime: 40,
      subCategory: 'עבודה',
    },
    {
      id: 'lab-sim-employment-contracts',
      title: 'סימולציית הסכמי עבודה (מעבדה)',
      description: 'תנאי העסקה, שעות, פיטורים והגנות עובדים — תרגול קצר מהמעבדה',
      icon: <Work />,
      color: '#43a047',
      category: 'exams',
      component: LabEmploymentContractQuizSimulation,
      difficulty: 'intermediate',
      estimatedTime: 15,
      subCategory: 'עבודה',
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
      estimatedTime: 35,
      subCategory: 'נזיקין',
    },
    {
      id: 'property-law-exam',
      title: 'מבחן דיני קניין ומקרקעין',
      description: 'חוק המקרקעין תשכ"ט–1969 — רישום, זיקת הנאה, שיתוף, משכנתא וחוק המכר דירות',
      icon: <AccountBalance />,
      color: '#795548',
      category: 'exams',
      component: PropertyLawExam,
      difficulty: 'advanced',
      estimatedTime: 40,
      subCategory: 'קניין ומקרקעין',
    },
    {
      id: 'administrative-law-exam',
      title: 'מבחן משפט מינהלי',
      description: 'עקרונות המשפט המינהלי — חוקיות, סבירות, שימוע, שיקולים זרים וחופש המידע',
      icon: <AccountBalance />,
      color: '#3f51b5',
      category: 'exams',
      component: AdministrativeLawExam,
      difficulty: 'advanced',
      estimatedTime: 40,
      subCategory: 'מנהלי',
    },
    {
      id: 'labor-law-exam-2',
      title: 'מבחן דיני עבודה — מתקדם',
      description: 'שימוע, שכר מינימום, פיצויי פיטורין, הלנת שכר וזכויות קוגנטיות',
      icon: <Work />,
      color: '#388e3c',
      category: 'exams',
      component: LaborLawExam2,
      difficulty: 'advanced',
      estimatedTime: 40,
      subCategory: 'עבודה',
    },
    {
      id: 'tort-law-exam-2',
      title: 'מבחן דיני נזיקין — מתקדם',
      description: 'יסודות הרשלנות, אחריות שילוחית, קשר סיבתי, נזק ואשם תורם',
      icon: <Gavel />,
      color: '#e65100',
      category: 'exams',
      component: TortLawExam2,
      difficulty: 'advanced',
      estimatedTime: 35,
      subCategory: 'נזיקין',
    },
    {
      id: 'property-law-exam-2',
      title: 'מבחן קניין ומקרקעין — מתקדם',
      description: 'חוק המקרקעין: זיקת הנאה, רישום בטאבו, משכנתא ושיתוף',
      icon: <AccountBalance />,
      color: '#4e342e',
      category: 'exams',
      component: PropertyLawExam2,
      difficulty: 'advanced',
      estimatedTime: 30,
      subCategory: 'קניין ומקרקעין',
    },
    {
      id: 'administrative-law-exam-2',
      title: 'מבחן משפט מנהלי — מתקדם',
      description: 'עקרון החוקיות, שימוע, שיקולים זרים, סבירות וחופש המידע',
      icon: <AccountBalance />,
      color: '#283593',
      category: 'exams',
      component: AdministrativeLawExam2,
      difficulty: 'advanced',
      estimatedTime: 35,
      subCategory: 'מנהלי',
    },
    {
      id: 'labor-law-exam-3',
      title: 'מבחן דיני עבודה — Case Study',
      description: 'Case Study: שימוע, התפטרות בדין מפוטר, הלנת שכר ופיטורין במחלה',
      icon: <Work />,
      color: '#2e7d32',
      category: 'exams',
      component: LaborLawExam3,
      difficulty: 'expert',
      estimatedTime: 40,
      subCategory: 'עבודה',
    },
    {
      id: 'labor-law-exam-4',
      title: 'מבחן דיני עבודה — סט 3',
      description: 'שימוע לאחר ההחלטה, הריון, פרילנסר, חוק קוגנטי והפסקות',
      icon: <Work />,
      color: '#1b5e20',
      category: 'exams',
      component: LaborLawExam4,
      difficulty: 'expert',
      estimatedTime: 35,
      subCategory: 'עבודה',
    },
    {
      id: 'tort-law-exam-3',
      title: 'מבחן דיני נזיקין — סט 2',
      description: 'רשלנות, אשם תורם, רשלנות רפואית, נזק עקיף ומטרד ליחיד',
      icon: <Gavel />,
      color: '#bf360c',
      category: 'exams',
      component: TortLawExam3,
      difficulty: 'advanced',
      estimatedTime: 35,
      subCategory: 'נזיקין',
    },
    {
      id: 'tort-law-exam-4',
      title: 'מבחן דיני נזיקין — סט 3',
      description: 'תקיפה, res ipsa loquitur, אחריות מוחלטת ואחריות הרשות',
      icon: <Gavel />,
      color: '#e64a19',
      category: 'exams',
      component: TortLawExam4,
      difficulty: 'expert',
      estimatedTime: 35,
      subCategory: 'נזיקין',
    },
    {
      id: 'property-law-exam-3',
      title: 'מבחן קניין ומקרקעין — סט 2',
      description: 'רישום, זיקת הנאה, פירוק שיתוף, צורת עסקה והערת אזהרה',
      icon: <AccountBalance />,
      color: '#3e2723',
      category: 'exams',
      component: PropertyLawExam3,
      difficulty: 'advanced',
      estimatedTime: 30,
      subCategory: 'קניין ומקרקעין',
    },
    {
      id: 'property-law-exam-4',
      title: 'מבחן קניין ומקרקעין — סט 3',
      description: 'עסקה נוגדת, מי זוכה, פירוק שיתוף ורישום קניין',
      icon: <AccountBalance />,
      color: '#4a148c',
      category: 'exams',
      component: PropertyLawExam4,
      difficulty: 'expert',
      estimatedTime: 30,
      subCategory: 'קניין ומקרקעין',
    },
    {
      id: 'administrative-law-exam-3',
      title: 'מבחן משפט מנהלי — סט 2',
      description: 'שיקולים זרים, שימוע, חופש מידע, סבירות ומידתיות',
      icon: <AccountBalance />,
      color: '#1a237e',
      category: 'exams',
      component: AdministrativeLawExam3,
      difficulty: 'advanced',
      estimatedTime: 35,
      subCategory: 'מנהלי',
    },
    {
      id: 'administrative-law-exam-4',
      title: 'מבחן משפט מנהלי — סט 3',
      description: 'נימוק, שיקולים זרים, שיקול דעת, מידתיות ועתירה לבג"ץ',
      icon: <AccountBalance />,
      color: '#311b92',
      category: 'exams',
      component: AdministrativeLawExam4,
      difficulty: 'expert',
      estimatedTime: 35,
      subCategory: 'מנהלי',
    },
    {
      id: 'mixed-legal-simulation',
      title: 'סימולציית מבחן משולב — סגנון לשכה',
      description: '10 שאלות משולבות: עבודה, נזיקין, קניין ומנהלי — ברמת לשכת עורכי הדין',
      icon: <Gavel />,
      color: '#4a4a4a',
      category: 'exams',
      component: MixedLegalSimulation,
      difficulty: 'expert',
      estimatedTime: 40,
      subCategory: 'כללי'
    },
    {
      id: 'inheritance-law-exam',
      title: 'מבחן דיני ירושה ועיזבון',
      description: 'חוק הירושה תשכ"ה–1965 — יורשים, צוואות, עיזבון, חלוקה ופסלות לרשת',
      icon: <DescriptionIcon />,
      color: '#6d4c41',
      category: 'exams',
      component: InheritanceLawExam,
      difficulty: 'advanced',
      estimatedTime: 40,
      subCategory: 'משפחה וירושה'
    },
    {
      id: 'consumer-protection-exam',
      title: 'מבחן הגנת הצרכן',
      description: 'חוק הגנת הצרכן תשמ"א–1981 — הטעיה, ביטול עסקה, אחריות, חוזים אחידים',
      icon: <Work />,
      color: '#00897b',
      category: 'exams',
      component: ConsumerProtectionExam,
      difficulty: 'intermediate',
      estimatedTime: 35,
      subCategory: 'חוזים',
    },
    {
      id: 'privacy-law-exam',
      title: 'מבחן הגנת הפרטיות',
      description: 'חוק הגנת הפרטיות תשמ"א–1981 — מאגרי מידע, מידע רגיש, GDPR וזכות לשכוח',
      icon: <WarningIcon />,
      color: '#5e35b1',
      category: 'exams',
      component: PrivacyLawExam,
      difficulty: 'advanced',
      estimatedTime: 35,
      subCategory: 'פרטיות וסביבה'
    },
    {
      id: 'company-law-exam',
      title: 'מבחן דיני חברות',
      description: 'חוק החברות תשנ"ט–1999 — התאגדות, אחריות מוגבלת, דירקטוריון, ניגוד עניינים ותביעה נגזרת',
      icon: <AccountBalance />,
      color: '#1565c0',
      category: 'exams',
      component: CompanyLawExam,
      difficulty: 'advanced',
      estimatedTime: 45,
      subCategory: 'חברות ופירוק'
    },
    {
      id: 'insolvency-law-exam',
      title: 'מבחן חדלות פרעון',
      description: 'חוק חדלות פרעון תשע"ח–2018 — שיקום כלכלי, קדימויות נושים, הסדר חוב ומחיקת חובות',
      icon: <DescriptionIcon />,
      color: '#b71c1c',
      category: 'exams',
      component: InsolvencyLawExam,
      difficulty: 'expert',
      estimatedTime: 45,
      subCategory: 'חברות ופירוק'
    },
    {
      id: 'environmental-law-exam',
      title: 'מבחן משפט סביבתי',
      description: 'דיני הגנת הסביבה — זיהום אוויר ומים, עוולת מטרד, הערכת השפעה ואנרגיה מתחדשת',
      icon: <ExploreIcon />,
      color: '#2e7d32',
      category: 'exams',
      component: EnvironmentalLawExam,
      difficulty: 'advanced',
      estimatedTime: 40,
      subCategory: 'פרטיות וסביבה'
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
  {
    id: 'legal-flashcards',
    title: 'כרטיסיות חזרה',
    description: '46 כרטיסיות חזרה בשיטת Spaced Repetition — מושגים, עקרונות ופסיקה בכל תחומי המשפט',
    icon: <BookIcon />,
    color: '#e91e63',
    category: 'learning',
    component: LegalFlashcards,
    difficulty: 'beginner',
    estimatedTime: 20
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
    id: 'appellate-ladder',
    title: 'סולם הערעור',
    description: 'משחק על מסלולי ערעור וערכאות: אזרחי, עבודה, מינהלי, פלילי, משפחה ובג״ץ',
    icon: <AppellateLadderIcon />,
    color: '#5c6bc0',
    category: 'games',
    component: AppellateLadderGame,
    difficulty: 'advanced',
    estimatedTime: 30
  },
  // לוח בקרה אישי
  {
    id: 'personal-dashboard',
    title: 'לוח בקרה אישי — AI מאמן',
    description: 'מעקב התקדמות אישית, ניתוח חולשות, שאלות חיזוק מותאמות AI לפי ביצועיך',
    icon: <Psychology />,
    color: '#7b1fa2',
    category: 'reference',
    component: PersonalLearningDashboard,
    difficulty: 'all',
    estimatedTime: 10
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
  const [launchMode, setLaunchMode] = useState<'exam' | 'practice'>('exam');

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

  const subCategoryOrder = [
    'כללי', 'מקורות המשפט', 'חוקתי', 'חוזים', 'עונשין',
    'משפחה וירושה', 'עבודה', 'נזיקין', 'קניין ומקרקעין',
    'מנהלי', 'חברות ופירוק', 'פרטיות וסביבה'
  ];

  const renderFeatureCard = (feature: LegalKnowledgeFeature) => (
    <Grid item xs={12} sm={6} lg={4} key={feature.id}>
      <Card
        elevation={3}
        sx={{
          height: '100%',
          border: `2px solid ${feature.color}20`,
          transition: 'all 0.3s ease',
          '&:hover': { transform: 'translateY(-4px)', boxShadow: 6, borderColor: feature.color }
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar sx={{ bgcolor: feature.color, width: 56, height: 56 }}>
              {feature.icon}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h6" fontWeight="bold">{feature.title}</Typography>
              <Box display="flex" gap={1} mt={1} flexWrap="wrap">
                <Chip
                  label={getDifficultyLabel(feature.difficulty)}
                  size="small"
                  sx={{ backgroundColor: getDifficultyColor(feature.difficulty), color: 'white' }}
                />
                <Chip label={`${feature.estimatedTime} דק'`} size="small" variant="outlined" />
              </Box>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            {feature.description}
          </Typography>
          <Box mt={2} display="flex" gap={1} flexWrap="wrap">
            <Button
              variant="contained"
              sx={{ flex: 1, minWidth: 120, backgroundColor: feature.color, '&:hover': { backgroundColor: feature.color, filter: 'brightness(0.9)' } }}
              onClick={() => { setSelectedFeature(feature); setLaunchMode('exam'); }}
            >
              {feature.category === 'exams' ? 'מבחן' : 'התחל'}
            </Button>
            {featureSupportsExamAndPractice(feature) && (
              <Button
                variant="outlined"
                sx={{ flex: 1, minWidth: 120, borderColor: feature.color, color: feature.color }}
                onClick={() => { setSelectedFeature(feature); setLaunchMode('practice'); }}
              >
                תרגול
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  if (selectedFeature) {
    const FeatureComponent = selectedFeature.component;
    return (
      <Box sx={{ bgcolor: '#f5f5f5' }}>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Button
              variant="outlined"
              onClick={() => { setSelectedFeature(null); setLaunchMode('exam'); }}
            >
              ← חזרה למקורות המשפט
            </Button>
            <Typography variant="h5" color="primary" flex={1}>
              {selectedFeature.title}
            </Typography>
            {launchMode === 'practice' && featureSupportsExamAndPractice(selectedFeature) && (
              <Chip label="מצב תרגול — משוב מיידי" color="success" variant="outlined" />
            )}
          </Box>
          {(() => {
            if (selectedFeature.id === 'progress-dashboard') {
              return <FeatureComponent userProgress={{
                totalStudyTime: 120,
                completedLessons: 15,
                totalLessons: 50,
                currentStreak: 7,
                averageScore: 85,
                weakAreas: ['Contract Law', 'Constitutional Law'],
                strongAreas: ['Criminal Law', 'Administrative Law'],
                recentActivity: []
              }} />;
            }
            if (selectedFeature.id === 'legal-sources-map') {
              return <FeatureComponent onLearnMore={() => {}} onStartChallenge={() => {}} />;
            }
            if (selectedFeature.id === 'personal-dashboard') {
              return <FeatureComponent onNavigateToFeature={(featureId: string) => {
                const f = legalFeatures.find(x => x.id === featureId);
                if (f) { setSelectedFeature(f); setLaunchMode('exam'); }
              }} />;
            }
            if (featureSupportsExamAndPractice(selectedFeature)) {
              return <FeatureComponent studyMode={launchMode} />;
            }
            return <FeatureComponent />;
          })()}
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#f5f5f5' }}>
      {/* טאבים דביקים מתחת לנאב */}
      <Box
        sx={{
          position: 'sticky',
          top: { xs: 56, sm: 64 },
          zIndex: 100,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          boxShadow: 2,
        }}
      >
        <Container maxWidth="xl">
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
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <PageHero
          title="מקורות המשפט הישראלי"
          subtitle="מעל 1,200 שאלות מבחן מכוסות לפי סילבוס הפקולטות — דיני חוזים, פלילי, חוקתי, נזיקין, משפחה, עבודה וקניין. כל שאלה עם הסבר מפורט ומקורות חוק."
          chips={[`${legalFeatures.length} מודולי לימוד`, '8 תחומי משפט', 'פסיקה ישראלית מעודכנת 2026']}
          icon={<span style={{ fontSize: 40 }}>🏛️</span>}
        />

        {/* רשת הפיצ'רים */}
        {categories[selectedTab]?.id === 'exams' ? (() => {
          const groups: Record<string, LegalKnowledgeFeature[]> = {};
          filteredFeatures.forEach(f => {
            const key = f.subCategory || 'כללי';
            if (!groups[key]) groups[key] = [];
            groups[key].push(f);
          });
          return (
            <Box>
              {subCategoryOrder.filter(cat => groups[cat]?.length > 0).map(cat => (
                <Box key={cat} mb={4}>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {cat === 'כללי' ? 'מבחנים כלליים' : `מבחנים — ${cat}`}
                    </Typography>
                    <Chip label={`${groups[cat].length} מבחנים`} size="small" variant="outlined" />
                  </Box>
                  <Grid container spacing={3}>
                    {groups[cat].map(renderFeatureCard)}
                  </Grid>
                </Box>
              ))}
            </Box>
          );
        })() : (
          <Grid container spacing={3}>
            {filteredFeatures.map(renderFeatureCard)}
          </Grid>
        )}

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
