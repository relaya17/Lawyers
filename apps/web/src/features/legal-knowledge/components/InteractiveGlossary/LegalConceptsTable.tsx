import React, { useState, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  Box, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Grid
} from '@mui/material';
import { 
  ExpandMore as ExpandIcon,
  Search as SearchIcon,
  Info as InfoIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkedIcon,
  Close as CloseIcon
} from '@mui/icons-material';

interface LegalConcept {
  id: string;
  category: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  example: string;
  precedent?: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'very-hard';
  icon: string;
  relatedConcepts: string[];
  practicalNotes?: string;
  importance: 'critical' | 'important' | 'supplementary';
  lastUpdated: Date;
}

const legalConcepts: LegalConcept[] = [
  // חקיקה
  {
    id: 'primary-legislation',
    category: 'חקיקה',
    name: 'חקיקה ראשית',
    shortDescription: 'חוקים שמחוקקת הכנסת, עליונים מול חקיקת משנה',
    fullDescription: 'חקיקה ראשית היא החוקים שמחוקקת הכנסת כמוסד המחוקק העליון במדינה. חוקים אלה עליונים על חקיקת משנה ותקנות. החקיקה הראשית יכולה להכיל פסקת הגבלה שמאפשרת לבית המשפט לבדוק חקיקה רגילה מול חוק יסוד.',
    example: 'חוק יסוד: הכנסת, חוק העונשין, חוק החוזים',
    precedent: 'בג"ץ 1/81 שרן נגד כנסת ישראל - עליונות הכנסת במחוקק',
    difficulty: 'easy',
    icon: '📜',
    relatedConcepts: ['basic-laws', 'secondary-legislation'],
    practicalNotes: 'הכנסת היא הגוף היחיד המוסמך לחוקק חקיקה ראשית במדינת ישראל',
    importance: 'critical',
    lastUpdated: new Date()
  },
  {
    id: 'secondary-legislation',
    category: 'חקיקה',
    name: 'חקיקת משנה',
    shortDescription: 'תקנות, צווים והוראות על סמך חוק ראשי',
    fullDescription: 'חקיקת משנה כוללת תקנות, צווים והוראות המונעות על פי חוק ראשי. היא כפופה לחקיקה ראשית וחייבת להיות מבוססת על סמכות חוקית ברורה. תקנות שאינן חוקיות נחשבות בטלות.',
    example: 'תקנות ביטחון פנים, תקנות עבודה, תקנות תעבורה',
    difficulty: 'medium',
    icon: '📜',
    relatedConcepts: ['primary-legislation', 'administrative-law'],
    practicalNotes: 'תקנות חייבות להיות במסגרת הסמכה שניתנה בחוק הראשי',
    importance: 'important',
    lastUpdated: new Date()
  },
  {
    id: 'basic-laws',
    category: 'חקיקה',
    name: 'חוקי יסוד',
    shortDescription: 'מעין חוקה חלקית, עליונים מול חוקים רגילים',
    fullDescription: 'חוקי היסוד מהווים מעין חוקה "חלקית" של מדינת ישראל. הם עליונים על חוקים רגילים ומכילים פסקת הגבלה המאפשרת לבית המשפט לבחון אם חקיקה רגילה מפרה זכויות יסוד. בחוקי יסוד ללא פסקת הגבלה, בג"ץ מחויב להיזהר בביקורת.',
    example: 'חוק יסוד: כבוד האדם וחירותו, חוק יסוד: חופש העיסוק',
    precedent: 'בג"ץ 6427/02 התנועה לאיכות השלטון - עליונות חוקי היסוד',
    difficulty: 'hard',
    icon: '📜✨',
    relatedConcepts: ['constitutional-review', 'human-rights'],
    practicalNotes: 'חוקי יסוד עם פסקת הגבלה מאפשרים ביקורת שיפוטית רחבה יותר',
    importance: 'critical',
    lastUpdated: new Date()
  },

  // תקדימים
  {
    id: 'binding-precedent',
    category: 'תקדימים',
    name: 'פסיקה מחייבת',
    shortDescription: 'החלטות של ערכאות גבוהות שמחייבות ערכאות נמוכות',
    fullDescription: 'עקרון הסטארה דצ\'יזיס (Stare Decisis) קובע שהחלטות של ערכאות גבוהות מחייבות ערכאות נמוכות יותר. זהו עיקרון יסוד במערכת המשפט הישראלית המבטיח עקביות ויציבות בפסיקה.',
    example: 'פס"ד קול העם - חופש הביטוי, פס"ד ירדור - דמוקרטיה מהותית',
    precedent: 'ע"א 10/69 קול העם נגד שר הפנים - חופש הביטוי',
    difficulty: 'medium',
    icon: '⚖️',
    relatedConcepts: ['stare-decisis', 'judicial-hierarchy'],
    practicalNotes: 'ניתן לסטות מתקדים רק במקרים חריגים של שינוי נסיבות או עקרונות יסוד',
    importance: 'critical',
    lastUpdated: new Date()
  },
  {
    id: 'deviation-precedent',
    category: 'תקדימים',
    name: 'סטיית תקדים',
    shortDescription: 'סטייה מפסיקה קודמת עקב שינוי נסיבות או עקרונות יסוד',
    fullDescription: 'בית המשפט יכול לסטות מפסיקה קודמת במקרים של שינוי נסיבות, התפתחות חברתית, עקרונות יסוד או פערים בחקיקה. זוהי סמכות חריגה הדורשת נימוק מיוחד.',
    example: 'פס"ד ירדור - סטייה מגישה פורמלית לדמוקרטיה מהותית',
    precedent: 'בג"ץ 6427/02 התנועה לאיכות השלטון - סטייה מתקדימים קודמים',
    difficulty: 'hard',
    icon: '⚖️✨',
    relatedConcepts: ['binding-precedent', 'judicial-activism'],
    practicalNotes: 'סטיית תקדים דורשת הצדקה מיוחדת ונימוק מפורט',
    importance: 'important',
    lastUpdated: new Date()
  },

  // מנהגים
  {
    id: 'commercial-custom',
    category: 'מנהגים',
    name: 'מנהג עסקי',
    shortDescription: 'נוהג חוזר ומקובל בתחום עסקי, מחייב אם אינו סותר חוק',
    fullDescription: 'מנהג עסקי הוא נוהג חוזר ומקובל בתחום עסקי מסוים. הוא מחייב כאשר אינו סותר חוק ויש להוכיח שהוא נפוץ, קבוע ומקובל בקרב בעלי המקצוע הרלוונטיים.',
    example: 'שימוש חוזר במנהג מסחרי, תנאי תשלום מקובלים בענף',
    difficulty: 'medium',
    icon: '✨',
    relatedConcepts: ['contract-law', 'commercial-law'],
    practicalNotes: 'חובה להוכיח שהמנהג נפוץ, קבוע ומקובל',
    importance: 'important',
    lastUpdated: new Date()
  },
  {
    id: 'legal-custom',
    category: 'מנהגים',
    name: 'מנהג משפטי',
    shortDescription: 'עקרונות או נוהגים המקובלים בבתי משפט בהיעדר חקיקה ברורה',
    fullDescription: 'מנהג משפטי כולל עקרונות או נוהגים המקובלים בבית המשפט, בעיקר בהיעדר חקיקה ברורה. מנהג אינו מחייב בפני עצמו וחובה הוכחה ומבחן לצדק.',
    example: 'נוהגי פסיקה מקובלים, עקרונות שיפוט לא כתובים',
    difficulty: 'hard',
    icon: '✨',
    relatedConcepts: ['judicial-practice', 'unwritten-law'],
    practicalNotes: 'מנהג משפטי דורש הוכחה קפדנית ואינו עומד בפני חוק ברור',
    importance: 'supplementary',
    lastUpdated: new Date()
  },

  // פרשנויות
  {
    id: 'literal-interpretation',
    category: 'פרשנויות',
    name: 'פרשנות לשון החוק',
    shortDescription: 'פירוש על בסיס המילים והניסוח בלבד',
    fullDescription: 'פרשנות לשון החוק היא פירוש קפדני על בסיס המילים והניסוח בלבד, ללא התייחסות למטרות או כוונות המחוקק. זוהי גישה שמרנית המתאימה לחוקים ברורים וחד-משמעיים.',
    example: 'חקיקה ברורה עם נוסח חד משמעי שאינו דורש פירוש',
    difficulty: 'easy',
    icon: '🔍',
    relatedConcepts: ['textual-interpretation', 'strict-construction'],
    practicalNotes: 'מתאים כאשר לשון החוק ברורה ואין מקום לפירושים שונים',
    importance: 'important',
    lastUpdated: new Date()
  },
  {
    id: 'purposive-interpretation',
    category: 'פרשנויות',
    name: 'פרשנות תכליתית',
    shortDescription: 'פירוש החוק לפי מטרתו וכוונת המחוקק',
    fullDescription: 'פרשנות תכליתית מפרשת את החוק לפי מטרתו וכוונת המחוקק, לא רק לפי לשונו הפשוטה. זוהי גישה גמישה המאפשרת שיפוט דינמי ואיזון זכויות יסוד מול אינטרסים ציבוריים.',
    example: 'חוק יסוד: חופש הביטוי - איזון בין חופש לבטחון',
    precedent: 'בג"ץ 6055/95 צמח נגד שר הביטחון - פרשנות תכליתית',
    difficulty: 'medium',
    icon: '🔍⚖️',
    relatedConcepts: ['teleological-interpretation', 'balancing-test'],
    practicalNotes: 'מאפשרת גמישות אך דורשת זהירות למניעת שרירותיות',
    importance: 'critical',
    lastUpdated: new Date()
  },

  // עקרונות
  {
    id: 'rule-of-law',
    category: 'עקרונות',
    name: 'חוקיות המנהל',
    shortDescription: 'הרשות המבצעת רשאית לפעול רק על סמך חוק',
    fullDescription: 'עקרון חוקיות המנהל קובע שהרשות המבצעת רשאית לפעול רק על סמך חוק או תקנה תקפה. זהו עיקרון יסוד במשטר דמוקרטי המבטיח שהממשלה לא תפעל שרירותית.',
    example: 'פעולות שר שאינן מבוססות על סמכות חוקית - בטלות',
    precedent: 'בג"ץ 390/79 דוויקאת נגד ממשלת ישראל - חוקיות המנהל',
    difficulty: 'easy',
    icon: '⚖️',
    relatedConcepts: ['administrative-law', 'separation-powers'],
    practicalNotes: 'כל פעולה מנהלית צריכה בסיס חוקי ברור',
    importance: 'critical',
    lastUpdated: new Date()
  },
  {
    id: 'constitutional-supremacy',
    category: 'עקרונות',
    name: 'עליונות חוקי היסוד',
    shortDescription: 'חוקים רגילים כפופים לחוקי יסוד',
    fullDescription: 'עקרון עליונות חוקי היסוד קובע שחוקים רגילים כפופים לחוקי יסוד. בתי המשפט מוסמכים לבטל חקיקה או פעולות מנהליות הסותרות חוק יסוד.',
    example: 'ביטול חוק שפוגע בזכות יסוד ללא הצדקה מספקת',
    precedent: 'בג"ץ 1466/07 גל נגד כנסת ישראל - עליונות חוק היסוד',
    difficulty: 'hard',
    icon: '⚖️✨',
    relatedConcepts: ['basic-laws', 'constitutional-review'],
    practicalNotes: 'הביקורת החוקתית תלויה בקיומה של פסקת הגבלה בחוק היסוד',
    importance: 'critical',
    lastUpdated: new Date()
  }
];

