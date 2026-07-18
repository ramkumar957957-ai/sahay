import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';

export default function App() {
  const [contacts] = useState([
    { name: 'Priya', role: 'Caregiver' },
    { name: 'Dr. Kumar', role: 'Doctor' }
  ]);
  const [reminders] = useState([
    { title: 'Medicine', time: '8:00 AM' },
    { title: 'Doctor call', time: '3:00 PM' }
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Sahay</Text>
        <Text style={styles.subtitle}>Assistive support for daily care</Text>

        <TouchableOpacity style={styles.sos}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contacts</Text>
          {contacts.map((item, index) => (
            <Text key={index} style={styles.item}>{item.name} • {item.role}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Reminders</Text>
          {reminders.map((item, index) => (
            <Text key={index} style={styles.item}>{item.title} • {item.time}</Text>
          ))}
        </View>

        <TextInput style={styles.input} placeholder="Ask Sahay..." />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef4ff' },
  content: { padding: 18, gap: 12 },
  title: { fontSize: 30, fontWeight: '800', color: '#152238' },
  subtitle: { fontSize: 14, color: '#5b6b82', marginBottom: 10 },
  sos: { backgroundColor: '#d32f2f', borderRadius: 999, paddingVertical: 16, alignItems: 'center', marginVertical: 8 },
  sosText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#dfe8f6' },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  item: { fontSize: 14, color: '#5b6b82', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#dfe8f6', borderRadius: 999, padding: 10, backgroundColor: '#f8fbff' }
});
