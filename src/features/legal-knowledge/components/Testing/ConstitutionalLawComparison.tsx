import React, { useState } from 'react';
import { Box } from '@mui/material';
import { CheckCircle, Cancel as XCircle, Flag, Business as Building, Balance as Scale, Book } from '@mui/icons-material';

interface Question {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'comparison';
  category: string;
  question: string;
  options?: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
  usExample?: string;
  israelExample?: string;
  difficulty: 'קל' | 'בינוני' | 'קשה';
}

const questions: Question[] = [
  {
    id: 1,
    type: 'multiple-choice',
    category: 'הרשות המחוקקת',
    difficulty: 'קל',
    question: 'כיצד מורכב הקונגרס האמריקאי?',
    options: [
      { id: 'a', text: 'בית נבחרים בלבד' },
      { id: 'b', text: 'סנאט ובית נבחרים' },
      { id: 'c', text: 'שלושה בתים' },
      { id: 'd', text: 'סנאט בלבד' }
    ],
    correctAnswer: 'b',
    explanation: 'הקונגרס האמריקאי מורכב משני בתים: הסנאט (מיצג את המדינות באופן שווה) ובית הנבחרים (מיצג לפי גודל האוכלוסייה).',
    usExample: 'הסנאט: 2 נציגים מכל מדינה, בית הנבחרים: לפי אוכלוסייה',
    israelExample: 'הכנסת: בית אחד עם 120 חברים הנבחרים באופן יחסי'
  },
  {
    id: 2,
    type: 'multiple-choice',
    category: 'הרשות המבצעת',
    difficulty: 'בינוני',
    question: 'מה ההבדל העיקרי בין בחירת הנשיא האמריקאי לבחירת ראש הממשלה הישראלי?',
    options: [
      { id: 'a', text: 'הנשיא נבחר ישירות, ראש הממשלה ממונה על ידי הכנסת' },
      { id: 'b', text: 'שניהם נבחרים ישירות' },
      { id: 'c', text: 'שניהם ממונים על ידי הפרלמנט' },
      { id: 'd', text: 'אין הבדל משמעותי' }
    ],
    correctAnswer: 'a',
    explanation: 'הנשיא האמריקאי נבחר ישירות על ידי העם (דרך מכללת הבוחרים), בעוד ראש הממשלה הישראלי נבחר על ידי הכנסת ומכהן כל עוד יש לו את אמונה.',
    usExample: 'נשיא לארבע שנים, מקסימום שתי קדנציות',
    israelExample: 'ראש ממשלה ללא הגבלת זמן, כל עוד יש אמון כנסת'
  },
  {
    id: 3,
    type: 'true-false',
    category: 'חוקה וחוקי יסוד',
    difficulty: 'בינוני',
    question: 'לישראל יש חוקה כתובה ומקיפה כמו לארצות הברית',
    correctAnswer: 'false',
    explanation: 'לארצות הברית יש חוקה כתובה ומקיפה משנת 1787, בעוד לישראל יש חוקי יסוד חלקיים שמהווים חוקה מתפתחת.',
    usExample: 'החוקה האמריקאית - מסמך אחד מקיף',
    israelExample: 'חוקי יסוד נפרדים: הכנסת, הממשלה, כבוד האדם וחירותו וכו\'',
  },
  {
    id: 4,
    type: 'multiple-choice',
    category: 'הדחה ופיקוח',
    difficulty: 'קשה',
    question: 'איך ניתן להדיח נשיא בארצות הברית לעומת ראש ממשלה בישראל?',
    options: [
      { id: 'a', text: 'שניהם דורשים רוב של 2/3' },
      { id: 'b', text: 'הנשיא דורש 2/3 בסנאט, ראש הממשלה - הצבעת אי אמון רגילה' },
      { id: 'c', text: 'שניהם דורשים רוב פשוט' },
      { id: 'd', text: 'לא ניתן להדיח אף אחד מהם' }
    ],
    correctAnswer: 'b',
    explanation: 'הדחת נשיא אמריקאי דורשת הרשעה ברוב של 2/3 בסנאט אחרי הצבעת האישום בבית הנבחרים. בישראל, הכנסת יכולה להפיל ממשלה בהצבעת אי-אמון ברוב פשוט.',
    usExample: 'הליך אימפיצ\'מנט מורכב ונדיר',
    israelExample: 'הצבעת אי אמון יכולה להתקיים בכל עת'
  },
  {
    id: 5,
    type: 'comparison',
    category: 'מגבלות קדנציה',
    difficulty: 'בינוני',
    question: 'השווה בין מגבלות הקדנציה לנשיא האמריקאי לעומת ראש הממשלה הישראלי',
    correctAnswer: 'comparison',
    explanation: 'הנשיא האמריקאי מוגבל לשתי קדנציות של 4 שנים כל אחת (סך הכל 8 שנים). בישראל אין מגבלה על מספר הקדנציות של ראש הממשלה.',
    usExample: 'תיקון 22 לחוקה - מקסימום שתי קדנציות',
    israelExample: 'אין מגבלה חוקית (הצעת חוק של גדעון סער מציעה להוסיף מגבלה)'
  },
  {
    id: 6,
    type: 'multiple-choice',
    category: 'פרדת רשויות',
    difficulty: 'קשה',
    question: 'איך מתבטאת הפרדת הרשויות בארצות הברית לעומת ישראל?',
    options: [
      { id: 'a', text: 'בשתי המדינות יש הפרדה מוחלטת' },
      { id: 'b', text: 'בארצות הברית הפרדה נוקשה יותר, בישראל גמישה יותר' },
      { id: 'c', text: 'בישראל הפרדה נוקשה יותר' },
      { id: 'd', text: 'אין הפרדת רשויות בשתי המדינות' }
    ],
    correctAnswer: 'b',
    explanation: 'בארצות הברית יש הפרדת רשויות נוקשה יותר (הנשיא אינו תלוי בקונגרס). בישראל יש מערכת פרלמנטרית עם הפרדה גמישה יותר (הממשלה תלויה באמון הכנסת).',
    usExample: 'מערכת נשיאותית - הנשיא עצמאי מהקונגרס',
    israelExample: 'מערכת פרלמנטרית - הממשלה תלויה בכנסת'
  },
  {
    id: 7,
    type: 'true-false',
    category: 'זכויות יסוד',
    difficulty: 'בינוני',
    question: 'בשתי המדינות זכויות היסוד מוגנות ברמה חוקתית',
    correctAnswer: 'true',
    explanation: 'בארצות הברית זכויות היסוד מוגנות בחוקה ובתיקוניה (Bill of Rights). בישראל הן מוגנות בחוקי יסוד כמו "כבוד האדם וחירותו".',
    usExample: 'התיקונים הראשונים לחוקה (Bill of Rights)',
    israelExample: 'חוק יסוד: כבוד האדם וחירותו, חופש העיסוק'
  },
  {
    id: 8,
    type: 'multiple-choice',
    category: 'ביקורת שיפוטית',
    difficulty: 'קשה',
    question: 'איך התפתחה הביקורת השיפוטית בשתי המדינות?',
    options: [
      { id: 'a', text: 'בשתיהן מעוגנת בחוקה מההתחלה' },
      { id: 'b', text: 'בארצות הברית פותחה בפסיקה, בישראל בחוקי יסוד' },
      { id: 'c', text: 'רק בישראל יש ביקורת שיפוטית' },
      { id: 'd', text: 'אין ביקורת שיפוטית בשתי המדינות' }
    ],
    correctAnswer: 'b',
    explanation: 'בארצות הברית הביקורת השיפוטית התפתחה בפסיקה (Marbury v. Madison, 1803). בישראל היא מעוגנת בחוקי יסוד ובמיוחד מהמהפכה החוקתית של שנות ה-90.',
    usExample: 'פסק דין Marbury v. Madison (1803)',
    israelExample: 'חוק יסוד: כבוד האדם וחירותו (1992)'
  },
  {
    id: 9,
    type: 'multiple-choice',
    category: 'מערכת בחירות',
    difficulty: 'בינוני',
    question: 'מה ההבדל במערכות הבחירות?',
    options: [
      { id: 'a', text: 'שתיהן מערכות מחוזיות' },
      { id: 'b', text: 'ארצות הברית מחוזית, ישראל יחסית' },
      { id: 'c', text: 'שתיהן מערכות יחסיות' },
      { id: 'd', text: 'ישראל מחוזית, ארצות הברית יחסית' }
    ],
    correctAnswer: 'b',
    explanation: 'בארצות הברית מערכת בחירות מחוזית (district-based) עם מכללת בוחרים. בישראל מערכת יחסית עם כל המדינה כמחוז בחירות אחד.',
    usExample: 'מכללת בוחרים + מחוזות בחירה',
    israelExample: 'מערכת יחסית + אחוז חסימה'
  },
  {
    id: 10,
    type: 'true-false',
    category: 'פדרליזם',
    difficulty: 'קל',
    question: 'ישראל היא מדינה פדרלית כמו ארצות הברית',
    correctAnswer: 'false',
    explanation: 'ארצות הברית היא מדינה פדרלית עם חלוקת סמכויות בין הפדרציה למדינות. ישראל היא מדינה אוניטרית (מרכזית) ללא חלוקה פדרלית.',
    usExample: 'חלוקת סמכויות בין הפדרציה ל-50 המדינות',
    israelExample: 'מערכת ממשל מרכזית עם רשויות מקומיות'
  }
];