const categories = ['הכל', 'חקיקה', 'תקדימים', 'מנהגים', 'פרשנויות', 'עקרונות', 'משפט בינלאומי', 'מקורות עזר'];
const difficulties = ['הכל', 'קל', 'בינוני', 'קשה', 'קשה מאוד'];

const difficultyLabels = {
  'easy': 'קל',
  'medium': 'בינוני',
  'hard': 'קשה', 
  'very-hard': 'קשה מאוד'
};

const difficultyColors = {
  'easy': '#4caf50',
  'medium': '#ff9800',
  'hard': '#f44336',
  'very-hard': '#9c27b0'
};

export const LegalConceptsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('הכל');
  const [selectedDifficulty, setSelectedDifficulty] = useState('הכל');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedConcept, setSelectedConcept] = useState<LegalConcept | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  const filteredConcepts = useMemo(() => {
    return legalConcepts.filter(concept => {
      const matchesSearch = concept.name.includes(searchTerm) || 
                           concept.shortDescription.includes(searchTerm) ||
                           concept.category.includes(searchTerm);
      const matchesCategory = selectedCategory === 'הכל' || concept.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'הכל' || 
                               difficultyLabels[concept.difficulty] === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchTerm, selectedCategory, selectedDifficulty]);

  const toggleRow = (conceptId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(conceptId)) {
      newExpanded.delete(conceptId);
    } else {
      newExpanded.add(conceptId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleBookmark = (conceptId: string) => {
    const newBookmarked = new Set(bookmarked);
    if (newBookmarked.has(conceptId)) {
      newBookmarked.delete(conceptId);
    } else {
      newBookmarked.add(conceptId);
    }
    setBookmarked(newBookmarked);
  };

  const openConceptDialog = (concept: LegalConcept) => {
    setSelectedConcept(concept);
  };

  const closeConceptDialog = () => {
    setSelectedConcept(null);
  };

  return (
    <Box sx={{ maxWidth: 1400, margin: 'auto', p: 2 }}>
      {/* כותרת */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
        <CardHeader
          title={
            <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
              📊 טבלת מושגים - מקורות המשפט בישראל
            </Typography>
          }
          subheader={
            <Typography variant="subtitle1" sx={{ textAlign: 'center', opacity: 0.9 }}>
              מאגר ידע אינטראקטיבי עם דוגמאות, פסיקה והסברים מפורטים
            </Typography>
          }
        />
      </Card>

      {/* פילטרים וחיפוש */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="חיפוש מושג"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>קטגוריה</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>רמת קושי</InputLabel>
                <Select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  {difficulties.map(difficulty => (
                    <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              נמצאו {filteredConcepts.length} מושגים • 
              {bookmarked.size > 0 && ` ${bookmarked.size} מושגים בסימניות`}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* טבלת מושגים */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>קטגוריה</TableCell>
                <TableCell>מושג</TableCell>
                <TableCell>הסבר קצר</TableCell>
                <TableCell>דוגמא / פסיקה</TableCell>
                <TableCell>רמת קושי</TableCell>
                <TableCell>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredConcepts.map((concept) => (
                <React.Fragment key={concept.id}>
                  <TableRow 
                    sx={{ 
                      '&:hover': { backgroundColor: '#f8f9fa' },
                      cursor: 'pointer'
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box component="span" sx={{ fontSize: '1.2rem' }}>{concept.icon}</Box>
                        <Typography variant="body2" fontWeight="medium">
                          {concept.category}
                        </Typography>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {concept.name}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 300 }}>
                        {concept.shortDescription}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2" sx={{ 
                        maxWidth: 200,
                        fontStyle: 'italic',
                        color: 'text.secondary'
                      }}>
                        {concept.example}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Chip 
                        label={difficultyLabels[concept.difficulty]}
                        size="small"
                        sx={{
                          backgroundColor: difficultyColors[concept.difficulty],
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() => toggleRow(concept.id)}
                          color={expandedRows.has(concept.id) ? 'primary' : 'default'}
                        >
                          <ExpandIcon 
                            sx={{
                              transform: expandedRows.has(concept.id) ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.3s'
                            }}
                          />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => openConceptDialog(concept)}
                          color="info"
                        >
                          <InfoIcon />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => toggleBookmark(concept.id)}
                          color={bookmarked.has(concept.id) ? 'warning' : 'default'}
                        >
                          {bookmarked.has(concept.id) ? <BookmarkedIcon /> : <BookmarkIcon />}
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                  
                  {/* שורה מורחבת */}
                  <TableRow>
                    <TableCell colSpan={6} sx={{ p: 0 }}>
                      <Collapse in={expandedRows.has(concept.id)} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 3, backgroundColor: '#fafafa' }}>
                          <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                              <Typography variant="h6" gutterBottom color="primary">
                                📚 הסבר מפורט
                              </Typography>
                              <Typography variant="body2" paragraph>
                                {concept.fullDescription}
                              </Typography>
                              
                              {concept.practicalNotes && (
                                <Alert severity="info" sx={{ mt: 2 }}>
                                  <Typography variant="body2">
                                    <strong>הערה מעשית:</strong> {concept.practicalNotes}
                                  </Typography>
                                </Alert>
                              )}
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                              {concept.precedent && (
                                <Box mb={2}>
                                  <Typography variant="h6" gutterBottom color="primary">
                                    ⚖️ פסיקה רלוונטית
                                  </Typography>
                                  <Paper elevation={1} sx={{ p: 2, backgroundColor: 'white' }}>
                                    <Typography variant="body2">
                                      {concept.precedent}
                                    </Typography>
                                  </Paper>
                                </Box>
                              )}
                              
                              <Typography variant="h6" gutterBottom color="primary">
                                🔗 מושגים קשורים
                              </Typography>
                              <Box display="flex" gap={1} flexWrap="wrap">
                                {concept.relatedConcepts.map((relatedId, index) => {
                                  const relatedConcept = legalConcepts.find(c => c.id === relatedId);
                                  return relatedConcept ? (
                                    <Chip 
                                      key={index}
                                      label={relatedConcept.name}
                                      size="small"
                                      variant="outlined"
                                      onClick={() => openConceptDialog(relatedConcept)}
                                      sx={{ cursor: 'pointer' }}
                                    />
                                  ) : null;
                                })}
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* דיאלוג מושג מפורט */}
      <Dialog 
        open={!!selectedConcept} 
        onClose={closeConceptDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedConcept && (
          <>
            <DialogTitle>
              <Box display="flex" justifyContent="between" alignItems="center">
                <Box display="flex" alignItems="center" gap={2}>
                  <Box component="span" sx={{ fontSize: '2rem' }}>{selectedConcept.icon}</Box>
                  <Box>
                    <Typography variant="h5">{selectedConcept.name}</Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      {selectedConcept.category}
                    </Typography>
                  </Box>
                </Box>
                <IconButton onClick={closeConceptDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Box mb={3}>
                <Box display="flex" gap={1} mb={2}>
                  <Chip 
                    label={difficultyLabels[selectedConcept.difficulty]}
                    sx={{
                      backgroundColor: difficultyColors[selectedConcept.difficulty],
                      color: 'white'
                    }}
                  />
                  <Chip 
                    label={selectedConcept.importance === 'critical' ? 'קריטי' :
                          selectedConcept.importance === 'important' ? 'חשוב' : 'משלים'}
                    color={selectedConcept.importance === 'critical' ? 'error' :
                           selectedConcept.importance === 'important' ? 'warning' : 'info'}
                  />
                </Box>
                
                <Typography variant="body1" paragraph>
                  {selectedConcept.fullDescription}
                </Typography>
              </Box>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandIcon />}>
                  <Typography variant="h6">📋 דוגמאות מעשיות</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    {selectedConcept.example}
                  </Typography>
                </AccordionDetails>
              </Accordion>

              {selectedConcept.precedent && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandIcon />}>
                    <Typography variant="h6">⚖️ פסיקה רלוונטית</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">
                      {selectedConcept.precedent}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}

              {selectedConcept.practicalNotes && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>הערה מעשית:</strong> {selectedConcept.practicalNotes}
                  </Typography>
                </Alert>
              )}
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => toggleBookmark(selectedConcept.id)}>
                {bookmarked.has(selectedConcept.id) ? 'הסר מסימניות' : 'הוסף לסימניות'}
              </Button>
              <Button onClick={closeConceptDialog} variant="contained">
                סגור
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
