import { useState } from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Topic {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  sections: { heading: string; body: string }[];
}

const TOPICS: Topic[] = [
  {
    id: 'criminal',
    emoji: '🚔',
    title: 'משפט פלילי',
    subtitle: 'עבירות, יסוד עובדתי ונפשי, הגנות',
    color: '#b71c1c',
    sections: [
      {
        heading: 'יסוד עובדתי (Actus Reus)',
        body: 'היסוד העובדתי של עבירה כולל את ההתנהגות האסורה, הנסיבות הרלוונטיות והתוצאה (בעבירות תוצאה). ברוב העבירות נדרשת פעולה אקטיבית, אך מחדל עשוי לספיק כאשר קיימת חובה חוקית לפעול.',
      },
      {
        heading: 'יסוד נפשי (Mens Rea)',
        body: 'המשפט הישראלי מכיר בארבעה סוגי יסוד נפשי (סעיף 20 חוק העונשין): כוונה, פזיזות (קלות דעת), רשלנות ואחריות קפידה. הכוונה היא המטרה להשיג את התוצאה האסורה.',
      },
      {
        heading: 'הגנות עיקריות',
        body: '• הגנה עצמית (סעיף 34ח) — שימוש בכוח סביר להגנה על גוף.\n• צורך (סעיף 34יא) — סכנה ממשית לחיים.\n• אונס/כפייה — פעל תחת איום ממשי.\n• אי-שפיות — לא הבין את מהות מעשיו.',
      },
      {
        heading: 'תהליך המשפט הפלילי',
        body: 'כתב אישום ← הקראה ← הליכים מקדמיים ← שמיעת ראיות ← סיכומים ← גזר דין. התביעה נושאת בנטל ההוכחה "מעבר לספק סביר".',
      },
    ],
  },
  {
    id: 'contracts',
    emoji: '📋',
    title: 'דיני חוזים',
    subtitle: 'גמירת דעת, מסוימות, פגמי רצון',
    color: '#1565c0',
    sections: [
      {
        heading: 'יסודות החוזה',
        body: 'לפי חוק החוזים (חלק כללי) תשל"ג-1973: חוזה נכרת בדרך של הצעה וקיבול. נדרשות גמירת דעת (הסכמה גמורה לעשות עסקה) ומסוימות (תנאים מוגדרים מספיק).',
      },
      {
        heading: 'פגמי רצון',
        body: '• טעות — טעות יסודית בנסיבות מהותיות לחוזה.\n• הטעיה — ייצוג כוזב של עובדה שגרם לצד להתקשר.\n• עושק — ניצול מצוקה, חולשה או חוסר ניסיון.\n• כפייה — לחץ בלתי לגיטימי.',
      },
      {
        heading: 'סעדים להפרה',
        body: 'אכיפה (סעיף 3), פיצויים (סעיף 10–14), ביטול. פיצויים צפויים = הפסד שנגרם + אובדן רווח ממוצא. פיצוי מוסכם מראש — בית המשפט רשאי להפחית אם גבוה פי שניים מהנזק הצפוי.',
      },
    ],
  },
  {
    id: 'torts',
    emoji: '⚖️',
    title: 'דיני נזיקין',
    subtitle: 'רשלנות, אחריות מוחלטת, פיצויים',
    color: '#2e7d32',
    sections: [
      {
        heading: 'עוולת הרשלנות',
        body: 'מבחן הרשלנות: (1) חובת זהירות מושגית ① — סבירות הנזק לאדם בנעליו; (2) חובת זהירות קונקרטית; (3) הפרת החובה; (4) קשר סיבתי; (5) נזק. מבחן "האדם הסביר" הוא אמת מידה אובייקטיבית.',
      },
      {
        heading: 'אחריות מוחלטת',
        body: 'חוק הפיצויים לנפגעי תאונות דרכים — אחריות ללא אשם לנהגים ומחזיקי כלי רכב. חוק האחריות למוצרים פגומים — יצרן אחראי לנזק שגרם מוצר פגום.',
      },
      {
        heading: 'פיצויים',
        body: 'פיצוי כספי: נזק ממוני (הוצאות רפואיות, אובדן השתכרות) + נזק לא ממוני (כאב וסבל, עגמת נפש). בתאונות דרכים — פיצוי לפי לוח ד׳ לחוק.',
      },
    ],
  },
  {
    id: 'property',
    emoji: '🏠',
    title: 'דיני קניין',
    subtitle: 'בעלות, רישום, שיתוף',
    color: '#4a148c',
    sections: [
      {
        heading: 'רישום מקרקעין',
        body: 'לפי חוק המקרקעין תשכ"ט-1969: עסקה במקרקעין טעונה רישום בלשכת רישום המקרקעין (טאבו) לשם גמירתה. זכויות נרשמות גוברות על זכויות שלא נרשמו.',
      },
      {
        heading: 'שיתוף במקרקעין',
        body: 'שותפים במקרקעין זכאים לפירוק שיתוף. דרכים: מכירה וחלוקת תמורה, פירוק בעין (אם ניתן לחלוקה), רכישת חלקו של האחר. ועדת שמאים קובעת שווי.',
      },
    ],
  },
  {
    id: 'family',
    emoji: '👨‍👩‍👧',
    title: 'דיני משפחה',
    subtitle: 'נישואין, גירושין, משמורת',
    color: '#e65100',
    sections: [
      {
        heading: 'גירושין בישראל',
        body: 'גירושין אזרחיים בישראל נעשים לפי דין דתי (גט ליהודים, טלאק/חולע למוסלמים). בית הדין הרבני מוסמך בענייני נישואין וגירושין בין יהודים.',
      },
      {
        heading: 'משמורת ומזונות',
        body: 'עקרון "טובת הילד" הוא הקריטריון המרכזי. ילדים עד גיל 6 — חזקת האם. מזונות ילדים — אב חייב לפי יכולתו וצרכי הילד. מזונות אישה — נקבע לפי הדין הדתי.',
      },
    ],
  },
  {
    id: 'administrative',
    emoji: '🏛️',
    title: 'משפט מינהלי',
    subtitle: 'סמכות, שיקול דעת, ביקורת שיפוטית',
    color: '#00695c',
    sections: [
      {
        heading: 'עקרונות המשפט המינהלי',
        body: 'כל רשות מינהלית חייבת לפעול בגדר סמכותה (ultra vires), בתום לב, בסבירות ובמידתיות. הפרת אחת מאלו = פסלות ההחלטה.',
      },
      {
        heading: 'ביקורת שיפוטית — בג"ץ',
        body: 'בית המשפט הגבוה לצדק מפקח על הרשות השלטונית. עילות ביטול: חריגה מסמכות, שיקולים זרים, אי-סבירות קיצונית (מבחן "ולדמן"), פגיעה בזכויות יסוד.',
      },
    ],
  },
  {
    id: 'constitutional',
    emoji: '📜',
    title: 'משפט חוקתי',
    subtitle: 'זכויות יסוד, חוקי יסוד',
    color: '#1a237e',
    sections: [
      {
        heading: 'חוקי היסוד',
        body: 'ישראל אין לה חוקה כתובה אחת, אלא חוקי יסוד הנחשבים כבעלי מעמד חוקתי-על-חוקי. בג"ץ מנה בפס"ד בנק מזרחי (1995) כי חוקי יסוד עשויים לגבור על חוקים רגילים.',
      },
      {
        heading: 'פסקת ההגבלה',
        body: 'חוק יסוד: כבוד האדם וחירותו: ניתן לפגוע בזכויות יסוד רק בחוק, לתכלית ראויה, במידה שאינה עולה על הנדרש.',
      },
    ],
  },
  {
    id: 'labor',
    emoji: '💼',
    title: 'דיני עבודה',
    subtitle: 'חוזה עבודה, פיטורין, זכויות',
    color: '#006064',
    sections: [
      {
        heading: 'חוזה עבודה',
        body: 'יחסי עובד-מעביד נוצרים כשמתקיים "מבחן ההשתלבות" (מכלול): עבודה אישית, שכר, תלות כלכלית, שילוב במפעל. עצמאי/קבלן אינו עובד אם מסכן הוא את הכסף.',
      },
      {
        heading: 'פיטורין וזכויות',
        body: 'פיצויי פיטורין: לפי חוק פיצויי פיטורים תשכ"ג — שנת עבודה = חודש שכר. שמיעה לפני פיטורין — חובה מינהלית-חוזית. הגנות מיוחדות: הריון, מחלה, שירות מילואים.',
      },
    ],
  },
];

