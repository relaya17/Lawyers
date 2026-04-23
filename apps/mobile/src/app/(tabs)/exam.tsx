import { useState, useRef } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Question {
  id: number;
  category: string;
  difficulty: 'קל' | 'בינוני' | 'קשה';
  question: string;
  options: { id: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  lawReference?: string;
}

const ALL_QUESTIONS: Question[] = [
  // ── משפט פלילי ──
  {
    id: 1, category: 'משפט פלילי', difficulty: 'קל',
    question: 'מהו נטל ההוכחה הנדרש בהליך פלילי בישראל?',
    options: [
      { id: 'a', text: 'מאזן ההסתברויות' },
      { id: 'b', text: 'מעבר לספק סביר' },
      { id: 'c', text: 'ראיות מינימליות' },
      { id: 'd', text: 'ספק של מה בכך' },
    ],
    correctAnswer: 'b',
    explanation: 'בהליך פלילי התביעה חייבת להוכיח אשמתו של הנאשם "מעבר לספק סביר". זהו הנטל הגבוה ביותר במשפט.',
    lawReference: 'סעיף 34כב חוק העונשין',
  },
  {
    id: 2, category: 'משפט פלילי', difficulty: 'בינוני',
    question: 'אדם ירה בגנב שפרץ לביתו בלילה. באיזה סעיף יתגונן?',
    options: [
      { id: 'a', text: 'אי-שפיות דעת' },
      { id: 'b', text: 'הגנה עצמית (סעיף 34ח)' },
      { id: 'c', text: 'צורך (סעיף 34יא)' },
      { id: 'd', text: 'טעות במצב דברים' },
    ],
    correctAnswer: 'b',
    explanation: 'הגנה עצמית (סעיף 34ח) חלה כאשר אדם משתמש בכוח סביר כדי להדוף תקיפה בלתי-חוקית על גופו, ביתו או רכושו.',
    lawReference: 'סעיף 34ח חוק העונשין',
  },
  {
    id: 3, category: 'משפט פלילי', difficulty: 'קשה',
    question: 'מהו ההבדל בין "כוונה" ל"פזיזות" כיסוד נפשי?',
    options: [
      { id: 'a', text: 'כוונה = מודע ורוצה בתוצאה; פזיזות = מודע לסיכון ומקל ראש' },
      { id: 'b', text: 'כוונה = שוגג; פזיזות = מכוון' },
      { id: 'c', text: 'שניהם זהים — רק בשם שונים' },
      { id: 'd', text: 'כוונה = ידיעה; פזיזות = אי-ידיעה' },
    ],
    correctAnswer: 'a',
    explanation: 'כוונה (סעיף 20(א)) — המבצע חפץ בתוצאה. פזיזות (סעיף 20(ב)) — המבצע מודע לסיכון הממשי ומקל ראש בו. ההבדל הוא ברצייה בתוצאה.',
    lawReference: 'סעיף 20 חוק העונשין',
  },
  // ── דיני חוזים ──
  {
    id: 4, category: 'דיני חוזים', difficulty: 'קל',
    question: 'מה הם שני התנאים הנדרשים לכריתת חוזה?',
    options: [
      { id: 'a', text: 'כתב ועד' },
      { id: 'b', text: 'גמירת דעת ומסוימות' },
      { id: 'c', text: 'ייפוי כוח ואישור נוטריון' },
      { id: 'd', text: 'תמורה ורישום' },
    ],
    correctAnswer: 'b',
    explanation: 'לפי סעיף 1 לחוק החוזים — חוזה נכרת בדרך של הצעה וקיבול, ומצריך גמירת דעת (רצינות) ומסוימות (תנאים מוגדרים).',
    lawReference: 'סעיף 1 חוק החוזים (חלק כללי)',
  },
  {
    id: 5, category: 'דיני חוזים', difficulty: 'בינוני',
    question: 'מה ניתן לדרוש כסעד עיקרי כאשר הצד השני מפר חוזה?',
    options: [
      { id: 'a', text: 'רק פיצויים כספיים' },
      { id: 'b', text: 'אכיפה או ביטול ופיצויים' },
      { id: 'c', text: 'מאסר הצד המפר' },
      { id: 'd', text: 'החזרת כל הנכסים' },
    ],
    correctAnswer: 'b',
    explanation: 'חוק החוזים מאפשר לנפגע מהפרה לבחור בין אכיפה (סעיף 3), ביטול החוזה (סעיף 7) ופיצויים (סעיפים 10–13). לרוב ניתן לצרף פיצויים לאחת מהאפשרויות.',
    lawReference: 'סעיפים 3, 7, 10 חוק החוזים',
  },
  {
    id: 6, category: 'דיני חוזים', difficulty: 'קשה',
    question: 'מהו "פיצוי מוסכם" ומתי בית המשפט יפחיתו?',
    options: [
      { id: 'a', text: 'פיצוי שנקבע מראש — בית המשפט יפחיתו אם עולה פי שניים על הנזק הצפוי' },
      { id: 'b', text: 'פיצוי שנפסק בהסכמה — לעולם לא מופחת' },
      { id: 'c', text: 'פיצוי ממשלתי — כאשר עולה על מיליון ש"ח' },
      { id: 'd', text: 'פיצוי עונשי — רק בפשעים' },
    ],
    correctAnswer: 'a',
    explanation: 'סעיף 15(א) לחוק החוזים: פיצוי מוסכם הוא סכום שנקבע מראש כפיצוי על הפרה. בית המשפט רשאי להפחיתו אם "ניכר שהוא לא ייצג אומדן סביר" וגבוה פי שניים מהנזק הצפוי.',
    lawReference: 'סעיף 15 חוק החוזים',
  },
  // ── נזיקין ──
  {
    id: 7, category: 'דיני נזיקין', difficulty: 'קל',
    question: 'מהו מבחן האדם הסביר בעוולת הרשלנות?',
    options: [
      { id: 'a', text: 'מבחן אובייקטיבי — כיצד היה נוהג אדם סביר בנסיבות דומות' },
      { id: 'b', text: 'מבחן סובייקטיבי — כוונת הנתבע בלבד' },
      { id: 'c', text: 'מבחן מומחים — רק מה שמומחה יאמר' },
      { id: 'd', text: 'מבחן תוצאתי — אם נגרם נזק, יש רשלנות' },
    ],
    correctAnswer: 'a',
    explanation: 'מבחן "האדם הסביר" הוא אמת מידה אובייקטיבית — השאלה אינה מה חשב הנתבע, אלא כיצד היה אדם בר-דעת רגיל נוהג בנסיבות דומות.',
  },
  {
    id: 8, category: 'דיני נזיקין', difficulty: 'בינוני',
    question: 'מה ההבדל בין נזק ממוני לנזק לא-ממוני?',
    options: [
      { id: 'a', text: 'ממוני = ניתן לאמוד כספית; לא-ממוני = כאב, סבל ועגמת נפש' },
      { id: 'b', text: 'ממוני = ניזוק עשיר; לא-ממוני = ניזוק עני' },
      { id: 'c', text: 'ממוני = רכוש בלבד; לא-ממוני = גוף בלבד' },
      { id: 'd', text: 'שני המונחים זהים' },
    ],
    correctAnswer: 'a',
    explanation: 'נזק ממוני כולל הוצאות רפואיות, אובדן השתכרות, עלויות שיקום. נזק לא-ממוני = כאב וסבל, עגמת נפש, אובדן אורח חיים.',
  },
  // ── משפט מינהלי ──
  {
    id: 9, category: 'משפט מינהלי', difficulty: 'קל',
    question: 'מה מייחד את בית המשפט הגבוה לצדק (בג"ץ)?',
    options: [
      { id: 'a', text: 'דן ערעורים בפלילים בלבד' },
      { id: 'b', text: 'מפקח על פעולות הרשות המינהלית ומגן על זכויות' },
      { id: 'c', text: 'דן בתביעות כספיות נגד המדינה' },
      { id: 'd', text: 'בית משפט מחוזי גבוה' },
    ],
    correctAnswer: 'b',
    explanation: 'בג"ץ (כשבית המשפט העליון יושב כבית משפט גבוה לצדק) מפקח על כל הרשויות המדינה ומגן על זכויות הפרט מפני פגיעה שלטונית.',
  },
  {
    id: 10, category: 'משפט מינהלי', difficulty: 'בינוני',
    question: 'מהו "מבחן הסבירות" בביקורת שיפוטית?',
    options: [
      { id: 'a', text: 'האם ההחלטה נפלה בתחום שיקול הדעת הסביר של הרשות' },
      { id: 'b', text: 'האם ההחלטה הגיונית מבחינת הציבור הרחב' },
      { id: 'c', text: 'האם השופט מסכים עם ההחלטה' },
      { id: 'd', text: 'האם ההחלטה פורסמה ברשומות' },
    ],
    correctAnswer: 'a',
    explanation: 'מבחן הסבירות בוחן האם ההחלטה המינהלית חרגה ממתחם שיקול הדעת הסביר, לא רק אם השופט היה נוהג אחרת. חריגה קיצונית בלבד מצדיקה ביטול.',
  },
  // ── דיני עבודה ──
  {
    id: 11, category: 'דיני עבודה', difficulty: 'קל',
    question: 'כמה פיצויי פיטורין מגיע לעובד שעבד שנה אחת לפי החוק?',
    options: [
      { id: 'a', text: 'שבועיים שכר' },
      { id: 'b', text: 'חודש שכר אחד' },
      { id: 'c', text: 'שלושה חודשי שכר' },
      { id: 'd', text: 'ללא פיצויים' },
    ],
    correctAnswer: 'b',
    explanation: 'חוק פיצויי פיטורים תשכ"ג-1963 קובע: לכל שנת עבודה — חודש שכר אחד. בחישוב לפי שכרו האחרון (הגבוה מבין 3 חודשים אחרונים).',
    lawReference: 'חוק פיצויי פיטורים תשכ"ג',
  },
  {
    id: 12, category: 'דיני עבודה', difficulty: 'בינוני',
    question: 'מה הוא "מבחן ההשתלבות" ומתי הוא חל?',
    options: [
      { id: 'a', text: 'קובע מתי חוזה עבודה תקף — נדרש עד' },
      { id: 'b', text: 'בוחן האם אדם הוא עובד שכיר או עצמאי' },
      { id: 'c', text: 'קובע כמה שעות ניתן לעבוד' },
      { id: 'd', text: 'חל רק בחוזי קבלנות' },
    ],
    correctAnswer: 'b',
    explanation: 'מבחן ההשתלבות (כולל: עבודה אישית, שכר, תלות, שילוב במפעל) קובע מיהו "עובד" לצרכי דיני העבודה. רלוונטי לסיווג גיג-וורקרים ועצמאיים.',
  },
  // ── דיני קניין ──
  {
    id: 13, category: 'דיני קניין', difficulty: 'בינוני',
    question: 'מתי עסקה במקרקעין "גומרת" לפי חוק המקרקעין?',
    options: [
      { id: 'a', text: 'עם חתימת החוזה' },
      { id: 'b', text: 'עם תשלום מלוא התמורה' },
      { id: 'c', text: 'עם הרישום בלשכת רישום המקרקעין (טאבו)' },
      { id: 'd', text: 'עם מסירת המפתח' },
    ],
    correctAnswer: 'c',
    explanation: 'לפי סעיף 7 לחוק המקרקעין תשכ"ט — עסקה במקרקעין טעונה רישום, ואינה גומרת אלא ברישום. לפני הרישום קיימת רק זכות אובליגטורית.',
    lawReference: 'סעיף 7 חוק המקרקעין',
  },
  // ── משפחה ──
  {
    id: 14, category: 'דיני משפחה', difficulty: 'קל',
    question: 'מהו הקריטריון המרכזי בהחלטות משמורת ילדים בישראל?',
    options: [
      { id: 'a', text: 'העדפת האם תמיד' },
      { id: 'b', text: 'העדפת האב תמיד' },
      { id: 'c', text: 'טובת הילד' },
      { id: 'd', text: 'רצון הילד בלבד' },
    ],
    correctAnswer: 'c',
    explanation: '"טובת הילד" היא הקריטריון העליון בכל החלטה הנוגעת לילדים. הוא כולל יציבות, קשר עם שני ההורים, ורווחה רגשית ופיזית.',
    lawReference: 'חוק הכשרות המשפטית והאפוטרופסות',
  },
  {
    id: 15, category: 'דיני משפחה', difficulty: 'בינוני',
    question: 'מי מוסמך לדון בגירושין בין בני זוג יהודים בישראל?',
    options: [
      { id: 'a', text: 'בית משפט לענייני משפחה בלבד' },
      { id: 'b', text: 'בית הדין הרבני' },
      { id: 'c', text: 'בית משפט שלום' },
      { id: 'd', text: 'בית המשפט המחוזי' },
    ],
    correctAnswer: 'b',
    explanation: 'בית הדין הרבני הוא הפורום הבלעדי לגירושין בין יהודים בישראל. גירושין מחייבים מתן גט. בית המשפט לענייני משפחה מוסמך לנכסים ומזונות, לא לגירושין עצמם.',
  },
];

const CATEGORIES = ['הכל', ...Array.from(new Set(ALL_QUESTIONS.map((q) => q.category)))];
const DIFF_COLORS = { קל: '#2e7d32', בינוני: '#e65100', קשה: '#b71c1c' };

export default function ExamScreen() {
  const [catFilter, setCatFilter] = useState('הכל');
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<{ q: Question; chosen: string }[]>([]);
  const shake = useRef(new Animated.Value(0)).current;

  const questions =
    catFilter === 'הכל' ? ALL_QUESTIONS : ALL_QUESTIONS.filter((q) => q.category === catFilter);

  const q = questions[current];

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 4, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleCheck = () => {
    if (!selected) return;
    if (selected === q.correctAnswer) {
      setScore((s) => s + 1);
    } else {
      triggerShake();
    }
    setRevealed(true);
    setAnswers((a) => [...a, { q, chosen: selected }]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
    setStarted(false);
  };

  if (!started) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.lobbyContent}>
          <Text style={styles.pageTitle}>מבחן תרגול</Text>

          <Text style={styles.filterLabel}>בחר נושא:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.filterChip, catFilter === cat && styles.filterChipActive]}
                onPress={() => setCatFilter(cat)}
              >
                <Text style={[styles.filterChipText, catFilter === cat && styles.filterChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              {questions.length} שאלות | {catFilter}
            </Text>
            <Text style={styles.infoText}>
              בחר תשובה, לחץ "בדיקה" לראות הסבר, ועבור לשאלה הבאה.
            </Text>
          </View>

          <TouchableOpacity style={styles.startBtn} onPress={() => setStarted(true)}>
            <Text style={styles.startBtnText}>▶ התחל מבחן</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 60;
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.lobbyContent}>
          <Text style={styles.pageTitle}>תוצאות</Text>
          <View style={[styles.resultCard, { borderColor: passed ? '#2e7d32' : '#b71c1c' }]}>
            <Text style={styles.resultEmoji}>{passed ? '🎉' : '📚'}</Text>
            <Text style={styles.resultScore}>{score}/{questions.length}</Text>
            <Text style={[styles.resultPct, { color: passed ? '#2e7d32' : '#b71c1c' }]}>
              {pct}% {passed ? '— עברת!' : '— נסה שוב'}
            </Text>
          </View>

          {answers.map(({ q: aq, chosen }, i) => {
            const correct = chosen === aq.correctAnswer;
            return (
              <View key={i} style={[styles.reviewCard, { borderRightColor: correct ? '#2e7d32' : '#b71c1c' }]}>
                <Text style={styles.reviewQ}>{aq.question}</Text>
                <Text style={[styles.reviewA, { color: correct ? '#2e7d32' : '#b71c1c' }]}>
                  {correct ? '✓' : '✗'} בחרת: {aq.options.find((o) => o.id === chosen)?.text}
                </Text>
                {!correct && (
                  <Text style={styles.reviewCorrect}>
                    ✓ נכון: {aq.options.find((o) => o.id === aq.correctAnswer)?.text}
                  </Text>
                )}
                <Text style={styles.reviewExp}>{aq.explanation}</Text>
              </View>
            );
          })}

          <TouchableOpacity style={styles.startBtn} onPress={handleRestart}>
            <Text style={styles.startBtnText}>↺ נסה שוב</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((current) / questions.length) * 100}%` as `${number}%` }]} />
      </View>

      <ScrollView contentContainerStyle={styles.examContent}>
        <View style={styles.metaRow}>
          <Text style={styles.metaQ}>{current + 1} / {questions.length}</Text>
          <Text style={[styles.metaDiff, { color: DIFF_COLORS[q.difficulty] }]}>{q.difficulty}</Text>
          <Text style={styles.metaCat}>{q.category}</Text>
        </View>

        <Animated.View style={[styles.questionCard, { transform: [{ translateX: shake }] }]}>
          <Text style={styles.questionText}>{q.question}</Text>
        </Animated.View>

        {q.options.map((opt) => {
          let bg = '#fff';
          if (revealed) {
            if (opt.id === q.correctAnswer) bg = '#e8f5e9';
            else if (opt.id === selected) bg = '#ffebee';
          } else if (opt.id === selected) {
            bg = '#e3f2fd';
          }
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.option, { backgroundColor: bg }]}
              onPress={() => !revealed && setSelected(opt.id)}
              disabled={revealed}
            >
              <Text style={styles.optionId}>{opt.id.toUpperCase()}.</Text>
              <Text style={styles.optionText}>{opt.text}</Text>
              {revealed && opt.id === q.correctAnswer && (
                <Text style={styles.optionIcon}>✓</Text>
              )}
              {revealed && opt.id === selected && opt.id !== q.correctAnswer && (
                <Text style={styles.optionIconWrong}>✗</Text>
              )}
            </TouchableOpacity>
          );
        })}

        {revealed && (
          <View style={styles.explanationCard}>
            <Text style={styles.explanationTitle}>הסבר</Text>
            <Text style={styles.explanationBody}>{q.explanation}</Text>
            {q.lawReference && (
              <Text style={styles.lawRef}>📖 {q.lawReference}</Text>
            )}
          </View>
        )}

        {!revealed ? (
          <TouchableOpacity
            style={[styles.actionBtn, !selected && styles.actionBtnDisabled]}
            onPress={handleCheck}
            disabled={!selected}
          >
            <Text style={styles.actionBtnText}>בדיקה</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionBtn} onPress={handleNext}>
            <Text style={styles.actionBtnText}>
              {current + 1 < questions.length ? 'שאלה הבאה ›' : 'ראה תוצאות ›'}
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  progressBar: { height: 4, backgroundColor: '#e0e0e0' },
  progressFill: { height: 4, backgroundColor: '#1e3a5f' },

  lobbyContent: { padding: 20 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#1e3a5f', textAlign: 'right', marginBottom: 20 },
  filterLabel: { fontSize: 15, fontWeight: '600', color: '#333', textAlign: 'right', marginBottom: 10 },
  filterRow: { marginBottom: 20 },
  filterChip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#e8ecf0', marginRight: 8,
  },
  filterChipActive: { backgroundColor: '#1e3a5f' },
  filterChipText: { color: '#555', fontSize: 14 },
  filterChipTextActive: { color: '#fff', fontWeight: '700' },
  infoCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 18,
    borderWidth: 1, borderColor: '#dde3ed', marginBottom: 20,
  },
  infoTitle: { fontSize: 18, fontWeight: '700', color: '#1e3a5f', textAlign: 'right', marginBottom: 6 },
  infoText: { fontSize: 13, color: '#666', textAlign: 'right', lineHeight: 20 },
  startBtn: {
    backgroundColor: '#1e3a5f', paddingVertical: 16, borderRadius: 14,
    alignItems: 'center', marginTop: 4,
  },
  startBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },

  examContent: { padding: 16, paddingBottom: 40 },
  metaRow: { flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 14, alignItems: 'center' },
  metaQ: { fontSize: 14, color: '#888', fontWeight: '600' },
  metaDiff: { fontSize: 13, fontWeight: '700' },
  metaCat: { fontSize: 13, color: '#1e3a5f', fontWeight: '600' },
  questionCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 18,
    marginBottom: 14, borderWidth: 1, borderColor: '#dde3ed',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 5, elevation: 2,
  },
  questionText: { fontSize: 16, fontWeight: '600', color: '#1e3a5f', textAlign: 'right', lineHeight: 26 },
  option: {
    flexDirection: 'row-reverse', alignItems: 'center',
    borderRadius: 12, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#e0e0e0',
  },
  optionId: { fontSize: 16, fontWeight: '700', color: '#1e3a5f', marginLeft: 10, width: 28, textAlign: 'center' },
  optionText: { flex: 1, fontSize: 15, color: '#333', textAlign: 'right', lineHeight: 22 },
  optionIcon: { fontSize: 18, color: '#2e7d32', marginRight: 4 },
  optionIconWrong: { fontSize: 18, color: '#b71c1c', marginRight: 4 },
  explanationCard: {
    backgroundColor: '#e8f4fd', borderRadius: 12, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: '#90caf9',
  },
  explanationTitle: { fontSize: 15, fontWeight: '700', color: '#0d47a1', textAlign: 'right', marginBottom: 8 },
  explanationBody: { fontSize: 14, color: '#333', textAlign: 'right', lineHeight: 23 },
  lawRef: { fontSize: 12, color: '#1565c0', textAlign: 'right', marginTop: 10, fontWeight: '600' },
  actionBtn: {
    backgroundColor: '#1e3a5f', paddingVertical: 15, borderRadius: 12,
    alignItems: 'center', marginTop: 4,
  },
  actionBtnDisabled: { opacity: 0.4 },
  actionBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  resultCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 28, alignItems: 'center',
    marginBottom: 20, borderWidth: 2,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  resultEmoji: { fontSize: 52, marginBottom: 12 },
  resultScore: { fontSize: 42, fontWeight: '800', color: '#1e3a5f', marginBottom: 4 },
  resultPct: { fontSize: 20, fontWeight: '600' },
  reviewCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 10, borderRightWidth: 4,
    borderWidth: 1, borderColor: '#e8ecf0',
  },
  reviewQ: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'right', marginBottom: 6 },
  reviewA: { fontSize: 13, textAlign: 'right', fontWeight: '600' },
  reviewCorrect: { fontSize: 13, color: '#2e7d32', textAlign: 'right', fontWeight: '600', marginTop: 2 },
  reviewExp: { fontSize: 12, color: '#666', textAlign: 'right', marginTop: 6, lineHeight: 18 },
});
