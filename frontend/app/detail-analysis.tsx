// Location: app/detail-analysis.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import axios from 'axios';

// GANTI IP INI SESUAI LAPTOP
const API_URL = 'http://192.168.100.9:5000'; 

export default function DetailAnalysisScreen() {
  const { doc_id, method, query, score } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      // Panggil endpoint baru /analyze
      const response = await axios.post(`${API_URL}/analyze`, {
        doc_id: doc_id,
        method: method,
        query: query
      });
      setData(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ 
          title: 'Detail Analisis', 
          headerStyle: { backgroundColor: '#F8F9FE' },
          headerShadowVisible: false,
      }} />

      {/* --- Header Section --- */}
      <View style={styles.headerCard}>
        <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="microscope" size={32} color="#6C63FF" />
        </View>
        <View style={{flex: 1}}>
            <Text style={styles.headerTitle}>Audit Pencarian</Text>
            <Text style={styles.headerSubtitle}>Metode: {method?.toString().toUpperCase()}</Text>
        </View>
        {score && (
            <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>{parseFloat(score as string).toFixed(2)}</Text>
                <Text style={styles.scoreLabel}>Score</Text>
            </View>
        )}
      </View>

      {loading ? (
        <View style={{marginTop: 50}}>
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={{textAlign: 'center', marginTop: 10, color: '#888'}}>Menghitung kalkulasi...</Text>
        </View>
      ) : (
        <View>
            {/* --- Document Content --- */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Isi Dokumen</Text>
                <View style={styles.docCard}>
                    <Text style={styles.docText}>"{data?.doc_text}"</Text>
                </View>
            </View>

            {/* --- Analysis Steps --- */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Langkah Perhitungan</Text>
                <View style={styles.stepsContainer}>
                    {data?.steps?.map((step: string, index: number) => (
                        <View key={index} style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumText}>{index + 1}</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepText}>{step}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* --- Info Box --- */}
            <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={24} color="#45B7D1" />
                <Text style={styles.infoText}>
                    Analisis ini digenerate secara realtime oleh server Python Flask berdasarkan algoritma yang dipilih.
                </Text>
            </View>
        </View>
      )}
      
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE', padding: 20 },
  
  // Header
  headerCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 20, borderRadius: 20,
    marginBottom: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3
  },
  iconContainer: { width: 50, height: 50, borderRadius: 15, backgroundColor: '#EDE7F6', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E1E2D' },
  headerSubtitle: { fontSize: 14, color: '#A0A0A0' },
  scoreBadge: { alignItems: 'center', backgroundColor: '#E6F7EF', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 10 },
  scoreText: { fontSize: 16, fontWeight: 'bold', color: '#00864e' },
  scoreLabel: { fontSize: 10, color: '#00864e' },

  // Sections
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15, marginLeft: 5 },
  
  // Doc Card
  docCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#F0F0F0', borderLeftWidth: 5, borderLeftColor: '#6C63FF' },
  docText: { fontSize: 16, fontStyle: 'italic', color: '#555', lineHeight: 24 },

  // Steps
  stepsContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  stepItem: { flexDirection: 'row', marginBottom: 20 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#6C63FF', alignItems: 'center', justifyContent: 'center', marginRight: 15, marginTop: 2 },
  stepNumText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  stepContent: { flex: 1 },
  stepText: { fontSize: 14, color: '#444', lineHeight: 22 },

  // Info Box
  infoBox: { flexDirection: 'row', backgroundColor: '#E0F7FA', padding: 15, borderRadius: 15, alignItems: 'center' },
  infoText: { flex: 1, marginLeft: 10, color: '#006064', fontSize: 12, lineHeight: 18 }
});