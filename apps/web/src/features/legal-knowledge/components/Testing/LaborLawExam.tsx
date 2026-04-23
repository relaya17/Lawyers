import type { StandardLegalQuestion } from './standardLegalQuestion';
import { defineLegalExam } from './LegalExamRunner';

const questions: StandardLegalQuestion[] = [
  // חלק א' - יסודות דיני עבודה
  {
    id: 1,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '💼',
    category: 'חוזה עבודה',
    question: 'מה הדין לגבי חוזה עבודה בעל פה?',
    options: [
      { id: 'a', text: 'לא חוקי' },
      { id: 'b', text: 'חוקי רק לתקופה קצרה' },
      { id: 'c', text: 'חוקי לחלוטין' },
      { id: 'd', text: 'חוקי רק לעובדים זמניים' }
    ],
    correctAnswer: 'c',
    explanation: 'חוזה עבודה בעל פה הוא חוקי לחלוטין בישראל. החוק אינו דורש כתיבה פורמלית לחוזה עבודה.',
    lawReference: 'חוק חוזה עבודה, התשכ"ט-1969'
  },
  {
    id: 2,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '⚖️',
    category: 'פיטורין',
    question: 'עובד פוטר ללא הודעה מוקדמת. מה הזכויות שלו?',
    options: [
      { id: 'a', text: 'אין לו זכויות' },
      { id: 'b', text: 'זכאי רק לפיצויי פיטורין' },
      { id: 'c', text: 'זכאי להודעה מוקדמת ופיצויי פיטורין' },
      { id: 'd', text: 'זכאי רק להודעה מוקדמת' }
    ],
    correctAnswer: 'c',
    explanation: 'עובד שפוטר ללא הודעה מוקדמת זכאי הן לתשלום הודעה מוקדמת והן לפיצויי פיטורין.',
    precedent: 'פס"ד בית הדין לעבודה - זכויות עובד שפוטר',
    lawReference: 'חוק הודעה מוקדמת לפיטורין ולפרישה, התשס"א-2001'
  },
  {
    id: 3,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '💰',
    category: 'שכר מינימום',
    question: 'מה שכר המינימום הנוכחי בישראל?',
    options: [
      { id: 'a', text: '5,000 ₪' },
      { id: 'b', text: '5,571.75 ₪' },
      { id: 'c', text: '6,000 ₪' },
      { id: 'd', text: '7,000 ₪' }
    ],
    correctAnswer: 'b',
    explanation: 'שכר המינימום הנוכחי בישראל הוא 5,571.75 ₪ לחודש עבודה מלא (186 שעות).',
    lawReference: 'צו הרחבה לשכר מינימום'
  },
  {
    id: 4,
    type: 'true-false',
    difficulty: 'קל',
    icon: '⏰',
    category: 'שעות עבודה',
    question: 'עובד יכול לעבוד יותר מ-8 שעות ביום ללא אישור מיוחד',
    correctAnswer: 'false',
    explanation: 'עובד לא יכול לעבוד יותר מ-8 שעות ביום ללא אישור מיוחד של שר העבודה.',
    lawReference: 'חוק שעות עבודה ומנוחה, התשי"א-1951'
  },
  {
    id: 5,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🏥',
    category: 'בריאות ובטיחות',
    question: 'עובד נפגע בתאונת עבודה. מה הזכויות שלו?',
    options: [
      { id: 'a', text: 'זכאי רק לטיפול רפואי' },
      { id: 'b', text: 'זכאי לטיפול רפואי ופיצוי' },
      { id: 'c', text: 'זכאי לטיפול רפואי, פיצוי ודמי פגיעה' },
      { id: 'd', text: 'זכאי רק לדמי פגיעה' }
    ],
    correctAnswer: 'c',
    explanation: 'עובד שנפגע בתאונת עבודה זכאי לטיפול רפואי מלא, פיצוי בגין הנזק ודמי פגיעה מהביטוח הלאומי.',
    precedent: 'פס"ד בית הדין לעבודה - תאונות עבודה',
    lawReference: 'חוק הביטוח הלאומי, התשכ"ח-1968',
    academicNote:
        'ברמת אוניברסיטה מדגישים את הדו-שיח בין חוזה עבודה אישי לבין הוראות קוגנטיות וצווי הרחבה: גם כשהסכמים בעל פה תקפים, חובות דיווח לביטוח לאומי ושעות מנוחה עשויות להטיל חובות שלא ניתן לוותר עליהן בהסכמה.',
  },
];

const LaborLawExam = defineLegalExam({
  title: 'מבחן דיני עבודה',
  emoji: '💼',
  questions,
});

export default LaborLawExam;
