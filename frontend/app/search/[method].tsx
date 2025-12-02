// Location: app/search/[method].tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, Keyboard, Platform } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { FontAwesome5, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Audio } from 'expo-av'; // <--- Import Audio

// --- KONFIGURASI IP ---
const API_URL = 'http://192.168.100.9:5000'; 

// --- KOMPONEN HIGHLIGHT (YANG TADI) ---
const HighlightText = ({ text, highlight, style }) => {
  if (!text) return null;
  if (!highlight || !highlight.trim()) return <Text style={style}>{text}</Text>;
  try {
    const cleanHighlight = highlight.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${cleanHighlight})`, 'gi');
    const parts = text.split(regex);
    return (
      <Text style={style}>
        {parts.map((part, index) => 
          part.toLowerCase() === cleanHighlight.toLowerCase() ? (
            <Text key={index} style={{ backgroundColor: '#FFEB3B', color: '#000', fontWeight: 'bold' }}>{part}</Text>
          ) : ( <Text key={index}>{part}</Text> )
        )}
      </Text>
    );
  } catch (e) { return <Text style={style}>{text}</Text>; }
};

export default function SearchScreen() {
  const { method } = useLocalSearchParams(); 
  const router = useRouter();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State untuk Recording
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const methodName = method ? method.toString().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Search';

  useEffect(() => {
    if (method === 'clustering') handleSearch();
    // Minta Izin Microphone saat halaman dibuka
    Audio.requestPermissionsAsync();
  }, [method]);

  // --- FUNGSI SEARCH (EXISTING) ---
  const handleSearch = async (textToSearch = query) => {
    Keyboard.dismiss();
    const finalQuery = textToSearch || query;

    if (!finalQuery.trim() && method !== 'clustering') {
        Alert.alert("Info", "Mohon masukkan kata kunci.");
        return;
    }

    setLoading(true);
    setResults([]); 

    try {
      let endpoint = `${API_URL}/search/${method}`;
      let response;
      if (method === 'clustering') {
         response = await axios.get(`${API_URL}/clustering`, { timeout: 10000 });
      } else {
         response = await axios.post(endpoint, { query: finalQuery }, { timeout: 10000 });
      }
      setResults(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Gagal", "Koneksi backend bermasalah.");
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIKA REKAM SUARA ---
  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      Alert.alert('Gagal', 'Tidak bisa mengakses microphone.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    setLoading(true); // Tampilkan loading saat proses transkrip

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI(); 
      setRecording(null);

      // Upload Audio ke Backend
      const formData = new FormData();
      // @ts-ignore
      formData.append('audio', {
        uri: uri,
        type: 'audio/m4a', // Format rekaman default Expo
        name: 'voice_search.m4a',
      });

      console.log("Uploading audio...");
      const response = await axios.post(`${API_URL}/voice-search`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const transcribedText = response.data.text;
      console.log("Hasil Suara:", transcribedText);
      
      if (transcribedText) {
          setQuery(transcribedText); // Isi kolom search
          handleSearch(transcribedText); // Langsung cari
      }

    } catch (error) {
      console.error(error);
      Alert.alert("Gagal Mengenali Suara", "Pastikan internet lancar & backend punya FFmpeg.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push({ pathname: "/detail-analysis", params: { doc_id: item.id, method, query, score: item.score }})}
    >
      <View style={styles.cardHeader}>
          <View style={styles.idContainer}>
            <MaterialIcons name="article" size={14} color="#A0A0A0" />
            <Text style={styles.cardId}>Doc #{item.id}</Text>
          </View>
          {item.category && <View style={styles.categoryBadge}><Text style={styles.categoryText}>{item.category}</Text></View>}
      </View>
      <HighlightText text={item.text} highlight={method === 'clustering' ? '' : query} style={styles.cardBody} />
      {(item.score !== undefined || item.cluster !== undefined) && (
        <View style={styles.cardFooter}>
            {item.score !== undefined && <View style={[styles.metricBadge, styles.metricScore]}><Ionicons name="speedometer-outline" size={14} color="#00864e" /><Text style={[styles.metricText, {color: '#00864e'}]}>{typeof item.score === 'number' ? item.score.toFixed(4) : item.score}</Text></View>}
            {item.cluster !== undefined && <View style={[styles.metricBadge, styles.metricCluster]}><MaterialIcons name="bubble-chart" size={14} color="#8540F5" /><Text style={[styles.metricText, {color: '#8540F5'}]}>{item.cluster}</Text></View>}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ title: methodName, headerStyle: { backgroundColor: '#F8F9FE' }, headerShadowVisible: false }} />

      {method !== 'clustering' && (
        <View style={styles.searchSection}>
            <View style={styles.searchBar}>
                {/* Tombol Mic */}
                <TouchableOpacity 
                    onPressIn={startRecording} // Tekan Tahan untuk Rekam
                    onPressOut={stopRecording} // Lepas untuk Stop & Cari
                    style={[styles.micButton, isRecording && styles.micActive]}
                >
                    <Ionicons name={isRecording ? "mic" : "mic-outline"} size={22} color={isRecording ? "#fff" : "#6C63FF"} />
                </TouchableOpacity>

                <TextInput
                    style={styles.searchInput}
                    placeholder={isRecording ? "Mendengarkan..." : "Cari (Tahan Mic)..."}
                    placeholderTextColor="#A0A0A0"
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={() => handleSearch()}
                    returnKeyType="search"
                />
            </View>
            <TouchableOpacity style={[styles.searchButton, loading && {backgroundColor: '#B0B0C0'}]} onPress={() => handleSearch()} disabled={loading}>
                 {loading ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="arrow-forward" size={24} color="#fff" />}
            </TouchableOpacity>
        </View>
      )}

      {loading && method === 'clustering' && <View style={styles.centerLoader}><ActivityIndicator size="large" color="#6C63FF" /></View>}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={!loading && <View style={styles.emptyState}><MaterialIcons name="find-in-page" size={80} color="#E0E0E0" /><Text style={styles.emptyText}>{method === 'clustering' ? "Data kosong." : "Tidak ditemukan."}</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  searchSection: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, alignItems: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 15, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, marginRight: 10, borderWidth: 1, borderColor: '#F0F0F0' },
  searchInput: { flex: 1, fontSize: 16, color: '#333', marginLeft: 10, height: 40 },
  
  // Style Tombol Mic
  micButton: { width: 40, height: 40, borderRadius: 12, backgroundColor: '#F0F0F3', alignItems: 'center', justifyContent: 'center' },
  micActive: { backgroundColor: '#FF4757' }, // Merah saat merekam
  
  searchButton: { width: 50, height: 50, backgroundColor: '#6C63FF', borderRadius: 15, alignItems: 'center', justifyContent: 'center', shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 5 },
  centerLoader: { marginTop: 50, alignItems: 'center' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 15, shadowColor: "#1E1E2D", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3, borderWidth: 1, borderColor: '#F5F5FA' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  idContainer: { flexDirection: 'row', alignItems: 'center' },
  cardId: { fontSize: 12, color: '#A0A0A0', fontWeight: '600', marginLeft: 5 },
  categoryBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryText: { color: '#6C63FF', fontSize: 11, fontWeight: '700' },
  cardBody: { fontSize: 16, color: '#333', lineHeight: 24, fontWeight: '500' },
  cardFooter: { flexDirection: 'row', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F8F9FE' },
  metricBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginRight: 10 },
  metricScore: { backgroundColor: '#E6F7EF' }, metricCluster: { backgroundColor: '#F2E7FE' }, metricText: { fontSize: 12, fontWeight: 'bold', marginLeft: 5 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60, opacity: 0.8 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20 }
});