export default function LearnScreen() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Topic | null>(null);

  const filtered = TOPICS.filter(
    (t) =>
      t.title.includes(search) ||
      t.subtitle.includes(search) ||
      t.sections.some((s) => s.heading.includes(search) || s.body.includes(search)),
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ספריית הלמידה</Text>
        <TextInput
          style={styles.search}
          placeholder="חיפוש נושא..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { borderTopColor: item.color }]}
            onPress={() => setSelected(item)}
          >
            <Text style={styles.cardEmoji}>{item.emoji}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>{item.subtitle}</Text>
            <Text style={[styles.cardCount, { color: item.color }]}>
              {item.sections.length} נושאים
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>לא נמצאו נושאים תואמים.</Text>
        }
      />

      <Modal visible={!!selected} animationType="slide" onRequestClose={() => setSelected(null)}>
        {selected && (
          <SafeAreaView style={styles.modal}>
            <View style={[styles.modalHeader, { backgroundColor: selected.color }]}>
              <Text style={styles.modalEmoji}>{selected.emoji}</Text>
              <Text style={styles.modalTitle}>{selected.title}</Text>
              <Text style={styles.modalSubtitle}>{selected.subtitle}</Text>
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSelected(null)}>
                <Text style={styles.closeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent}>
              {selected.sections.map((sec, i) => (
                <View key={i} style={styles.section}>
                  <Text style={[styles.sectionHeading, { color: selected.color }]}>
                    {sec.heading}
                  </Text>
                  <Text style={styles.sectionBody}>{sec.body}</Text>
                </View>
              ))}
              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  header: { padding: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e8ecf0' },
  title: { fontSize: 22, fontWeight: '700', color: '#1e3a5f', textAlign: 'right', marginBottom: 10 },
  search: {
    backgroundColor: '#f0f4f8',
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#dde3ed',
    color: '#333',
  },
  grid: { padding: 8 },
  card: {
    flex: 1,
    margin: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderTopWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  cardEmoji: { fontSize: 28, marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1e3a5f', textAlign: 'right', marginBottom: 4 },
  cardSub: { fontSize: 12, color: '#666', textAlign: 'right', marginBottom: 8, lineHeight: 17 },
  cardCount: { fontSize: 12, fontWeight: '600', textAlign: 'right' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 15 },
  modal: { flex: 1, backgroundColor: '#f5f7fa' },
  modalHeader: {
    padding: 24,
    paddingTop: 20,
    alignItems: 'flex-end',
  },
  modalEmoji: { fontSize: 40, marginBottom: 8 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#fff', textAlign: 'right' },
  modalSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'right', marginTop: 4 },
  closeBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  modalContent: { flex: 1, padding: 16 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeading: { fontSize: 16, fontWeight: '700', textAlign: 'right', marginBottom: 10 },
  sectionBody: { fontSize: 14, color: '#333', textAlign: 'right', lineHeight: 23 },
});
