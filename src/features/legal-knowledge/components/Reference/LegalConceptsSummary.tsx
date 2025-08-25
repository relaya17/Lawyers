import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,

  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,

  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,

  MenuBook as MenuBookIcon,
  Balance as BalanceIcon,
  AccountBalance as AccountBalanceIcon,

  Description as DescriptionIcon,
  LocalPolice as LocalPoliceIcon,
  Business as BusinessIcon,

  Print as PrintIcon
} from '@mui/icons-material';

// הגדרת ממשק למושג משפטי
interface LegalConcept {
  id: string;
  term: string;
  definition: string;
  category: string;
  importance: 'basic' | 'intermediate' | 'advanced';
  examples?: string[];
  relatedTerms?: string[];
  legalSources?: string[];
}

// מושגים משפטיים מרכזיים
const legalConcepts: LegalConcept[] = [
  // מקורות המשפט
  {
    id: 'law',
    term: 'חוק',
    definition: 'כלל משפטי שנקבע על ידי הכנסת, המחייב את כלל האוכלוסייה ובעל עדיפות על פני מקורות משפט אחרים',
    category: 'מקורות המשפט',
    importance: 'basic',
    examples: ['חוק יסוד: כבוד האדם וחירותו', 'חוק החוזים', 'חוק העונשין'],
    relatedTerms: ['תקנה', 'צו', 'פסיקה'],
    legalSources: ['ח"כ יסוד: כבוד האדם וחירותו', 'חוק החוזים (כללי חלק) התשל"ג-1973']
  },
  {
    id: 'precedent',
    term: 'תקדין',
    definition: 'פסק דין של בית משפט שמהווה מקור משפט ומחייב בתי משפט נמוכים יותר במקרים דומים',
    category: 'מקורות המשפט',
    importance: 'basic',
    examples: ['בג"ץ 6821/93 בנק המזרח המאוחד', 'ע"א 243/83 ירושלים נגד גורדון'],
    relatedTerms: ['סטארה דצ\'יסיס', 'פסיקה', 'בית משפט עליון'],
    legalSources: ['דוקטרינת התקדין הבריטית', 'חוק בתי המשפט התשנ"ד-1984']
  },
  {
    id: 'custom',
    term: 'מנהג',
    definition: 'נוהג חוזר ונשנה שהציבור מכיר בו כמחייב משפטית, ובלבד שאינו סותר חוק',
    category: 'מקורות המשפט',
    importance: 'intermediate',
    examples: ['מנהגי המסחר', 'מנהגים במשפט המשפחה', 'מנהגי עבודה'],
    relatedTerms: ['חוק', 'נוהג', 'מנהג מקומי'],
    legalSources: ['פקודת המלך במועצה 1922-1947', 'חוק יסודות המשפט התש"ם-1980']
  },
  {
    id: 'interpretation',
    term: 'פרשנות',
    definition: 'תהליך של הבנה והסבר של הטקסט המשפטי כדי לקבוע את משמעותו והוראותיו',
    category: 'מקורות המשפט',
    importance: 'advanced',
    examples: ['פרשנות חוקתית', 'פרשנות מטרתית', 'פרשנות מילולית'],
    relatedTerms: ['הרמנויטיקה', 'מטרת החוק', 'כוונת המחוקק'],
    legalSources: ['חוק הפרשנות התשמ"א-1981']
  },

  // דיני חוזים
  {
    id: 'contract',
    term: 'חוזה',
    definition: 'הסכם משפטי בין צדדים היוצר זכויות וחובות הניתנות לאכיפה משפטית',
    category: 'דיני חוזים',
    importance: 'basic',
    examples: ['חוזה מכר', 'חוזה עבודה', 'חוזה שכירות'],
    relatedTerms: ['הצעה', 'קבלה', 'שיקול דעת'],
    legalSources: ['חוק החוזים (כללי חלק) התשל"ג-1973']
  },
  {
    id: 'offer',
    term: 'הצעה',
    definition: 'הצהרת רצון של אדם לכרות חוזה בתנאים מסוימים, הפונה לאדם מסוים או לציבור',
    category: 'דיני חוזים',
    importance: 'basic',
    examples: ['הצעת מחיר', 'הצעה בחנות', 'הצעה בפרסומת'],
    relatedTerms: ['קבלה', 'ביטול הצעה', 'הצעה מחייבת'],
    legalSources: ['סעיף 3 לחוק החוזים']
  },
  {
    id: 'acceptance',
    term: 'קבלה',
    definition: 'הסכמה מפורשת או משתמעת להצעה, היוצרת חוזה מחייב',
    category: 'דיני חוזים',
    importance: 'basic',
    examples: ['קבלה בכתב', 'קבלה בעל פה', 'קבלה במעשה'],
    relatedTerms: ['הצעה', 'שתיקה', 'התניה'],
    legalSources: ['סעיף 6 לחוק החוזים']
  },
  {
    id: 'consideration',
    term: 'תמורה',
    definition: 'יסוד הנדרש לתוקף החוזה, המתבטא במתן משהו בעלערך או בהתחייבות לעשות כן',
    category: 'דיני חוזים',
    importance: 'intermediate',
    examples: ['תשלום כסף', 'מתן שירות', 'הימנעות מפעולה'],
    relatedTerms: ['שיקול דעת', 'הסכם חינם', 'תמורה נאותה'],
    legalSources: ['סעיף 11 לחוק החוזים']
  },

  // דיני עונשין
  {
    id: 'criminal-intent',
    term: 'מחשבה פלילית',
    definition: 'הכוונה הפנימית הנדרשת לביצוע עבירה, הכוללת מודעות ורצון לגבי התוצאה האסורה',
    category: 'דיני עונשין',
    importance: 'basic',
    examples: ['כוונה ישירה', 'כוונה עקיפה', 'פזיזות'],
    relatedTerms: ['אקטוס ראוס', 'אשמה', 'כוונה פלילית'],
    legalSources: ['חוק העונשין התשל"ז-1977']
  },
  {
    id: 'actus-reus',
    term: 'מעשה פלילי',
    definition: 'המעשה החיצוני האסור כהגדרתו בחוק, המהווה את האלמנט הפיזי של העבירה',
    category: 'דיני עונשין',
    importance: 'basic',
    examples: ['מעשה פעיל', 'מחדל', 'תוצאה אסורה'],
    relatedTerms: ['מחשבה פלילית', 'סיבתיות', 'נסיון'],
    legalSources: ['חוק העונשין התשל"ז-1977']
  },
  {
    id: 'attempt',
    term: 'נסיון',
    definition: 'התחלת ביצוע עבירה שלא הושלמה, בתנאי שהייתה כוונה להשלימה',
    category: 'דיני עונשין',
    importance: 'intermediate',
    examples: ['נסיון לגניבה', 'נסיון לרצח', 'נסיון להונאה'],
    relatedTerms: ['הכנה לעבירה', 'ביצוע מושלם', 'חזרה בו'],
    legalSources: ['סעיף 25 לחוק העונשין']
  },

  // משפט חוקתי
  {
    id: 'constitutional-law',
    term: 'משפט חוקתי',
    definition: 'ענף המשפט העוסק בעקרונות היסוד של המדינה, זכויות האדם ומבנה השלטון',
    category: 'משפט חוקתי',
    importance: 'basic',
    examples: ['חוקי יסוד', 'זכויות אדם', 'הפרדת רשויות'],
    relatedTerms: ['דמוקרטיה', 'שלטון החוק', 'ביקורת שיפותית'],
    legalSources: ['חוקי היסוד של מדינת ישראל']
  },
  {
    id: 'human-rights',
    term: 'זכויות אדם',
    definition: 'זכויות בסיסיות השייכות לכל אדם מעצם היותו אדם, המוגנות על ידי המשפט החוקתי',
    category: 'משפט חוקתי',
    importance: 'basic',
    examples: ['זכות לחיים', 'זכות לחירות', 'זכות לכבוד'],
    relatedTerms: ['זכויות יסוד', 'חירויות', 'הגבלה חוקתית'],
    legalSources: ['חוק יסוד: כבוד האדם וחירותו']
  },
  {
    id: 'separation-of-powers',
    term: 'הפרדת רשויות',
    definition: 'עקרון חוקתי המחלק את כוח השלטון לשלוש רשויות: מחוקקת, מבצעת ושופטת',
    category: 'משפט חוקתי',
    importance: 'intermediate',
    examples: ['הכנסת', 'הממשלה', 'בתי המשפט'],
    relatedTerms: ['איזונים ובלמים', 'עצמאות השפיטה', 'שלטון החוק'],
    legalSources: ['חוק יסוד: הכנסת', 'חוק יסוד: הממשלה', 'חוק יסוד: השפיטה']
  },

  // משפט מינהלי
  {
    id: 'administrative-law',
    term: 'משפט מינהלי',
    definition: 'ענף המשפט העוסק בפעילות הרשות המבצעת ובביקורת השיפותית עליה',
    category: 'משפט מינהלי',
    importance: 'intermediate',
    examples: ['החלטות מינהליות', 'רישוי', 'פיטורין'],
    relatedTerms: ['שיקול דעת', 'הליך הוגן', 'ביקורת שיפותית'],
    legalSources: ['חוק יסודות המשפט התש"ם-1980']
  },
  {
    id: 'judicial-review',
    term: 'ביקורת שיפותית',
    definition: 'סמכותם של בתי המשפט לבחון את חוקיותן של פעולות הרשויות האחרות',
    category: 'משפט מינהלי',
    importance: 'advanced',
    examples: ['בג"ץ', 'בקשה לצו', 'ביטול החלטה מינהלית'],
    relatedTerms: ['שלטון החוק', 'הפרדת רשויות', 'צדק טבעי'],
    legalSources: ['חוק בתי המשפט התשנ"ד-1984']
  }
];

