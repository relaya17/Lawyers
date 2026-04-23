import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../auth/AuthContext';

const WEB_URL = 'https://lawye.netlify.app';

interface QuickCard {
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  tab?: '/(tabs)/learn' | '/(tabs)/exam' | '/(tabs)/legal-ai' | '/(tabs)/profile';
  url?: string;
}

const QUICK_CARDS: QuickCard[] = [
  {
    emoji: '📚',
    title: 'ספריית הלמידה',
    subtitle: '8 נושאים + חומר לימוד',
    color: '#1565c0',
    tab: '/(tabs)/learn',
  },
  {
    emoji: '✏️',
    title: 'מבחן תרגול',
    subtitle: '15 שאלות רב-ברירה',
    color: '#2e7d32',
    tab: '/(tabs)/exam',
  },
  {
    emoji: '🤖',
    title: 'מאמן AI',
    subtitle: 'שאלות משפטיות עם RAG',
    color: '#6a1b9a',
    tab: '/(tabs)/legal-ai',
  },
  {
    emoji: '⚖️',
    title: 'בית משפט וירטואלי',
    subtitle: 'פתח באתר המלא',
    color: '#b71c1c',
    url: `${WEB_URL}/courtroom`,
  },
  {
    emoji: '📊',
    title: 'לוח התקדמות',
    subtitle: 'עקוב אחרי הלמידה שלך',
    color: '#00695c',
    url: `${WEB_URL}/personal-learning`,
  },
  {
    emoji: '⚡',
    title: 'ניתוח סיכונים',
    subtitle: 'בדיקת חוזים עם AI',
    color: '#e65100',
    url: `${WEB_URL}/risk-analysis`,
  },
];

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleCard = (card: QuickCard) => {
    if (card.tab) {
      router.push(card.tab);
    } else if (card.url) {
      void Linking.openURL(card.url);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.logo}>⚖️ LexStudy</Text>
          {user ? (
            <TouchableOpacity onPress={signOut}>
              <Text style={styles.signOutBtn}>יציאה</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.signInBtn}>כניסה</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Welcome card */}
        <View style={styles.welcomeCard}>
          {user ? (
            <>
              <Text style={styles.welcomeHi}>שלום, {user.firstName}! 👋</Text>
              <Text style={styles.welcomeSub}>מחובר כ-{user.role === 'admin' ? 'מנהל' : 'סטודנט'}</Text>
            </>
          ) : (
            <>
              <Text style={styles.welcomeHi}>ברוך הבא ל-LexStudy</Text>
              <Text style={styles.welcomeSub}>פלטפורמת הלמידה המשפטית המובילה בישראל</Text>
              <TouchableOpacity
                style={styles.loginPrompt}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.loginPromptText}>כניסה / הרשמה למאמן AI ←</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { n: '15+', label: 'שאלות' },
            { n: '8', label: 'נושאים' },
            { n: 'AI', label: 'מאמן' },
          ].map((s) => (
            <View key={s.label} style={styles.stat}>
              <Text style={styles.statNumber}>{s.n}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick access grid */}
        <Text style={styles.sectionTitle}>גישה מהירה</Text>
        <View style={styles.grid}>
          {QUICK_CARDS.map((card) => (
            <TouchableOpacity
              key={card.title}
              style={[styles.card, { borderTopColor: card.color }]}
              onPress={() => handleCard(card)}
            >
              <Text style={styles.cardEmoji}>{card.emoji}</Text>
              <Text style={styles.cardTitle}>{card.title}</Text>
              <Text style={styles.cardSub}>{card.subtitle}</Text>
              {card.url && (
                <Text style={[styles.externalTag, { color: card.color }]}>↗ באתר</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer note */}
        <Text style={styles.footerNote}>
          תכונות נוספות זמינות באתר{'\n'}
          <Text
            style={styles.footerLink}
            onPress={() => void Linking.openURL(WEB_URL)}
          >
            {WEB_URL}
          </Text>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  content: { padding: 16, paddingBottom: 32 },

  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: { fontSize: 24, fontWeight: '800', color: '#1e3a5f' },
  signOutBtn: { fontSize: 14, color: '#b71c1c', fontWeight: '600' },
  signInBtn: { fontSize: 14, color: '#1565c0', fontWeight: '700' },

  welcomeCard: {
    backgroundColor: '#1e3a5f',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  welcomeHi: { fontSize: 20, fontWeight: '700', color: '#fff', textAlign: 'right', marginBottom: 4 },
  welcomeSub: { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'right' },
  loginPrompt: {
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-end',
  },
  loginPromptText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e8ecf0',
  },
  stat: { alignItems: 'center' },
  statNumber: { fontSize: 26, fontWeight: '800', color: '#1e3a5f' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3a5f',
    textAlign: 'right',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginBottom: 20,
  },
  card: {
    width: '47%',
    margin: '1.5%',
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
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1e3a5f', textAlign: 'right', marginBottom: 3 },
  cardSub: { fontSize: 11, color: '#888', textAlign: 'right', lineHeight: 16 },
  externalTag: { fontSize: 11, fontWeight: '600', textAlign: 'right', marginTop: 4 },

  footerNote: { fontSize: 12, color: '#aaa', textAlign: 'center', lineHeight: 20 },
  footerLink: { color: '#1565c0', fontWeight: '600' },
});
