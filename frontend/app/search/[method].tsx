// Location: app/search/[method].tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// --- KONFIGURASI IP ---
const API_URL = 'http://192.168.100.9:5000'; // Sesuaikan IP Laptop Anda

// --- KOMPONEN BARU: HIGHLIGHT TEXT ---
// Fungsi ini memecah teks dan mewarnai kata yang cocok dengan query
// --- KOMPONEN BARU: SMART HIGHLIGHT ---
const HighlightText = ({ text, highlight, style }) => {
    // 1. Cek jika teks dokumen kosong
    if (!text) return null;
  
    // 2. Cek jika kata kunci kosong atau cuma spasi
    if (!highlight || !highlight.trim()) {
      return <Text style={style}>{text}</Text>;
    }
  
    try {
      // 3. AMAN: Bersihkan kata kunci dari spasi (trim) dan karakter regex berbahaya
      const cleanHighlight = highlight.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // 4. Buat Regex
      const regex = new RegExp(`(${cleanHighlight})`, 'gi');
      const parts = text.split(regex);
  
      return (
        <Text style={style}>
          {parts.map((part, index) => 
            // Bandingkan lower case agar tidak peduli huruf besar/kecil
            part.toLowerCase() === cleanHighlight.toLowerCase() ? (
              <Text key={index} style={{ backgroundColor: '#FFEB3B', color: '#000', fontWeight: 'bold' }}>
                {part}
              </Text>
            ) : (
              <Text key={index}>{part}</Text>
            )
          )}
        </Text>
      );
    } catch (e) {
      // 5. Fallback: Jika error regex, tampilkan teks biasa (jangan bikin aplikasi crash/blank)
      console.error("Highlight Error:", e);
      return <Text style={style}>{text}</Text>;
    }
  };

export default function SearchScreen() {
  const { method } = useLocalSearchParams(); 
  const router = useRouter();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const methodName = method ? method.toString().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Search';

  useEffect(() => {
    if (method === 'clustering') {
        handleSearch();
    }
  }, [method]);

  const handleSearch = async () => {
    Keyboard.dismiss();
    if (!query.trim() && method !== 'clustering') {
        Alert.alert("Info", "Mohon masukkan kata kunci pencarian terlebih dahulu.");
        return;
    }

    setLoading(true);
    setResults([]); 

    try {
      let endpoint = `${API_URL}/search/${method}`;
      let response;
      
      console.log(`[LOG] Requesting: ${endpoint}`); 

      if (method === 'clustering') {
         endpoint = `${API_URL}/clustering`;
         response = await axios.get(endpoint, { timeout: 10000 });
      } else {
         response = await axios.post(endpoint, { query: query }, { timeout: 10000 });
      }

      setResults(response.data);

    } catch (error) {
      console.error("[ERROR DETAIL]:", error);
      let errorMessage = "Terjadi kesalahan koneksi.";
      if (error.response) errorMessage = `Server Error: ${error.response.status}`;
      else if (error.request) errorMessage = "Gagal menghubungi server. Cek IP & Firewall.";
      else errorMessage = error.message;
      
      Alert.alert("Gagal", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => {
        router.push({
            pathname: "/detail-analysis",
            params: {
                doc_id: item.id,
                method: method,
                query: query,
                score: item.score
            }
        });
      }}
    >
      <View style={styles.cardHeader}>
          <View style={styles.idContainer}>
            <MaterialIcons name="article" size={14} color="#A0A0A0" />
            <Text style={styles.cardId}>Doc #{item.id}</Text>
          </View>
          {item.category && (
            <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          )}
      </View>

      {/* --- MENGGUNAKAN KOMPONEN HIGHLIGHT --- */}
      {/* Kita ganti <Text> biasa dengan <HighlightText> */}
      <HighlightText 
        text={item.text} 
        highlight={method === 'clustering' ? '' : query} // Jangan highlight kalau clustering
        style={styles.cardBody} 
      />
      
      {(item.score !== undefined || item.cluster !== undefined) && (
        <View style={styles.cardFooter}>
            {item.score !== undefined && (
                <View style={[styles.metricBadge, styles.metricScore]}>
                    <Ionicons name="speedometer-outline" size={14} color="#00864e" />
                    <Text style={[styles.metricText, {color: '#00864e'}]}>
                        Score: {typeof item.score === 'number' ? item.score.toFixed(4) : item.score}
                    </Text>
                </View>
            )}
            {item.cluster !== undefined && (
                <View style={[styles.metricBadge, styles.metricCluster]}>
                    <MaterialIcons name="bubble-chart" size={14} color="#8540F5" />
                    <Text style={[styles.metricText, {color: '#8540F5'}]}>
                        Cluster: {item.cluster}
                    </Text>
                </View>
            )}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack.Screen options={{ 
          headerTitle: methodName,
          headerStyle: { backgroundColor: '#F8F9FE' }, 
          headerShadowVisible: false, 
          headerTintColor: '#1E1E2D',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          headerBackTitleVisible: false,
      }} />

      {method !== 'clustering' && (
        <View style={styles.searchSection}>
            <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={20} color="#A0A0A0" style={{marginRight: 10}} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari dokumen..."
                    placeholderTextColor="#A0A0A0"
                    value={query}
                    onChangeText={setQuery}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
            </View>
            <TouchableOpacity 
                style={[styles.searchButton, loading && {backgroundColor: '#B0B0C0'}]} 
                onPress={handleSearch}
                disabled={loading}
            >
                 {loading ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="arrow-forward" size={24} color="#fff" />}
            </TouchableOpacity>
        </View>
      )}

      {loading && method === 'clustering' && (
         <View style={styles.centerLoader}>
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={{color: '#666', marginTop: 10}}>Mengelompokkan data...</Text>
         </View>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            !loading && (
                <View style={styles.emptyState}>
                    <MaterialIcons name="find-in-page" size={80} color="#E0E0E0" />
                    <Text style={styles.emptyText}>
                        {method === 'clustering' ? "Data belum tersedia." : "Tidak ditemukan hasil."}
                    </Text>
                    <Text style={styles.emptySubText}>Coba kata kunci lain atau periksa koneksi.</Text>
                </View>
            )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  searchSection: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, alignItems: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 12, borderRadius: 15, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2, marginRight: 10, borderWidth: 1, borderColor: '#F0F0F0' },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
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
  metricScore: { backgroundColor: '#E6F7EF' }, 
  metricCluster: { backgroundColor: '#F2E7FE' }, 
  metricText: { fontSize: 12, fontWeight: 'bold', marginLeft: 5 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60, opacity: 0.8 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20 },
  emptySubText: { fontSize: 14, color: '#999', marginTop: 5, textAlign: 'center' },
});