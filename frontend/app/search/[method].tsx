// Location: app/search/[method].tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, Keyboard } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// --- KONFIGURASI IP ---
// GANTI DENGAN IP LAPTOP ANDA SAAT INI
const API_URL = 'http://192.168.100.9:5000'; 

export default function SearchScreen() {
  const { method } = useLocalSearchParams(); 
  const router = useRouter();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Format judul agar rapi (misal: "vector-space" jadi "Vector Space")
  const methodName = method ? method.toString().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Search';

  // Efek: Jika metode clustering, langsung cari tanpa nunggu user ketik
  useEffect(() => {
    if (method === 'clustering') {
        handleSearch();
    }
  }, [method]);

  const handleSearch = async () => {
    Keyboard.dismiss();
    // Validasi input, kecuali untuk clustering yang tidak butuh query
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
         // Clustering pakai GET
         response = await axios.get(endpoint, { timeout: 10000 });
      } else {
         // Search biasa pakai POST
         response = await axios.post(endpoint, { query: query }, { timeout: 10000 });
      }

      setResults(response.data);

    } catch (error) {
      console.error("[ERROR DETAIL]:", error);
      let errorMessage = "Terjadi kesalahan koneksi.";

      if (error.response) {
        errorMessage = `Server Error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Gagal menghubungi server. Cek IP Laptop & Firewall.";
      } else {
        errorMessage = error.message;
      }
      
      Alert.alert("Gagal", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ITEM (CARD YANG BISA DIKLIK) ---
  const renderItem = ({ item, index }) => (
    <TouchableOpacity 
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => {
        // Navigasi ke halaman detail analisis
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
      {/* Header Kartu: ID & Kategori */}
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

      {/* Isi Dokumen */}
      <Text style={styles.cardBody}>{item.text}</Text>
      
      {/* Footer Kartu: Metrics (Score/Cluster) */}
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
      
      {/* --- HEADER CONFIG --- */}
      <Stack.Screen options={{ 
          headerTitle: methodName,
          headerStyle: { backgroundColor: '#F8F9FE' }, 
          headerShadowVisible: false, 
          headerTintColor: '#1E1E2D',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
          headerBackTitleVisible: false,
      }} />

      {/* --- INPUT SECTION --- */}
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
                 {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                 ) : (
                    <Ionicons name="arrow-forward" size={24} color="#fff" />
                 )}
            </TouchableOpacity>
        </View>
      )}

      {/* --- LIST SECTION --- */}
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

  // Search Section Styles
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    // Soft Shadow
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
    marginRight: 10,
    borderWidth: 1, borderColor: '#F0F0F0'
  },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  searchButton: {
    width: 50, height: 50,
    backgroundColor: '#6C63FF', // Primary Purple
    borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5,
  },

  // List Styles
  listContainer: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 5 },
  centerLoader: { marginTop: 50, alignItems: 'center' },

  // Card Styles
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    // Modern Card Shadow
    shadowColor: "#1E1E2D", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
    borderWidth: 1, borderColor: '#F5F5FA'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  idContainer: { flexDirection: 'row', alignItems: 'center' },
  cardId: { fontSize: 12, color: '#A0A0A0', fontWeight: '600', marginLeft: 5 },
  
  categoryBadge: { backgroundColor: '#EEF2FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  categoryText: { color: '#6C63FF', fontSize: 11, fontWeight: '700' },
  
  cardBody: { fontSize: 16, color: '#333', lineHeight: 24, fontWeight: '500' },

  // Footer / Metrics
  cardFooter: { flexDirection: 'row', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F8F9FE' },
  metricBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, marginRight: 10 },
  
  metricScore: { backgroundColor: '#E6F7EF' }, // Light Green bg
  metricCluster: { backgroundColor: '#F2E7FE' }, // Light Purple bg
  
  metricText: { fontSize: 12, fontWeight: 'bold', marginLeft: 5 },

  // Empty State
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 60, opacity: 0.8 },
  emptyText: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20 },
  emptySubText: { fontSize: 14, color: '#999', marginTop: 5, textAlign: 'center' },
});