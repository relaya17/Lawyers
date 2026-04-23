import React, { useCallback, useMemo, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Stack,
    Typography,
} from '@mui/material';
import { Flip as FlipIcon, NavigateBefore, NavigateNext } from '@mui/icons-material';
import type { Flashcard, LegalCategory } from '../../types';

const DECK: Omit<Flashcard, 'knownStatus'>[] = [
    { id: '1', term: 'חקיקה ראשית', definition: 'חוקים שמחוקקת הכנסת; עליונים על תקנות וצווים.', category: 'laws', examples: ['חוק העונשין'], relatedCases: [], difficulty: 'easy' },
    { id: '2', term: 'חקיקת משנה', definition: 'תקנות וצווים שמותקנים על סמך סמכות מחוק ראשי.', category: 'laws', examples: ['תקנות עבודה'], relatedCases: [], difficulty: 'easy' },
    { id: '3', term: 'חוקי יסוד', definition: 'מעין חוקה חלקית; עליונים על חוק רגיל; לעיתים עם פסקת הגבלה.', category: 'constitutional-law', examples: ['חוק יסוד: כבוד האדם'], relatedCases: ['בג"ץ מיכאלי'], difficulty: 'medium' },
    { id: '4', term: 'פסקת ההגבלה', definition: 'בחינת חוק רגיל מול זכות יסוד — לגיטימיות, תכלית, מידתיות.', category: 'constitutional-law', examples: [], relatedCases: ['בג"ץ בנק המזרחי'], difficulty: 'hard' },
    { id: '5', term: 'ביקורת שיפוטית', definition: 'סמכות בתי המשפט לבחון חוקיות של מעשי שלטון וחקיקה.', category: 'constitutional-law', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '6', term: 'תקדים', definition: 'החלטת בית משפט בעניין דומה; מקור משפטי משני בישראל.', category: 'precedents', examples: [], relatedCases: ['מרגלית'], difficulty: 'easy' },
    { id: '7', term: 'עקרון סטארה דסיס', definition: 'יציבות משפטית — בית משפט נוטה לעקוב אחרי פסיקה קודמת.', category: 'precedents', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '8', term: 'מנהג עסקי', definition: 'נורמה התנהגותית מקובלת בענף; עשוי למלא לכוונות הצדדים.', category: 'customs', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '9', term: 'כריתת חוזה', definition: 'הצעה וקבלה מחייבות; לעיתים גם תמורה וכשרות.', category: 'civil-law', examples: [], relatedCases: [], difficulty: 'easy' },
    { id: '10', term: 'תום לב', definition: 'חובת התנהגות נאמנה בהתקשרות ובביצוע חוזה.', category: 'civil-law', examples: [], relatedCases: ['איילת השחר'], difficulty: 'medium' },
    { id: '11', term: 'עושק', definition: 'ניצול מצוקה, חוסר ניסיון או תלות לקבלת תנאה בלתי סבירה.', category: 'civil-law', examples: ['חוק החוזים'], relatedCases: [], difficulty: 'medium' },
    { id: '12', term: 'הפרת חוזה', definition: 'אי־קיום התחייבות מהותית; מזכה בסעדים כמו נזקים או אכיפה.', category: 'civil-law', examples: [], relatedCases: [], difficulty: 'easy' },
    { id: '13', term: 'יסוד מעשה (פלילי)', definition: 'ההתנהגות החיצונית הנדרשת לעבירה.', category: 'criminal-law', examples: [], relatedCases: [], difficulty: 'easy' },
    { id: '14', term: 'יסוד נפשי', definition: 'כוונה, זדון, רשלנות או אחריות מוחלטת — לפי העבירה.', category: 'criminal-law', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '15', term: 'ניסיון', definition: 'ייחוס לביצוע עבירה שלא הושלמה בגלל נסיבות חיצוניות.', category: 'criminal-law', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '16', term: 'שיקול דעת מינהלי', definition: 'סמכות רשות לבחור בין אפשרויות חוקיות לפי שיקול ענייני.', category: 'administrative-law', examples: [], relatedCases: [], difficulty: 'easy' },
    { id: '17', term: 'שיקולים זרים', definition: 'החלטה שנשענה על שיקול שלא היה רלוונטי לסמכות.', category: 'administrative-law', examples: [], relatedCases: ['דור הנדל"ן'], difficulty: 'medium' },
    { id: '18', term: 'עקרון הסבירות', definition: 'בית המשפט בוחן אם החלטת הרשות סבירה בנסיבות העניין.', category: 'administrative-law', examples: [], relatedCases: ['יעקב נאמן'], difficulty: 'medium' },
    { id: '19', term: 'שימוע', definition: 'חובה לשמוע את הנפגע לפני החלטה הפוגעת בו.', category: 'administrative-law', examples: [], relatedCases: [], difficulty: 'easy' },
    { id: '20', term: 'רשלנות', definition: 'הפרת חובת זהירות סבירה שגרמה נזק למי שחייבים לו חובה.', category: 'civil-law', examples: [], relatedCases: [], difficulty: 'easy' },
    { id: '21', term: 'קשר סיבתי', definition: 'קישור בין המעשה לנזק — טבעי וקרוב מספיק.', category: 'civil-law', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '22', term: 'אשם תורם', definition: 'הפחתת פיצוי כשהניזוק תרם לנזק בהתנהגותו.', category: 'civil-law', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '23', term: 'בעלות', definition: 'זכות שליטה מוחלטת במשהו — מקרקעין או מיטלטלין.', category: 'civil-law', examples: [], relatedCases: [], difficulty: 'easy' },
    { id: '24', term: 'זיקת הנאה', definition: 'זכות שימוש במקרקעין של אחר ללא העברת בעלות.', category: 'civil-law', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '25', term: 'משכנתא', definition: 'שעבוד מקרקעין להבטחת חוב; רושמים בלשכת רישום.', category: 'civil-law', examples: [], relatedCases: [], difficulty: 'easy' },
    { id: '26', term: 'טובת הילד', definition: 'עקרון מנחה בהחלטות משפחה — משמורת, מזונות, מגורים.', category: 'civil-law', examples: [], relatedCases: [], difficulty: 'easy' },
    { id: '27', term: 'מזונות', definition: 'חובת פרנסה בין בני זוג או הורים לילדים לפי הדין.', category: 'civil-law', examples: [], relatedCases: [], difficulty: 'easy' },
    { id: '28', term: 'גירושין', definition: 'סיום תוקף הנישואין בהליך דתי או אזרחי לפי המקרה.', category: 'civil-law', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '29', term: 'צוואה', definition: 'הנחיה לחלוקת עיזבון; דרישות צורה לפי חוק הירושה.', category: 'laws', examples: ['חוק הירושה'], relatedCases: [], difficulty: 'medium' },
    { id: '30', term: 'יורשים סדריים', definition: 'קרובים שזכאים לפי חוק כשאין צוואה.', category: 'laws', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '31', term: 'פיטורי עובד', definition: 'הפסקת יחסי עבודה; לעיתים דורש שימוע ופיצוי.', category: 'laws', examples: ['חוק עבודה'], relatedCases: [], difficulty: 'easy' },
    { id: '32', term: 'שכר מינימום', definition: 'שכר תחתון חוקי; הפרה מהווה עבירה.', category: 'laws', examples: [], relatedCases: [], difficulty: 'easy' },
    { id: '33', term: 'שעות נוספות', definition: 'תשלום מוגבר לעבודה מעבר לשבוע התקני.', category: 'laws', examples: [], relatedCases: [], difficulty: 'easy' },
    { id: '34', term: 'הגנת הצרכן', definition: 'דינים נגד הטעיה, תנאים מקפחים וביטול עסקה.', category: 'laws', examples: ['חוק הגנת הצרכן'], relatedCases: [], difficulty: 'medium' },
    { id: '35', term: 'חוזה אחיד', definition: 'טופס מוכן מראש; מגבלות על תנאים מקפחים.', category: 'civil-law', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '36', term: 'מאגר מידע', definition: 'איסוף ועיבוד נתונים אישיים כפוף לחוק הגנת הפרטיות.', category: 'laws', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '37', term: 'חברה בע"מ', definition: 'ישות משפטית נפרדת; אחריות מוגבלת של בעלי מניות.', category: 'civil-law', examples: ['חוק החברות'], relatedCases: [], difficulty: 'easy' },
    { id: '38', term: 'דירקטור', definition: 'נושא משרה בחברה; חובות אמון וזהירות.', category: 'civil-law', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '39', term: 'חדלות פרעון', definition: 'הליכים לשיקום כלכלי או פירוק חובות של חייב.', category: 'laws', examples: [], relatedCases: [], difficulty: 'hard' },
    { id: '40', term: 'משפט השוואתי', definition: 'לימוד מערכות משפט אחרות להבהרת בחירות נורמטיביות.', category: 'comparative-law', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '41', term: 'פירוש חוק', definition: 'דקדוקי, מטרתי, תכליתי — לפי כללי פרשנות.', category: 'interpretations', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '42', term: 'עקרון החוקיות', definition: 'המנהל פועל רק על פי סמכות חוקית.', category: 'administrative-law', examples: [], relatedCases: [], difficulty: 'easy' },
    { id: '43', term: 'עתירה לבג"ץ', definition: 'הליך לבית המשפט העליון בשבתו כבג"ץ נגד שלטון.', category: 'constitutional-law', examples: [], relatedCases: [], difficulty: 'medium' },
    { id: '44', term: 'חופש המידע', definition: 'זכות לקבל מסמכים מרשות ציבורית כפי שחוק קובע.', category: 'administrative-law', examples: [], relatedCases: [], difficulty: 'easy' },
    { id: '45', term: 'מידתיות', definition: 'האמצעי הפוגעני הוא המידתי להשגת המטרה.', category: 'administrative-law', examples: [], relatedCases: ['בזק'], difficulty: 'medium' },
    { id: '46', term: 'Spaced repetition', definition: 'חזרה במרווחים גדלים לשיפור זיכרון לטווח ארוך.', category: 'interpretations', examples: ['כרטיסיות יומיות'], relatedCases: [], difficulty: 'easy' },
];

