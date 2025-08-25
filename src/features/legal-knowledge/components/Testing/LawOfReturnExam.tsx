import React, { useState } from 'react';
import { CheckCircle, Cancel as XCircle, Home, Group as Users, Balance as Scale, Book, Star } from '@mui/icons-material';

interface Question {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'case-study';
  category: string;
  question: string;
  options?: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
  legalSource?: string;
  difficulty: 'קל' | 'בינוני' | 'קשה';
  precedent?: string;
}

const questions: Question[] = [
  {
    id: 1,
    type: 'multiple-choice',
    category: 'מטרת החוק',
    difficulty: 'קל',
    question: 'מה המטרה העיקרית של חוק השבות?',
    options: [
      { id: 'a', text: 'לאפשר ליהודים מהגולה לעלות לישראל' },
      { id: 'b', text: 'להגדיר מיהו אזרח ישראלי' },
      { id: 'c', text: 'לקבוע את דיני הנישואין' },
      { id: 'd', text: 'להסדיר את מעמד הרבנות' }
    ],
    correctAnswer: 'a',
    explanation: 'חוק השבות נועד לאפשר ליהודים מהגולה לעלות לישראל ומבטא את תפיסת מדינת ישראל כמדינה יהודית.',
    legalSource: 'חוק השבות, התש"י-1950'
  },
  {
    id: 2,
    type: 'multiple-choice',
    category: 'הגדרת יהודי',
    difficulty: 'בינוני',
    question: 'איך הוגדר "יהודי" בתיקון חוק השבות משנת 1970?',
    options: [
      { id: 'a', text: 'מי שנולד לאב יהודי' },
      { id: 'b', text: 'מי שנולד לאם יהודייה או התגייר, ואינו בן דת אחרת' },
      { id: 'c', text: 'מי שמאמין ביהדות' },
      { id: 'd', text: 'מי שחי בישראל' }
    ],
    correctAnswer: 'b',
    explanation: 'תיקון 1970 קבע הגדרה ברורה: יהודי הוא מי שנולד לאם יהודייה או התגייר, ואינו בן דת אחרת.',
    legalSource: 'תיקון חוק השבות 1970'
  },
  {
    id: 3,
    type: 'true-false',
    category: 'זכויות בני משפחה',
    difficulty: 'בינוני',
    question: 'חוק השבות מעניק זכות עלייה רק ליהודים עצמם, ולא לבני משפחתם',
    correctAnswer: 'false',
    explanation: 'חוק השבות מעניק זכות עלייה גם לבני משפחה מקרבה ראשונה: ילד, נכד, בן/בת זוג של יהודי, ילדו או נכדו (סעיף 4א).',
    legalSource: 'סעיף 4א לחוק השבות'
  },
  {
    id: 4,
    type: 'case-study',
    category: 'פסיקה מכוננת',
    difficulty: 'קשה',
    question: 'פרשת האח דניאל (רופאייזן) - יהודי שהמיר את דתו לנצרות ביקש לעלות לישראל. מה קבע בית המשפט?',
    options: [
      { id: 'a', text: 'זכאי לעלות כי נולד יהודי' },
      { id: 'b', text: 'לא זכאי לעלות כי המיר דתו' },
      { id: 'c', text: 'זכאי רק לאזרחות, לא לעלייה' },
      { id: 'd', text: 'החלטה תלויה ברבנות' }
    ],
    correctAnswer: 'b',
    explanation: 'בג"ץ קבע שחוק השבות הוא חוק חילוני, ויש לפרש "יהודי" לפי משמעות לאומית-תרבותית. מי שהמיר דתו אינו זכאי לעלות.',
    precedent: 'ע"א 72/62 רופאייזן נ\' שר הפנים'
  },
  {
    id: 5,
    type: 'case-study',
    category: 'פסיקה מכוננת',
    difficulty: 'קשה',
    question: 'פרשת שליט - יהודי נשוי לנוצרייה ביקש לרשום את ילדיהם כיהודים. מה קבע בית המשפט?',
    options: [
      { id: 'a', text: 'הילדים לא יירשמו כיהודים' },
      { id: 'b', text: 'הילדים יירשמו כיהודים לפי הלאום' },
      { id: 'c', text: 'הילדים יירשמו רק אם יתגיירו' },
      { id: 'd', text: 'החלטה תלויה ברבנות' }
    ],
    correctAnswer: 'b',
    explanation: 'בג"ץ קבע שהילדים יירשמו כיהודים לפי הלאום, כי הם גדלים בבית יהודי עם אב יהודי. פסיקה זו גרמה לסערה והובילה לתיקון החוק ב-1970.',
    precedent: 'ע"א 58/68 שליט נ\' שר הפנים'
  },
  {
    id: 6,
    type: 'multiple-choice',
    category: 'זכויות בני משפחה',
    difficulty: 'בינוני',
    question: 'מתי זכות השבות לא תינתן לבן זוג של יהודי?',
    options: [
      { id: 'a', text: 'אם הוא לא יהודי' },
      { id: 'b', text: 'אם התא המשפחתי פורק לפני קבלת האזרחות' },
      { id: 'c', text: 'אם הוא מבוגר מדי' },
      { id: 'd', text: 'אם הוא לא דובר עברית' }
    ],
    correctAnswer: 'b',
    explanation: 'אם התא המשפחתי פורק לפני קבלת האזרחות או אם הקשר נוצר לצורך קבלת אזרחות בלבד, זכות השבות לא תינתן.',
    precedent: 'בג"ץ סמוילוב נ\' שר הפנים'
  },
  {
    id: 7,
    type: 'true-false',
    category: 'גיור',
    difficulty: 'בינוני',
    question: 'משרד הפנים מכיר רק בגיורים אורתודוקסיים לצורך חוק השבות',
    correctAnswer: 'false',
    explanation: 'משרד הפנים חייב להכיר בגיורים שנעשו בקהילות מוכרות בחו"ל, ללא תלות בזרם הדתי (אורתודוקסי, רפורמי, קונסרבטיבי).',
    legalSource: 'פסיקת בג"ץ בנושא הכרה בגיורים'
  },
  {
    id: 8,
    type: 'multiple-choice',
    category: 'הפרדה בין הלכה לחוק',
    difficulty: 'קשה',
    question: 'מה ההבדל בין הכרה בגיור לצורך חוק השבות לבין הכרה לצורך נישואין?',
    options: [
      { id: 'a', text: 'אין הבדל' },
      { id: 'b', text: 'לחוק השבות מכירים בכל גיור, לנישואין רק באורתודוקסי' },
      { id: 'c', text: 'לנישואין מכירים בכל גיור, לחוק השבות רק באורתודוקסי' },
      { id: 'd', text: 'שניהם דורשים אישור רבני' }
    ],
    correctAnswer: 'b',
    explanation: 'הכרה בגיור לצורך חוק השבות אינה זהה להכרה בגיור לצורך נישואין או גירושין ברבנות, שם נדרש גיור אורתודוקסי.',
    legalSource: 'הפרדה בין הלכה לחוק אזרחי'
  },
  {
    id: 9,
    type: 'case-study',
    category: 'אלמנות',
    difficulty: 'בינוני',
    question: 'פרשת מרינצ\'בה - אלמנה של זכאי שבות ביקשה לעלות. מה קבע בית המשפט?',
    options: [
      { id: 'a', text: 'לא זכאית כי בעלה נפטר' },
      { id: 'b', text: 'זכאית לעלות כל עוד הקשר עם העם היהודי לא נותק' },
      { id: 'c', text: 'זכאית רק אם תתגייר' },
      { id: 'd', text: 'זכאית רק עם ילדיה' }
    ],
    correctAnswer: 'b',
    explanation: 'בג"ץ קבע שהאלמנה זכאית לעלות, כל עוד הקשר שלה עם העם היהודי לא נותק.',
    precedent: 'בג"ץ מרינצ\'בה נ\' שר הפנים'
  },
  {
    id: 10,
    type: 'multiple-choice',
    category: 'עקרונות כלליים',
    difficulty: 'בינוני',
    question: 'מה המשמעות של פרשנות חוק השבות כ"חוק חילוני"?',
    options: [
      { id: 'a', text: 'לא ניתן להחיל הלכה יהודית' },
      { id: 'b', text: 'יש לפרש "יהודי" לפי משמעות לאומית-תרבותית, לא הלכתית' },
      { id: 'c', text: 'רק הממשלה יכולה להחליט' },
      { id: 'd', text: 'אין צורך בהוכחת יהדות' }
    ],
    correctAnswer: 'b',
    explanation: 'פרשנות החוק כ"חילוני" משמעה שיש לפרש את המונח "יהודי" לפי משמעות לאומית-תרבותית ולא לפי הלכה יהודית בלבד.',
    legalSource: 'עקרון הפרשנות החילונית של חוק השבות'
  }
];

