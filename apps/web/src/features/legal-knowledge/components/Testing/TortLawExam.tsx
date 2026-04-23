import type { StandardLegalQuestion } from './standardLegalQuestion';
import { defineLegalExam } from './LegalExamRunner';

const questions: StandardLegalQuestion[] = [
  // חלק א' - יסודות דיני נזיקין
  {
    id: 1,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '⚖️',
    category: 'עוולת הרשלנות',
    question: 'מה היסודות הנדרשים להוכחת עוולת הרשלנות?',
    options: [
      { id: 'a', text: 'נזק וקשר סיבתי בלבד' },
      { id: 'b', text: 'חובת זהירות, הפרה, נזק וקשר סיבתי' },
      { id: 'c', text: 'כוונה לפגוע בלבד' },
      { id: 'd', text: 'נזק כספי בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'עוולת הרשלנות דורשת ארבעה יסודות: חובת זהירות, הפרת החובה, נזק וקשר סיבתי בין ההפרה לנזק.',
    lawReference: 'סעיף 35 לפקודת הנזיקין'
  },
  {
    id: 2,
    type: 'case-study',
    difficulty: 'קשה',
    icon: '🏥',
    category: 'רשלנות רפואית',
    question: 'רופא שגרם לנזק לחולה עקב טעות מקצועית. מה הדין?',
    options: [
      { id: 'a', text: 'לא אחראי כי פעל בתום לב' },
      { id: 'b', text: 'אחראי רק אם פעל ברשלנות קיצונית' },
      { id: 'c', text: 'אחראי אם הפר את חובת הזהירות המקצועית' },
      { id: 'd', text: 'אחראי רק אם התכוון לפגוע' }
    ],
    correctAnswer: 'c',
    explanation: 'רופא אחראי בנזיקין אם הפר את חובת הזהירות המקצועית שלו כלפי החולה, גם אם לא התכוון לפגוע.',
    precedent: 'פס"ד בית המשפט העליון - רשלנות רפואית',
    lawReference: 'סעיף 35 לפקודת הנזיקין'
  },
  {
    id: 3,
    type: 'multiple-choice',
    difficulty: 'בינוני',
    icon: '💰',
    category: 'פיצויים',
    question: 'מה סוגי הפיצויים העיקריים בדיני נזיקין?',
    options: [
      { id: 'a', text: 'פיצוי כספי בלבד' },
      { id: 'b', text: 'פיצוי כספי ופיצוי עונשי' },
      { id: 'c', text: 'פיצוי כספי, פיצוי עונשי ופיצוי עונשי' },
      { id: 'd', text: 'פיצוי כספי, פיצוי עונשי ופיצוי עונשי' }
    ],
    correctAnswer: 'b',
    explanation: 'הפיצויים העיקריים בדיני נזיקין הם פיצוי כספי (פיצוי נזיקי) ופיצוי עונשי (פיצוי עונשי).',
    lawReference: 'פקודת הנזיקין'
  },
  {
    id: 4,
    type: 'true-false',
    difficulty: 'קל',
    icon: '🛡️',
    category: 'אחריות',
    question: 'הורה אחראי בנזיקין על מעשי ילדו הקטין',
    correctAnswer: 'true',
    explanation: 'כן, הורה אחראי בנזיקין על מעשי ילדו הקטין לפי סעיף 13 לפקודת הנזיקין.',
    lawReference: 'סעיף 13 לפקודת הנזיקין'
  },
  {
    id: 5,
    type: 'case-study',
    difficulty: 'קשה מאוד',
    icon: '🏢',
    category: 'אחריות מעביד',
    question: 'עובד גרם נזק לאדם שלישי במהלך עבודתו. מי אחראי?',
    options: [
      { id: 'a', text: 'העובד בלבד' },
      { id: 'b', text: 'המעביד בלבד' },
      { id: 'c', text: 'המעביד והעובד יחד' },
      { id: 'd', text: 'אין אחריות' }
    ],
    correctAnswer: 'c',
    explanation: 'המעביד אחראי בנזיקין על מעשי עובדו במהלך עבודתו, אך העובד יכול להיות אחראי גם כן.',
    precedent: 'פס"ד בית המשפט העליון - אחריות מעביד',
    lawReference: 'סעיף 12 לפקודת הנזיקין',
  },
];

const TortLawExam = defineLegalExam({
  title: 'מבחן דיני נזיקין',
  emoji: '⚖️',
  questions,
});

export default TortLawExam;
