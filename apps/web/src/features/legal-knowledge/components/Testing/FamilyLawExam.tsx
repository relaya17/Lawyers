import type { StandardLegalQuestion } from './standardLegalQuestion';
import { defineLegalExam } from './LegalExamRunner';

const questions: StandardLegalQuestion[] = [
  // חלק א' - נישואין וגירושין
  {
    id: 1,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '💒',
    category: 'נישואין',
    question: 'מה הדין לגבי נישואין אזרחיים בישראל?',
    options: [
      { id: 'a', text: 'אסורים לחלוטין' },
      { id: 'b', text: 'מותרים רק לזוגות מעורבים' },
      { id: 'c', text: 'מותרים רק בחו"ל' },
      { id: 'd', text: 'מותרים רק לחסרי דת' }
    ],
    correctAnswer: 'c',
    explanation: 'נישואין אזרחיים בישראל מותרים רק בחו"ל. בתי המשפט בישראל מכירים בנישואין אזרחיים שנערכו בחו"ל.',
    lawReference: 'חוק שיפוט בתי דין רבניים (נישואין וגירושין), התשי"ג-1953'
  },
  {
    id: 2,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'גירושין',
    question: 'אישה מסרבת לקבל גט מבעלה. מה הדין?',
    options: [
      { id: 'a', text: 'הבעל יכול לגרש בעל כורחה' },
      { id: 'b', text: 'בית הדין יכול לכפות גט' },
      { id: 'c', text: 'הבעל יכול לקבל היתר נישואין' },
      { id: 'd', text: 'הבעל יכול להתחתן עם אישה נוספת' }
    ],
    correctAnswer: 'c',
    explanation: 'במקרה של סרבנות גט, הבעל יכול לפנות לבית הדין הרבני ולבקש היתר נישואין עם אישה נוספת.',
    precedent: 'פס"ד בית הדין הרבני הגדול - היתר נישואין במקרה של סרבנות גט',
    lawReference: 'חוק שיפוט בתי דין רבניים'
  },
  {
    id: 3,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '💰',
    category: 'מזונות',
    question: 'עד איזה גיל חייב אב במזונות ילדיו?',
    options: [
      { id: 'a', text: 'עד גיל 18' },
      { id: 'b', text: 'עד גיל 21' },
      { id: 'c', text: 'עד גיל 24' },
      { id: 'd', text: 'עד גיל 25' }
    ],
    correctAnswer: 'a',
    explanation: 'האב חייב במזונות ילדיו עד גיל 18. לאחר מכן, אם הילד לומד, החובה נמשכת עד גיל 21.',
    lawReference: 'חוק לתיקון דיני המשפחה (מזונות), התשי"ט-1959'
  },
  {
    id: 4,
    type: 'true-false',
    difficulty: 'קל',
    icon: '👶',
    category: 'משמורת',
    question: 'במקרה של גירושין, האם תמיד מקבלת משמורת על הילדים',
    correctAnswer: 'false',
    explanation: 'לא תמיד. בית המשפט בוחן את טובת הילד ומחליט מי ההורה המתאים למשמורת. כיום יש נטייה למשמורת משותפת.',
    lawReference: 'חוק הכשרות המשפטית והאפוטרופסות, התשכ"ב-1962'
  },
  {
    id: 5,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🏠',
    category: 'חלוקת רכוש',
    question: 'זוג נשוי 20 שנה מתגרש. איך יחולק הרכוש המשותף?',
    options: [
      { id: 'a', text: '50-50 תמיד' },
      { id: 'b', text: 'לפי תרומת כל צד' },
      { id: 'c', text: 'לפי הסכם ממון' },
      { id: 'd', text: 'לפי החלטת בית המשפט' }
    ],
    correctAnswer: 'a',
    explanation: 'בנישואין בישראל חל חזקת השיתוף. כל הרכוש שנצבר במהלך הנישואין נחשב משותף ומתחלק 50-50.',
    precedent: 'פס"ד נחשון - חזקת השיתוף ברכוש',
    lawReference: 'חזקת השיתוף - פסיקה',
    academicNote:
        'בפקולטות מבחינים בין חזקת השיתוף לבין הסכמי ממון ורכוש חיצוני (נכס "פרט" לפי סעיף 8 לחוק יחסי ממון). במצבים בהם קיים הסכם ממון תקף, חלוקת הרכוש תעקוב אחרי ההסכם ולא אחרי 50-50 אוטומטי.',
  },
];

const FamilyLawExam = defineLegalExam({
  title: 'מבחן דיני משפחה',
  emoji: '🏛️',
  questions,
});

export default FamilyLawExam;