const LawOfReturnExam: React.FC = () => {
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
            <Home className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">המבחן הושלם!</h1>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
          
          <div className={`inline-block px-8 py-4 rounded-lg mb-6 ${percentage >= 70 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            <h2 className="text-2xl font-bold mb-2">הציון שלך: {score}/{questions.length}</h2>
            <p className="text-xl">{percentage}%</p>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-bold text-blue-800 mb-4">🏠 עיקרי חוק השבות</h3>
            <div className="text-blue-700 space-y-2 text-right">
              <p>• מטרה: לאפשר ליהודים מהגולה לעלות לישראל</p>
              <p>• הגדרת יהודי (1970): נולד לאם יהודייה או התגייר, ואינו בן דת אחרת</p>
              <p>• זכויות בני משפחה: גם לילד, נכד, בן/בת זוג (סעיף 4א)</p>
              <p>• פרשנות חילונית: לאומית-תרבותית, לא הלכתית בלבד</p>
              <p>• הפרדה: גיור לחוק השבות ≠ גיור לנישואין</p>
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
          <Home className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">חוק השבות</h1>
          <Users className="w-8 h-8 text-green-600" />
        </div>
        <p className="text-lg text-gray-600">מבחן על חוק השבות התש"י-1950 ופסיקה מכוננת</p>
        
        {/* Progress */}
        <div className="w-full bg-gray-200 rounded-full h-3 mt-6">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
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
             currentQuestion.type === 'true-false' ? 'נכון/לא נכון' : 'מקרה'}
          </span>
        </div>
        <p className="text-blue-700 text-lg leading-relaxed">{currentQuestion.question}</p>
      </div>

      {/* Answer Options */}
      <div className="space-y-4 mb-6">
        {currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'case-study' ? (
          currentQuestion.options?.map((option) => (
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
          ))
        ) : (
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
            
            {currentQuestion.legalSource && (
              <div className="bg-white p-4 rounded-lg border-r-4 border-green-500">
                <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                  📜 מקור משפטי:
                </h4>
                <p className="text-gray-700">{currentQuestion.legalSource}</p>
              </div>
            )}
            
            {currentQuestion.precedent && (
              <div className="bg-white p-4 rounded-lg border-r-4 border-purple-500">
                <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                  ⚖️ פסיקה:
                </h4>
                <p className="text-gray-700">{currentQuestion.precedent}</p>
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

export default LawOfReturnExam;