// קטגוריות המושגים
const categories = [
  { id: 'all', name: 'כל המושגים', icon: <MenuBookIcon /> },
  { id: 'מקורות המשפט', name: 'מקורות המשפט', icon: <BalanceIcon /> },
  { id: 'דיני חוזים', name: 'דיני חוזים', icon: <DescriptionIcon /> },
  { id: 'דיני עונשין', name: 'דיני עונשין', icon: <LocalPoliceIcon /> },
  { id: 'משפט חוקתי', name: 'משפט חוקתי', icon: <AccountBalanceIcon /> },
  { id: 'משפט מינהלי', name: 'משפט מינהלי', icon: <BusinessIcon /> }
];

export const LegalConceptsSummary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);

  // סינון המושגים לפי חיפוש וקטגוריה
  const filteredConcepts = legalConcepts.filter(concept => {
    const matchesSearch = concept.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         concept.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || concept.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // קבוצת המושגים לפי קטגוריות
  const conceptsByCategory = filteredConcepts.reduce((acc, concept) => {
    if (!acc[concept.category]) {
      acc[concept.category] = [];
    }
    acc[concept.category].push(concept);
    return acc;
  }, {} as Record<string, LegalConcept[]>);

  const handlePrint = () => {
    window.print();
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'basic': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case 'basic': return 'בסיסי';
      case 'intermediate': return 'בינוני';
      case 'advanced': return 'מתקדם';
      default: return '';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* כותרת ראשית */}
      <Box sx={{ textAlign: 'center' }} mb={4}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          📚 מושגים משפטיים - מדריך מקיף
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={3}>
          אוסף מקיף של מושגים יסודיים במשפט הישראלי
        </Typography>
        
        {/* כפתור הדפסה */}
        <Tooltip title="הדפסת המדריך">
          <IconButton onClick={handlePrint} color="primary" size="large">
            <PrintIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* חיפוש וסינון */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="חיפוש מושג..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {categories.map((category) => (
                  <Chip
                    key={category.id}
                    icon={category.icon}
                    label={category.name}
                    onClick={() => setSelectedCategory(category.id)}
                    color={selectedCategory === category.id ? 'primary' : 'default'}
                    variant={selectedCategory === category.id ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* סטטיסטיקות */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {legalConcepts.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                סה"כ מושגים
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {legalConcepts.filter(c => c.importance === 'basic').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                מושגים בסיסיים
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {legalConcepts.filter(c => c.importance === 'intermediate').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                מושגים בינוניים
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {legalConcepts.filter(c => c.importance === 'advanced').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                מושגים מתקדמים
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* תוכן המושגים */}
      {Object.entries(conceptsByCategory).map(([category, concepts]) => (
        <Card key={category} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom color="primary">
              {category} ({concepts.length} מושגים)
            </Typography>
            
            {concepts.map((concept) => (
              <Accordion
                key={concept.id}
                expanded={expandedConcept === concept.id}
                onChange={() => setExpandedConcept(
                  expandedConcept === concept.id ? null : concept.id
                )}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box display="flex" alignItems="center" gap={2} width="100%">
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {concept.term}
                    </Typography>
                    <Chip
                      label={getImportanceText(concept.importance)}
                      color={getImportanceColor(concept.importance) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                      size="small"
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    {/* הגדרה */}
                    <Typography variant="body1" paragraph>
                      <strong>הגדרה:</strong> {concept.definition}
                    </Typography>

                    {/* דוגמאות */}
                    {concept.examples && concept.examples.length > 0 && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          <strong>דוגמאות:</strong>
                        </Typography>
                        <List dense>
                          {concept.examples.map((example, index) => (
                            <ListItem key={index}>
                              <ListItemText primary={`• ${example}`} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                    {/* מושגים קשורים */}
                    {concept.relatedTerms && concept.relatedTerms.length > 0 && (
                      <Box mb={2}>
                        <Typography variant="subtitle2" gutterBottom>
                          <strong>מושגים קשורים:</strong>
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {concept.relatedTerms.map((term, index) => (
                            <Chip key={index} label={term} size="small" variant="outlined" />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* מקורות משפטיים */}
                    {concept.legalSources && concept.legalSources.length > 0 && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          <strong>מקורות משפטיים:</strong>
                        </Typography>
                        <List dense>
                          {concept.legalSources.map((source, index) => (
                            <ListItem key={index}>
                              <ListItemText 
                                primary={`📜 ${source}`}
                                sx={{ fontStyle: 'italic' }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* הודעה אם אין תוצאות */}
      {filteredConcepts.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              לא נמצאו מושגים התואמים את החיפוש
            </Typography>
            <Typography variant="body2" color="text.secondary">
              נסה לשנות את מילות החיפוש או את הקטגוריה
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* כותרת תחתונה */}
      <Box sx={{ textAlign: 'center' }} mt={6} pt={4} borderTop="1px solid #eee">
        <Typography variant="body2" color="text.secondary">
          מדריך מושגים משפטיים - מערכת לימוד דיגיטלית למשפט ישראלי
        </Typography>
      </Box>
    </Container>
  );
};

export default LegalConceptsSummary;
