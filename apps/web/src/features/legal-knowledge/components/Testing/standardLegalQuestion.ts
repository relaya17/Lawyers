/** פורמט שאלה אחיד למבחנים בסגנון רב-ברירה / נכון-לא נכון / מקרה */

export type StandardQuestionDifficulty = 'קל' | 'בינוני' | 'קשה' | 'קשה מאוד';

export interface StandardLegalQuestion {
    id: number;
    type: 'multiple-choice' | 'true-false' | 'case-study';
    difficulty: StandardQuestionDifficulty;
    icon: string;
    category: string;
    question: string;
    options?: { id: string; text: string }[];
    /** ערך תשובה נכונה: מזהה אפשרות (a,b,...) או 'true' / 'false' */
    correctAnswer: string;
    explanation: string;
    precedent?: string;
    lawReference?: string;
    /** פסקה נוספת ברמת סמינר / אוניברסיטה — דיון בעקרונות, מבחני פסיקה, ביקורת */
    academicNote?: string;
}

export type LegalExamInteractionMode = 'exam' | 'practice';
