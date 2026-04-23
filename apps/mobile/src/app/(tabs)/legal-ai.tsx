import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLegalAI } from '../../hooks/useLegalAI';

/**
 * מאמן משפטי — תשובות מבוססות מאגר RAG בשרת.
 * TODO: חברו כאן JWT מזרימת התחברות כשתהיה זמינה באפליקציה.
 */
export default function LegalAiScreen() {
  const [query, setQuery] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const mutation = useLegalAI(null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>המאמן המשפטי</Text>
          <Text style={styles.hint}>
            השאילתה נשלחת לשרת LexStudy עם חיפוש ווקטורי במאגר החוקים. נדרשת
            התחברות בשרת (הוסיפו JWT בהמשך).
          </Text>

          <TextInput
            style={styles.input}
            placeholder="שאלו שאלה משפטית…"
            placeholderTextColor="#999"
            value={query}
            onChangeText={setQuery}
            multiline
            textAlign="right"
          />

          <TouchableOpacity
            style={[styles.chip, verifiedOnly && styles.chipOn]}
            onPress={() => setVerifiedOnly(!verifiedOnly)}
          >
            <Text style={styles.chipText}>
              {verifiedOnly ? '✓ רק מקורות מאומתים' : 'כל המאגר (כולל טיוטה)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => mutation.mutate({ query, verifiedOnly })}
            disabled={mutation.isPending || query.trim().length < 3}
          >
            {mutation.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>שלח</Text>
            )}
          </TouchableOpacity>

          {mutation.isError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {(mutation.error as Error).message}
              </Text>
            </View>
          )}

          {mutation.data && (
            <View style={styles.answerBox}>
              <Text style={styles.answerTitle}>תשובה</Text>
              <Text style={styles.answerBody}>{mutation.data.answer}</Text>
              {mutation.data.citations.length > 0 && (
                <>
                  <Text style={styles.citeTitle}>מקורות</Text>
                  {mutation.data.citations.map((c) => (
                    <View key={c.id} style={styles.citeChip}>
                      <Text style={styles.citeText}>
                        {(c.title || 'מקור').slice(0, 40)} ·{' '}
                        {(c.similarity * 100).toFixed(0)}%
                      </Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#f5f7fa' },
  content: { padding: 16, paddingBottom: 32 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e3a5f',
    textAlign: 'center',
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    color: '#666',
    textAlign: 'right',
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 12,
  },
  chip: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e8e8e8',
    marginBottom: 12,
  },
  chipOn: { backgroundColor: '#c8e6c9' },
  chipText: { fontSize: 13, color: '#333' },
  button: {
    backgroundColor: '#1e3a5f',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  errorBox: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: { color: '#c62828', textAlign: 'right' },
  answerBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  answerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: 8,
    textAlign: 'right',
  },
  answerBody: {
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
    textAlign: 'right',
  },
  citeTitle: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  citeChip: {
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  citeText: { fontSize: 12, color: '#1565c0', textAlign: 'right' },
});