const categoryLabel: Record<LegalCategory, string> = {
    laws: 'חקיקה',
    precedents: 'תקדים',
    customs: 'מנהג',
    'comparative-law': 'השוואתי',
    interpretations: 'פרשנות',
    'constitutional-law': 'חוקתי',
    'civil-law': 'אזרחי',
    'criminal-law': 'פלילי',
    'administrative-law': 'מנהלי',
};

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export const LegalFlashcards: React.FC = () => {
    const [order, setOrder] = useState(() => shuffle(DECK.map((c) => c.id)));
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [known, setKnown] = useState<Record<string, 'known' | 'needs-practice'>>({});

    const currentId = order[index];
    const current = useMemo(() => DECK.find((c) => c.id === currentId), [currentId]);

    const advance = useCallback(
        (dir: 1 | -1) => {
            setFlipped(false);
            setIndex((i) => {
                const n = i + dir;
                if (n < 0) return order.length - 1;
                if (n >= order.length) return 0;
                return n;
            });
        },
        [order.length],
    );

    const mark = useCallback(
        (status: 'known' | 'needs-practice') => {
            if (currentId) setKnown((k) => ({ ...k, [currentId]: status }));
            advance(1);
        },
        [currentId, advance],
    );

    const reshuffle = useCallback(() => {
        setOrder(shuffle(DECK.map((c) => c.id)));
        setIndex(0);
        setFlipped(false);
    }, []);

    if (!current) return null;

    const progress = ((index + 1) / order.length) * 100;
    const markedKnown = Object.values(known).filter((s) => s === 'known').length;

    return (
        <Box sx={{ maxWidth: 720, mx: 'auto', py: 2 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">כרטיסיות חזרה</Typography>
                <Stack direction="row" spacing={1}>
                    <Chip size="small" label={`${index + 1} / ${order.length}`} />
                    <Chip size="small" color="success" variant="outlined" label={`ידעתי: ${markedKnown}`} />
                </Stack>
            </Stack>
            <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />

            <Card
                elevation={4}
                sx={{
                    cursor: 'pointer',
                    minHeight: 220,
                    bgcolor: flipped ? 'primary.dark' : 'background.paper',
                    color: flipped ? 'primary.contrastText' : 'text.primary',
                    transition: 'background-color 0.25s ease',
                }}
                onClick={() => setFlipped((f) => !f)}
            >
                <CardContent>
                    <Stack spacing={1}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Chip
                                size="small"
                                label={categoryLabel[current.category]}
                                sx={{ bgcolor: flipped ? 'rgba(255,255,255,0.2)' : undefined }}
                            />
                            <FlipIcon fontSize="small" />
                        </Stack>
                        <Typography variant="overline">לחצו להפיכה</Typography>
                        <Typography variant="h5" component="div">
                            {flipped ? current.definition : current.term}
                        </Typography>
                        {!flipped && current.examples.length > 0 && (
                            <Typography variant="body2" sx={{ opacity: 0.85 }}>
                                דוגמה: {current.examples.join(', ')}
                            </Typography>
                        )}
                    </Stack>
                </CardContent>
            </Card>

            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                <Button startIcon={<NavigateBefore />} onClick={() => advance(-1)} variant="outlined">
                    הקודם
                </Button>
                <Button endIcon={<NavigateNext />} onClick={() => advance(1)} variant="outlined">
                    הבא
                </Button>
            </Stack>

            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
                <Button color="warning" variant="contained" onClick={() => mark('needs-practice')}>
                    צריך חזרה
                </Button>
                <Button color="success" variant="contained" onClick={() => mark('known')}>
                    ידעתי
                </Button>
                <Button onClick={reshuffle}>ערבב מחדש</Button>
            </Stack>

            <Typography variant="caption" display="block" sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                46 מושגים — חזרו על כרטיסים שסימנתם &quot;צריך חזרה&quot; במעבר הבא
            </Typography>
        </Box>
    );
};
