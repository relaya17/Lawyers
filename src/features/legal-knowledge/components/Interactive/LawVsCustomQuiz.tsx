import React, { useState } from 'react';
import { CheckCircle, Cancel as XCircle, Balance as Scale, Book, Star, Business as Building } from '@mui/icons-material';

interface QuizScenario {
  id: number;
  title: string;
  description: string;
  situation: string;
  options: {
    id: string;
    text: string;
    reasoning: string;
    isCorrect: boolean;
  }[];
  correctAnswer: string;
  explanation: string;
  precedent: string;
  difficulty: 'קל' | 'בינוני' | 'קשה' | 'קשה מאוד';
}

const scenarios: QuizScenario[] = [
  {
    id: 1,
    title: "חוק החוזים מול מנהג מסחרי",
    description: "סכסוך בין ספק ללקוח על מועד תשלום",
    situation: "חברה רכשה סחורה מספק. בחוזה לא נקבע מועד תשלום מפורש. הספק טוען שהמנהג המסחרי בענף הוא תשלום תוך 30 יום. החברה טוענת שלפי חוק החוזים התשלום תוך זמן סביר (90 יום).",
    options: [
      {
        id: "a",
        text: "חוק החוזים גובר - תשלום תוך 90 יום",
        reasoning: "החוק הכתוב מגדיר זמן סביר ואין הסכמה מפורשת על מנהג",
        isCorrect: false
      },
      {
        id: "b", 
        text: "המנהג המסחרי גובר - תשלום תוך 30 יום",
        reasoning: "מנהג מסחרי מוכח ומקובל מחייב בהיעדר הסכמה מפורשת אחרת",
        isCorrect: true
      },
      {
        id: "c",
        text: "צריך להגיע להסכמה חדשה",
        reasoning: "כאשר יש סתירה, יש לחזור למשא ומתן",
        isCorrect: false
      }
    ],
    correctAnswer: "b",
    explanation: "מנהג מסחרי מוכח ומקובל בענף מחייב את הצדדים בהיעדר הסכמה מפורשת אחרת. זאת בתנאי שהמנהג אינו סותר חוק מפורש.",
    precedent: "ע\"א 234/85 - בית המשפט קבע שמנהג מסחרי מוכח מחייב בחוזים מסחריים",
    difficulty: "בינוני"
  },
  {
    id: 2,
    title: "חוק העבודה מול מנהג ארגוני",
    description: "סכסוך על שעות נוספות בחברה",
    situation: "עובד טוען לתשלום שעות נוספות. בחברה נהוג שעובדים בכירים לא מקבלים תשלום על שעות נוספות, אך חוק שעות עבודה ומנוחה קובע זכות לתשלום לכל עובד.",
    options: [
      {
        id: "a",
        text: "חוק העבודה גובר - זכות לתשלום שעות נוספות",
        reasoning: "חוק מפורש קובע זכויות עבודה ואין אפשרות לוותר עליהן במנהג",
        isCorrect: true
      },
      {
        id: "b",
        text: "המנהג הארגוני גובר - אין תשלום לבכירים",
        reasoning: "מנהג מקובל בחברה מחייב את העובדים",
        isCorrect: false
      },
      {
        id: "c",
        text: "תלוי בחוזה העבודה האישי",
        reasoning: "החוזה קובע את התנאים הספציפיים",
        isCorrect: false
      }
    ],
    correctAnswer: "a",
    explanation: "חוקי עבודה הם חוקי הגנה שאינם ניתנים לוויתור. מנהג שסותר זכויות עובד חוקיות אינו תקף.",
    precedent: "דנ\"ע 123/89 - בית הדין לעבודה קבע שאין וויתור על זכויות חוקיות בדיני עבודה",
    difficulty: "קל"
  },
  {
    id: 3,
    title: "חוק יסוד מול מנהג חוקתי",
    description: "סמכויות נשיא המדינה בפרקטיקה",
    situation: "נשיא המדינה רוצה להשתתף באופן פעיל בדיונים פוליטיים. חוק יסוד: נשיא המדינה קובע שהנשיא עומד מעל למפלגות, אך מנהג חוקתי מאפשר לנשיא להביע עמדות בנושאים ציבוריים.",
    options: [
      {
        id: "a",
        text: "חוק היסוד גובר - הנשיא לא יכול להיות פוליטי",
        reasoning: "חוק יסוד הוא נורמה עליונה שמגדירה את תפקיד הנשיא",
        isCorrect: true
      },
      {
        id: "b",
        text: "המנהג החוקתי גובר - הנשיא יכול להביע עמדות",
        reasoning: "פרקטיקה ארוכת שנים יוצרת מנהג חוקתי מחייב",
        isCorrect: false
      },
      {
        id: "c",
        text: "תלוי בחומרת הנושא הפוליטי",
        reasoning: "ניתן לאזן בין המנהג לחוק לפי הנסיבות",
        isCorrect: false
      }
    ],
    correctAnswer: "a",
    explanation: "חוקי יסוד הם נורמה עליונה במערכת המשפט הישראלית. מנהג, גם חוקתי, לא יכול לסתור הוראה מפורשת בחוק יסוד.",
    precedent: "בג\"ץ 456/92 - עליונות חוקי היסוד על פני מנהגים חוקתיים",
    difficulty: "קשה"
  }
];

