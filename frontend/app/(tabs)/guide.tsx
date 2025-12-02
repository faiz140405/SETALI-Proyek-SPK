// Location: app/(tabs)/guide.tsx
import React from 'react';
import { StyleSheet, View, Text, ScrollView, Platform } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function GuideScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      
      {/* --- HEADER SECTION --- */}
      <View style={styles.header}>
        <View>
            <Text style={styles.headerTitle}>Panduan</Text>
            <Text style={styles.headerSubtitle}>Tutorial penggunaan aplikasi</Text>
        </View>
        <View style={styles.headerIcon}>
            <FontAwesome5 name="book-open" size={24} color="#6C63FF" />
        </View>
      </View>

      {/* --- STEP 1: PILIH METODE --- */}
      <View style={styles.stepCard}>
        <View style={styles.cardTop}>
            <View style={[styles.stepBadge, { backgroundColor: '#FF6B6B' }]}>
                <Text style={styles.stepNum}>1</Text>
            </View>
            <Text style={styles.stepTitle}>Pilih Metode</Text>
        </View>
        
        <Text style={styles.stepDesc}>
            Masuk ke menu <Text style={{fontWeight: 'bold', color: '#333'}}>Metode</Text>. Pilih algoritma yang ingin diuji (misal: <Text style={{fontStyle:'italic'}}>VSM</Text> atau <Text style={{fontStyle:'italic'}}>Regex</Text>).
        </Text>

        {/* Visualisasi: Grid Pilihan */}
        <View style={styles.visualContainer}>
            <View style={[styles.miniCard, {borderLeftColor: '#FF6B6B'}]}>
                <MaterialCommunityIcons name="code-braces" size={20} color="#FF6B6B" />
                <Text style={styles.miniCardText}>Regex</Text>
            </View>
            <View style={[styles.miniCard, {borderLeftColor: '#4E1DC4'}]}>
                <MaterialCommunityIcons name="vector-combine" size={20} color="#4E1DC4" />
                <Text style={styles.miniCardText}>VSM</Text>
            </View>
            <View style={[styles.miniCard, {borderLeftColor: '#4ECDC4'}]}>
                <MaterialCommunityIcons name="vector-combine" size={20} color="#4ECDC4" />
                <Text style={styles.miniCardText}>Boolean</Text>
            </View>
            <View style={[styles.miniCard, {borderLeftColor: '#4ECD24'}]}>
                <MaterialCommunityIcons name="vector-combine" size={20} color="#4ECD24" />
                <Text style={styles.miniCardText}>Relevance Feedback</Text>
            </View>
            <MaterialIcons name="touch-app" size={32} color="#4ECD24" style={styles.fingerIcon} />
        </View>
      </View>

      {/* --- STEP 2: INPUT QUERY --- */}
      <View style={styles.stepCard}>
        <View style={styles.cardTop}>
            <View style={[styles.stepBadge, { backgroundColor: '#4ECDC4' }]}>
                <Text style={styles.stepNum}>2</Text>
            </View>
            <Text style={styles.stepTitle}>Input Kata Kunci</Text>
        </View>

        <Text style={styles.stepDesc}>
            Ketik kata kunci pencarian pada kolom yang tersedia, lalu tekan tombol cari.
        </Text>

        {/* Visualisasi: Search Bar Replica */}
        <View style={styles.visualContainer}>
            <View style={styles.fakeSearchBar}>
                <Ionicons name="search" size={18} color="#A0A0A0" />
                <Text style={styles.fakeSearchText}>python flask...</Text>
            </View>
            <View style={styles.fakeSearchButton}>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
        </View>
      </View>

      {/* --- STEP 3: ANALISIS --- */}
      <View style={styles.stepCard}>
        <View style={styles.cardTop}>
            <View style={[styles.stepBadge, { backgroundColor: '#6C63FF' }]}>
                <Text style={styles.stepNum}>3</Text>
            </View>
            <Text style={styles.stepTitle}>Cek Detail Analisis</Text>
        </View>

        <Text style={styles.stepDesc}>
            <Text style={{fontWeight: 'bold', color: '#6C63FF'}}>KLIK</Text> pada kartu hasil pencarian untuk melihat perhitungan langkah demi langkah.
        </Text>

        {/* Visualisasi: Flow ke Detail */}
        <View style={[styles.visualContainer, {backgroundColor: '#F8F9FE', borderRadius: 15, padding: 15}]}>
            <View style={styles.flowItem}>
                <MaterialIcons name="article" size={24} color="#A0A0A0" />
                <Text style={styles.flowText}>Hasil</Text>
            </View>
            
            <Ionicons name="ellipsis-horizontal" size={24} color="#ccc" />
            
            <View style={[styles.flowItem, {backgroundColor: '#fff', elevation: 2}]}>
                 <MaterialCommunityIcons name="microscope" size={24} color="#6C63FF" />
                 <Text style={[styles.flowText, {color: '#6C63FF', fontWeight: 'bold'}]}>Detail</Text>
            </View>
        </View>
        
        <View style={styles.tipBox}>
            <Ionicons name="bulb-outline" size={16} color="#F59E0B" />
            <Text style={styles.tipText}>
                Tips: Coba klik hasil pencarian untuk melihat skor TF-IDF atau Clustering.
            </Text>
        </View>
      </View>

      {/* Spacer untuk Bottom Tab */}
      <View style={{height: 80}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    backgroundColor: '#F8F9FE', 
    paddingHorizontal: 20, 
    paddingTop: 60 
  },

  // --- Header ---
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 30 
  },
  headerTitle: { fontSize: 30, fontWeight: 'bold', color: '#1E1E2D' },
  headerSubtitle: { fontSize: 14, color: '#A0A0A0', marginTop: 5 },
  headerIcon: {
    width: 50, height: 50, borderRadius: 15, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },

  // --- Cards ---
  stepCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#1E1E2D", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  
  // Badges
  stepBadge: { 
    width: 32, height: 32, borderRadius: 12, 
    alignItems: 'center', justifyContent: 'center', marginRight: 12 
  },
  stepNum: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  stepTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  stepDesc: { fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 20 },

  // --- Visualisasi Preview ---
  visualContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginTop: 5
  },
  
  // Step 1 Visuals
  miniCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FE', 
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    borderLeftWidth: 3, borderWidth: 1, borderColor: '#eee'
  },
  miniCardText: { marginLeft: 5, fontWeight: '600', color: '#555', fontSize: 12 },
  fingerIcon: { position: 'absolute', right: 20, bottom: -10, transform: [{rotate: '-15deg'}] },

  // Step 2 Visuals (Fake Search Bar)
  fakeSearchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', 
    backgroundColor: '#F8F9FE', padding: 10, borderRadius: 12,
    borderWidth: 1, borderColor: '#eee'
  },
  fakeSearchText: { marginLeft: 8, color: '#333', fontSize: 14 },
  fakeSearchButton: {
    width: 40, height: 40, backgroundColor: '#6C63FF', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center'
  },

  // Step 3 Visuals (Flow)
  flowItem: { alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 10 },
  flowText: { fontSize: 10, marginTop: 4, color: '#888' },

  // Tips Box
  tipBox: {
    flexDirection: 'row', backgroundColor: '#FFF8E1', 
    padding: 12, borderRadius: 12, marginTop: 20,
    alignItems: 'center'
  },
  tipText: { flex: 1, marginLeft: 10, color: '#D97706', fontSize: 12, fontStyle: 'italic' }
});