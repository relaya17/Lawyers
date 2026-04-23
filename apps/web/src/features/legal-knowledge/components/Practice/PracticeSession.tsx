import React from 'react';
import { Box, Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Chip, Stack } from '@mui/material';
import { School as SchoolIcon, Quiz as QuizIcon } from '@mui/icons-material';

export interface PracticeSessionProps {
    subject: string;
}

const SUBJECT_FOCUS: Record<string, string[]> = {
    'מקורות המשפט': [
        'חזרו על היררכיית המקורות: חוקי יסוד, חוק רגיל, תקנה, תקדים, מנהג.',
        'תרגלו זיהוי סוג מקור לפי נוסח ומקור הסמכות.',
        'חברו בין פסיקת בג"ץ מכוננת לבין העיקרון שהיא קובעת.',
    ],
    חוקתי: [
        'עקרונות יסוד: דמוקרטיה, שלטון החוק, זכויות האדם.',
        'פסקת ההגבלה — שלושת המבחנים: לגיטימיות, תכלית, מידתיות.',
        'הבחנה בין ביקורת חוקתית לבין ביקורת סבירות במנהלי.',
    ],
    חוזים: [
        'יסודות כריתת חוזה: הצעה, קבלה, תמורה, כשרות הצדדים.',
        'פירוש חוזה — כוונת הצדדים מול משמעות סבירה.',
        'הפרה, תרופות, אכיפה — מתי ביטול ומתי סעד כספי.',
    ],
    עונשין: [
        'מבנה עבירה: יסוד מעשה, יסוד נפשי, נסיבות מחמירות ומקלות.',
        'ריבוי עבירות, ריבוי נסיבות ועקרון הספח.',
        'הגנות מקובלות: היעדר יסוד נפשי, טעות, אונס, הכרח.',
    ],
    משפחה: [
        'מנגנון גירושין, מזונות ומשמורת — עקרון טובת הילד.',
        'חלוקת רכוש — הסכמי ממון מול דין פרדה.',
        'צוואות, ירושה ויורשים סדריים.',
    ],
    עבודה: [
        'חוזה עבודה, שימוע לפני פיטורים, פיצויי פיטורין.',
        'שכר מינימום, שעות נוספות, זכויות סוציאליות.',
        'הבחנה עובד מול קבלן משנה ומול פרילנסר.',
    ],
    נזיקין: [
        'עילות נזיקין מרכזיות: רשלנות, עשייה, מחדל, תקיפה.',
        'קשר סיבתי, אשם תורם והפחתת פיצוי.',
        'אחריות מוצר, אחריות נושא ואחריות מוחלטת.',
    ],
    קניין: [
        'רישום מקרקעין, זיקת הנאה, שיתוף בבניין משותף.',
        'משכנתא, הערת אזהרה, עסקה נוגדת.',
        'קניין מיטלטלין — מסירה, חזקה, טובין ניידים.',
    ],
    מנהלי: [
        'עקרון החוקיות, שיקול דעת, שיקולים זרים.',
        'שימוע לפני החלטה, סבירות ומידתיות.',
        'עתירה מינהלית וחופש המידע.',
    ],
};

export const PracticeSession: React.FC<PracticeSessionProps> = ({ subject }) => {
    const tips = SUBJECT_FOCUS[subject] ?? [
        'פתחו את אותו נושא במצב מבחן כדי ליישם את החומר בשאלות מלאות.',
        'סמנו תשובות שגויות וחזרו על ההסברים שלהן.',
        'חברו כל שאלה למקור משפטי — חוק, תקנה או תקדים.',
    ];

    return (
        <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Chip icon={<SchoolIcon />} label={`תרגול: ${subject}`} color="success" variant="outlined" />
                <Typography variant="body2" color="text.secondary">
                    מצב תרגול ממוקד — ללא ציון סופי; מתאים לחזרה לפני מבחן מלא
                </Typography>
            </Stack>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        נקודות לחזרה
                    </Typography>
                    <List dense>
                        {tips.map((text, i) => (
                            <ListItem key={i} alignItems="flex-start">
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <QuizIcon color="primary" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};
