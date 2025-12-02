// Location: app/detail-analysis.tsx
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

// LIBRARY CHART BARU
import { BarChart } from "react-native-chart-kit";

// IP SERVER
const API_URL = 'http://192.168.100.9:5000'; // Sesuaikan IP

export default function DetailAnalysisScreen() {
  const { doc_id, method, query, score } = useLocalSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Lebar layar untuk grafik
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
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
      <StatusBar style="dark" />
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

            {data?.chart_data && query ? (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Frekuensi Kata Kunci</Text>
                    <View style={styles.chartContainer}>
                        <BarChart
                            data={{
                                // Ambil label (kata) dan data (jumlah) dari backend
                                labels: Object.keys(data.chart_data),
                                datasets: [{ data: Object.values(data.chart_data) }]
                            }}
                            width={screenWidth - 40} 
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={{
                                backgroundColor: "#fff",
                                backgroundGradientFrom: "#fff",
                                backgroundGradientTo: "#fff",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`, // Warna Ungu
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: { borderRadius: 16 },
                                barPercentage: 0.7,
                            }}
                            style={{ marginVertical: 8, borderRadius: 16 }}
                            fromZero={true}
                            showValuesOnTopOfBars={true}
                        />
                        <Text style={styles.chartCaption}>Grafik jumlah kemunculan kata query di dokumen ini.</Text>
                    </View>
                </View>
            ) : null}

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

            <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={24} color="#45B7D1" />
                <Text style={styles.infoText}>
                    Analisis ini digenerate secara realtime oleh server Python Flask.
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

  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15, marginLeft: 5 },
  
  docCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, borderWidth: 1, borderColor: '#F0F0F0', borderLeftWidth: 5, borderLeftColor: '#6C63FF' },
  docText: { fontSize: 16, fontStyle: 'italic', color: '#555', lineHeight: 24 },

  stepsContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 20 },
  stepItem: { flexDirection: 'row', marginBottom: 20 },
  stepNumber: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#6C63FF', alignItems: 'center', justifyContent: 'center', marginRight: 15, marginTop: 2 },
  stepNumText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  stepContent: { flex: 1 },
  stepText: { fontSize: 14, color: '#444', lineHeight: 22 },

  infoBox: { flexDirection: 'row', backgroundColor: '#E0F7FA', padding: 15, borderRadius: 15, alignItems: 'center' },
  infoText: { flex: 1, marginLeft: 10, color: '#006064', fontSize: 12, lineHeight: 18 },

  // STYLE BARU UNTUK CHART
  chartContainer: {
      backgroundColor: '#fff', borderRadius: 20, padding: 10, alignItems: 'center',
      shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2
  },
  chartCaption: { fontSize: 12, color: '#888', marginTop: 10, fontStyle: 'italic' }
});