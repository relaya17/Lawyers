import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LearnScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>מסך למידה — בקרוב</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f7fa' },
  text: { fontSize: 16, color: '#1e3a5f' },
});