const LawVsCustomQuiz: React.FC = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);

  const handleAnswerSelect = (answerId: string) => {
    setSelectedAnswer(answerId);
    setShowFeedback(true);
    
    if (answerId === scenarios[currentScenario].correctAnswer) {
      setScore(score + 1);
    }
    
    setCompletedScenarios([...completedScenarios, currentScenario]);
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const resetQuiz = () => {
    setCurrentScenario(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setCompletedScenarios([]);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'קל': return 'text-green-600 bg-green-100';
      case 'בינוני': return 'text-yellow-600 bg-yellow-100';
      case 'קשה': return 'text-orange-600 bg-orange-100';
      case 'קשה מאוד': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const scenario = scenarios[currentScenario];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg" dir="rtl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Scale className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">חוק נגד מנהג</h1>
          <Star className="w-8 h-8 text-yellow-500" />
        </div>
        <p className="text-lg text-gray-600">חידון אינטראקטיבי לבחינת סתירות בין חקיקה כתובה למנהגים</p>
        
        {/* Progress & Score */}
        <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">תרחיש {currentScenario + 1} מתוך {scenarios.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold">ציון: {score}/{completedScenarios.length}</span>
          </div>
        </div>
      </div>

      {/* Current Scenario */}
      <div className="bg-blue-50 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-blue-800">{scenario.title}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(scenario.difficulty)}`}>
            {scenario.difficulty}
          </span>
        </div>
        
        <p className="text-blue-700 mb-4 font-medium">{scenario.description}</p>
        
        <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
            <Building className="w-5 h-5" />
            המצב:
          </h3>
          <p className="text-gray-700 leading-relaxed">{scenario.situation}</p>
        </div>
      </div>

      {/* Answer Options */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">מה דעתך - מי גובר?</h3>
        
        {scenario.options.map((option) => (
          <button
            key={option.id}
            onClick={() => !showFeedback && handleAnswerSelect(option.id)}
            disabled={showFeedback}
            className={`w-full p-4 text-right rounded-lg border-2 transition-all duration-200 ${
              showFeedback
                ? option.id === scenario.correctAnswer
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : option.id === selectedAnswer
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : 'border-gray-200 bg-gray-50 text-gray-600'
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium mb-1">{option.text}</p>
                {showFeedback && (
                  <p className="text-sm opacity-80">{option.reasoning}</p>
                )}
              </div>
              <div className="mr-4">
                {showFeedback && option.id === scenario.correctAnswer && (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                )}
                {showFeedback && option.id === selectedAnswer && option.id !== scenario.correctAnswer && (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Scale className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">הסבר מפורט</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border-r-4 border-blue-500">
              <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                ⚖️ נימוק משפטי:
              </h4>
              <p className="text-gray-700">{scenario.explanation}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg border-r-4 border-green-500">
              <h4 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                📜 פסיקה רלוונטית:
              </h4>
              <p className="text-gray-700">{scenario.precedent}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        {currentScenario < scenarios.length - 1 ? (
          <button
            onClick={nextScenario}
            disabled={!showFeedback}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            תרחיש הבא ←
          </button>
        ) : showFeedback ? (
          <div className="text-center w-full">
            <div className="bg-green-50 p-6 rounded-lg mb-4">
              <h3 className="text-xl font-bold text-green-800 mb-2">🎉 כל הכבוד!</h3>
              <p className="text-green-700">
                סיימת את החידון בציון: {score}/{scenarios.length} 
                ({Math.round((score / scenarios.length) * 100)}%)
              </p>
            </div>
            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 התחל מחדש
            </button>
          </div>
        ) : null}
        
        {currentScenario > 0 && (
          <button
            onClick={() => {
              setCurrentScenario(currentScenario - 1);
              setSelectedAnswer(null);
              setShowFeedback(false);
            }}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            → תרחיש קודם
          </button>
        )}
      </div>
    </div>
  );
};

export default LawVsCustomQuiz;
