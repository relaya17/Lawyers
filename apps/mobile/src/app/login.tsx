import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../auth/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, loading } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) return;
    try {
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch {
      /* שגיאה מוצגת ע"י AuthContext */
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.logo}>⚖️ LexStudy</Text>
            <Text style={styles.subtitle}>פלטפורמת הלמידה המשפטית</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>כניסה לחשבון</Text>

            <Text style={styles.label}>אימייל</Text>
            <TextInput
              style={styles.input}
              placeholder="name@example.com"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textAlign="right"
            />

            <Text style={styles.label}>סיסמה</Text>
            <TextInput
              style={styles.input}
              placeholder="הכנס סיסמה"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textAlign="right"
            />

            <TouchableOpacity
              style={[styles.button, (loading || !email || !password) && styles.buttonDisabled]}
              onPress={() => void handleLogin()}
              disabled={loading || !email.trim() || !password.trim()}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>כניסה</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.hint}>
              אין לך חשבון? הירשם באתר{'\n'}
              <Text style={styles.hintLink}>https://lawye.netlify.app/register</Text>
            </Text>
          </View>

          <View style={styles.demoCard}>
            <Text style={styles.demoTitle}>למידה ללא כניסה</Text>
            <Text style={styles.demoText}>
              מסכי המבחנים ורוב תוכן הלמידה זמינים גם ללא חשבון.{'\n'}
              רק המאמן ה-AI דורש כניסה.
            </Text>
            <TouchableOpacity
              style={styles.guestButton}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.guestButtonText}>המשך כאורח</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#f0f4f8' },
  content: { padding: 20, paddingBottom: 40 },
  header: { alignItems: 'center', marginVertical: 32 },
  logo: { fontSize: 36, marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#1e3a5f', fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e3a5f',
    textAlign: 'right',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
    textAlign: 'right',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f7f9fc',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dde3ed',
    marginBottom: 16,
    color: '#1e3a5f',
  },
  button: {
    backgroundColor: '#1e3a5f',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  hint: { fontSize: 13, color: '#888', textAlign: 'center', lineHeight: 20 },
  hintLink: { color: '#1e3a5f', fontWeight: '600' },
  demoCard: {
    backgroundColor: '#e8f4fd',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#b3d7f0',
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1565c0',
    textAlign: 'right',
    marginBottom: 8,
  },
  demoText: { fontSize: 13, color: '#444', textAlign: 'right', lineHeight: 20, marginBottom: 12 },
  guestButton: {
    backgroundColor: '#1565c0',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  guestButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});