const ConstitutionalLawComparison: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [examCompleted, setExamCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerId: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answerId);
    setAnswers({ ...answers, [currentQuestion.id]: answerId });
    setShowFeedback(true);
    
    const isCorrect = currentQuestion.type === 'true-false' 
      ? (answerId === 'true') === (currentQuestion.correctAnswer === 'true')
      : answerId === currentQuestion.correctAnswer;
      
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setExamCompleted(true);
    }
  };

  const resetExam = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswers({});
    setScore(0);
    setExamCompleted(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'קל': return 'text-green-600 bg-green-100';
      case 'בינוני': return 'text-yellow-600 bg-yellow-100';
      case 'קשה': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (examCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg" dir="rtl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Flag className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">המבחן הושלם!</h1>
            <Building className="w-8 h-8 text-red-600" />
          </div>
          
          <div className={`inline-block px-8 py-4 rounded-lg mb-6 ${percentage >= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            <h2 className="text-2xl font-bold mb-2">הציון שלך: {score}/{questions.length}</h2>
            <p className="text-xl">{percentage}%</p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-bold text-blue-800 mb-4">🎓 מה למדנו?</h3>
            <div className="text-blue-700 space-y-2">
              <p>• הבנת ההבדלים בין המערכת הנשיאותית והפרלמנטרית</p>
              <p>• השוואה בין חוקה כתובה לחוקי יסוד</p>
              <p>• הכרת מנגנוני הפיקוח והביקורת בשתי המערכות</p>
              <p>• הבנת עקרונות הפרדת הרשויות והפדרליזם</p>
            </div>
          </div>
          
          <button
            onClick={resetExam}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 התחל מחדש
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg" dir="rtl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Flag className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">משפט חוקתי השוואתי</h1>
          <Building className="w-8 h-8 text-red-600" />
        </div>
        <p className="text-lg text-gray-600">השוואה בין המערכת החוקתית האמריקאית לישראלית</p>
        
        {/* Progress */}
        <div className="w-full bg-gray-200 rounded-full h-3 mt-6">
          <Box 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            sx={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          שאלה {currentQuestionIndex + 1} מתוך {questions.length}
        </p>
        
        <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">ציון נוכחי: {score}/{Object.keys(answers).length}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
            {currentQuestion.difficulty}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-blue-800">
            שאלה {currentQuestion.id}: {currentQuestion.category}
          </h2>
          <span className="text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded">
            {currentQuestion.type === 'multiple-choice' ? 'רב-ברירה' : 
             currentQuestion.type === 'true-false' ? 'נכון/לא נכון' : 'השוואה'}
          </span>
        </div>
        <p className="text-blue-700 text-lg leading-relaxed">{currentQuestion.question}</p>
      </div>

      {/* Answer Options */}
      <div className="space-y-4 mb-6">
        {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((option) => (
          <button
            key={option.id}
            onClick={() => handleAnswerSelect(option.id)}
            disabled={showFeedback}
            className={`w-full p-4 text-right rounded-lg border-2 transition-all duration-200 ${
              showFeedback
                ? option.id === currentQuestion.correctAnswer
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : option.id === selectedAnswer
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : 'border-gray-200 bg-gray-50 text-gray-600'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg">{option.id.toUpperCase()}.</span>
                <span className="text-lg">{option.text}</span>
              </div>
              <div>
                {showFeedback && option.id === currentQuestion.correctAnswer && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
                {showFeedback && option.id === selectedAnswer && option.id !== currentQuestion.correctAnswer && (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </button>
        ))}

        {currentQuestion.type === 'true-false' && (
          <div className="flex gap-4">
            <button
              onClick={() => handleAnswerSelect('true')}
              disabled={showFeedback}
              className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                showFeedback
                  ? (currentQuestion.correctAnswer === 'true')
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : selectedAnswer === 'true'
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">✅</span>
                <span className="text-lg font-medium">נכון</span>
              </div>
            </button>
            
            <button
              onClick={() => handleAnswerSelect('false')}
              disabled={showFeedback}
              className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${
                showFeedback
                  ? (currentQuestion.correctAnswer === 'false')
                    ? 'border-green-500 bg-green-50 text-green-800'
                    : selectedAnswer === 'false'
                    ? 'border-red-500 bg-red-50 text-red-800'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                  : 'border-gray-200 hover:border-red-300 hover:bg-red-50 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">❌</span>
                <span className="text-lg font-medium">לא נכון</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Book className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">הסבר מפורט</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border-r-4 border-blue-500">
              <p className="text-gray-700 mb-3">{currentQuestion.explanation}</p>
            </div>
            
            {currentQuestion.usExample && (
              <div className="bg-white p-4 rounded-lg border-r-4 border-blue-400">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  🇺🇸 ארצות הברית:
                </h4>
                <p className="text-gray-700">{currentQuestion.usExample}</p>
              </div>
            )}
            
            {currentQuestion.israelExample && (
              <div className="bg-white p-4 rounded-lg border-r-4 border-blue-600">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  🇮🇱 ישראל:
                </h4>
                <p className="text-gray-700">{currentQuestion.israelExample}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-center">
        {showFeedback && (
          <button
            onClick={nextQuestion}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {currentQuestionIndex < questions.length - 1 ? 'שאלה הבאה →' : 'סיים מבחן 🏁'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ConstitutionalLawComparison;
