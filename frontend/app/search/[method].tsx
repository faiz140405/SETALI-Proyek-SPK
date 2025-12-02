// Location: app/search/[method].tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, Keyboard, Switch } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// --- KONFIGURASI IP (SESUAIKAN) ---
const API_URL = 'http://192.168.100.9:5000'; 

// Komponen Highlight (Tetap Sama)
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

  // --- STATE UNTUK KONFIGURASI ---
  const [useStemming, setUseStemming] = useState(false);
  const [useStopword, setUseStopword] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // Untuk toggle menu opsi

  const methodName = method ? method.toString().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Search';

  useEffect(() => {
    if (method === 'clustering') handleSearch();
  }, [method]);

  const handleSearch = async () => {
    Keyboard.dismiss();
    if (!query.trim() && method !== 'clustering') {
        Alert.alert("Info", "Masukkan kata kunci.");
        return;
    }

    setLoading(true);
    setResults([]); 

    try {
      let endpoint = `${API_URL}/search/${method}`;
      let response;
      
      const payload = { 
          query: query,
          // Kirim konfigurasi ke backend
          use_stemming: useStemming,
          use_stopword: useStopword
      };

      if (method === 'clustering') {
         response = await axios.get(`${API_URL}/clustering`);
      } else {
         response = await axios.post(endpoint, payload);
      }

      setResults(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Gagal", "Koneksi backend bermasalah.");
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
      
      {/* Tampilkan info debugging jika ada */}
      {item.processed_text && (
          <Text style={{fontSize: 10, color: '#aaa', marginTop: 5, fontStyle: 'italic'}}>
              Processed: "{item.processed_text}"
          </Text>
      )}

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
        <View>
            <View style={styles.searchSection}>
                <View style={styles.searchBar}>
                    <Ionicons name="search-outline" size={20} color="#A0A0A0" style={{marginRight: 10}} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari dokumen..."
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={handleSearch}
                    />
                    {/* Tombol Toggle Option */}
                    <TouchableOpacity onPress={() => setShowOptions(!showOptions)}>
                        <Ionicons name={showOptions ? "options" : "options-outline"} size={24} color="#6C63FF" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={[styles.searchButton, loading && {backgroundColor: '#B0B0C0'}]} onPress={handleSearch} disabled={loading}>
                    {loading ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="arrow-forward" size={24} color="#fff" />}
                </TouchableOpacity>
            </View>

            {/* --- PANEL OPSI (MUNCUL JIKA DIKLIK) --- */}
            {showOptions && (
                <View style={styles.optionsPanel}>
                    <View style={styles.optionRow}>
                        <Text style={styles.optionLabel}>Stemming (Sastrawi)</Text>
                        <Switch 
                            trackColor={{ false: "#767577", true: "#6C63FF" }}
                            thumbColor={useStemming ? "#fff" : "#f4f3f4"}
                            onValueChange={() => setUseStemming(!useStemming)}
                            value={useStemming}
                        />
                    </View>
                    <View style={styles.optionRow}>
                        <Text style={styles.optionLabel}>Stopword Removal</Text>
                        <Switch 
                            trackColor={{ false: "#767577", true: "#6C63FF" }}
                            thumbColor={useStopword ? "#fff" : "#f4f3f4"}
                            onValueChange={() => setUseStopword(!useStopword)}
                            value={useStopword}
                        />
                    </View>
                </View>
            )}
        </View>
      )}

      {loading && method === 'clustering' && <View style={styles.centerLoader}><ActivityIndicator size="large" color="#6C63FF" /></View>}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={!loading && <View style={styles.emptyState}><MaterialIcons name="find-in-page" size={80} color="#E0E0E0" /><Text style={styles.emptyText}>Tidak ditemukan.</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  searchSection: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, marginRight: 10, borderWidth: 1, borderColor: '#F0F0F0' },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  searchButton: { width: 50, height: 50, backgroundColor: '#6C63FF', borderRadius: 15, alignItems: 'center', justifyContent: 'center', shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5 },
  
  // Style Options Panel
  optionsPanel: { backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 10, padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#eee' },
  optionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  optionLabel: { fontSize: 14, color: '#333', fontWeight: '500' },

  listContainer: { paddingHorizontal: 20, paddingBottom: 30 },
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