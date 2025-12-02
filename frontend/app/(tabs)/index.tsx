import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();

  // Fungsi navigasi cepat
  const goToSearch = (methodId: string) => {
    router.push({ pathname: "/search/[method]", params: { method: methodId } });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      
      {/* --- 1. HEADER SECTION --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, Faiz Nizar Nu'aim!</Text>
          <Text style={styles.date}>Today, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}.</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
           <Image 
            source={{ uri: 'https://ui-avatars.com/api/?name=Faiz&Nizarn&background=0D8ABC&color=fff' }} 
            style={styles.avatar} 
           />
        </TouchableOpacity>
      </View>

      {/* --- 2. HERO CARD (PURPLE) --- */}
      <TouchableOpacity 
        style={styles.heroCard} 
        activeOpacity={0.9}
        onPress={() => router.push('/(tabs)/features')}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>SETALI</Text>
          <Text style={styles.heroSubtitle}>Coba 6 algoritma pencarian dokumen sekarang.</Text>
          
          <View style={styles.avatarGroup}>
             <View style={[styles.miniAvatar, {backgroundColor: '#FFCF87'}]}><Text style={styles.miniAvatarText}>V</Text></View>
             <View style={[styles.miniAvatar, {backgroundColor: '#A6C8FF'}]}><Text style={styles.miniAvatarText}>R</Text></View>
             <View style={[styles.miniAvatar, {backgroundColor: '#FF99E6'}]}><Text style={styles.miniAvatarText}>+</Text></View>
             <Text style={styles.heroActionText}>Lihat Semua</Text>
          </View>
        </View>
        
        {/* Dekorasi 3D Abstract (Icon) */}
        <View style={styles.heroIllustration}>
            <MaterialCommunityIcons name="cube-scan" size={80} color="rgba(255,255,255,0.9)" />
        </View>
      </TouchableOpacity>

      {/* --- 3. HORIZONTAL STRIP (CALENDAR STYLE) --- */}
      {/* Kita gunakan ini sebagai shortcut filter/kategori */}
      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.stripContainer}>
        {['All', 'Theory', 'Code', 'Math', 'Data', 'Visual'].map((item, index) => (
          <TouchableOpacity key={index} style={[styles.stripItem, index === 0 && styles.stripItemActive]}>
            <Text style={[styles.stripText, index === 0 && styles.stripTextActive]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}

      {/* --- 4. MASONRY GRID SECTION (YOUR PLAN) --- */}
      <Text style={styles.sectionTitle}>Metode Populer</Text>
      
      <View style={styles.gridContainer}>
        {/* Kolom Kiri */}
        <View style={styles.column}>
          
          {/* Kartu Besar (ORANGE) - Vector Space Model */}
          <TouchableOpacity 
            style={[styles.card, styles.cardOrange]} 
            onPress={() => goToSearch('vsm')}
          >
            <View style={styles.cardHeader}>
               <View style={styles.iconPillOrange}><Text style={styles.pillText}>Medium</Text></View>
            </View>
            <Text style={styles.cardTitle}>Vector Space Model</Text>
            <Text style={styles.cardInfo}>TF-IDF & Cosine Similarity</Text>
            <View style={styles.cardFooter}>
               <Image source={{uri: 'https://ui-avatars.com/api/?name=V+S&background=fff&color=E8912A'}} style={styles.smallAvatar} />
               <Text style={styles.authorText}>Most Used</Text>
            </View>
          </TouchableOpacity>

          {/* Kartu Kecil (WHITE/GRAY) - Regex */}
           <TouchableOpacity 
            style={[styles.card, styles.cardWhite]} 
            onPress={() => goToSearch('regex')}
          >
             <View style={styles.cardIconCircle}>
                <FontAwesome5 name="code" size={20} color="#333" />
             </View>
            <Text style={[styles.cardTitle, {color: '#333', marginTop: 10}]}>Regex Search</Text>
            <Text style={[styles.cardInfo, {color: '#666'}]}>Pattern Matching</Text>
          </TouchableOpacity>

        </View>

        {/* Kolom Kanan */}
        <View style={styles.column}>
          
          {/* Kartu Sedang (BLUE) - Boolean */}
          <TouchableOpacity 
            style={[styles.card, styles.cardBlue]}
            onPress={() => goToSearch('boolean')}
          >
            <View style={styles.cardHeader}>
               <View style={styles.iconPillBlue}><Text style={styles.pillText}>Light</Text></View>
            </View>
            <Text style={styles.cardTitle}>Boolean Logic</Text>
            <Text style={styles.cardInfo}>AND, OR, NOT Operation</Text>
             <MaterialCommunityIcons name="set-all" size={40} color="rgba(255,255,255,0.6)" style={{position:'absolute', bottom: 10, right: 10}} />
          </TouchableOpacity>

          {/* Kartu Kecil (PINK) - Clustering / Socials */}
          <TouchableOpacity 
            style={[styles.card, styles.cardPink]}
            onPress={() => goToSearch('clustering')}
          >
             <View style={styles.rowCenter}>
                <MaterialCommunityIcons name="chart-bubble" size={24} color="#fff" />
                <MaterialCommunityIcons name="google-analytics" size={24} color="#fff" style={{marginLeft: 10}} />
             </View>
             <Text style={[styles.cardTitle, {marginTop: 15}]}>Clustering</Text>
             <Text style={styles.cardInfo}>K-Means Algo</Text>
          </TouchableOpacity>

           {/* Kartu Tambahan (PURPLE DARK) - BIM */}
           <TouchableOpacity 
            style={[styles.card, styles.cardDarkPurple]}
            onPress={() => goToSearch('bim')}
          >
            <Text style={styles.cardTitle}>BIM</Text>
            <Text style={styles.cardInfo}>Probabilistic</Text>
          </TouchableOpacity>

        </View>
      </View>
      
      <View style={{height: 100}} />
    </ScrollView>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE', paddingHorizontal: 20 },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 60, marginBottom: 25 },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#1E1E2D' },
  date: { fontSize: 14, color: '#A0A0A0', marginTop: 2 },
  profileButton: { padding: 2, borderWidth: 1, borderColor: '#eee', borderRadius: 25 },
  avatar: { width: 45, height: 45, borderRadius: 22.5 },

  // Hero Card (Purple)
  heroCard: { 
    backgroundColor: '#9D9BFF', 
    borderRadius: 30, 
    padding: 25, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 25,
    shadowColor: '#9D9BFF', shadowOffset: {width: 0, height: 10}, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8
  },
  heroContent: { flex: 1 },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 20 },
  avatarGroup: { flexDirection: 'row', alignItems: 'center' },
  miniAvatar: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: -10, borderWidth: 2, borderColor: '#9D9BFF' },
  miniAvatarText: { fontWeight: 'bold', fontSize: 12, color: '#fff' },
  heroActionText: { marginLeft: 20, color: '#fff', fontWeight: '600', fontSize: 12 },
  heroIllustration: { justifyContent: 'center', alignItems: 'center', marginLeft: 10 },

  // Strip (Calendar Style)
  stripContainer: { marginBottom: 25, maxHeight: 60 },
  stripItem: { 
    paddingVertical: 15, paddingHorizontal: 20, borderRadius: 20, backgroundColor: '#fff', marginRight: 10,
    borderWidth: 1, borderColor: '#F0F0F0', justifyContent: 'center' 
  },
  stripItemActive: { backgroundColor: '#1E1E2D', borderColor: '#1E1E2D' },
  stripText: { color: '#A0A0A0', fontWeight: '600' },
  stripTextActive: { color: '#fff' },

  // Grid Section
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E1E2D', marginBottom: 15 },
  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { width: (width - 55) / 2, gap: 15 },

  // Generic Card Styles
  card: { borderRadius: 25, padding: 20, justifyContent: 'space-between' },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  cardInfo: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 10 },
  cardHeader: { flexDirection: 'row', marginBottom: 15 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  smallAvatar: { width: 24, height: 24, borderRadius: 12, marginRight: 8 },
  authorText: { fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: '600' },
  
  // Specific Card Colors & Variations
  cardOrange: { backgroundColor: '#FFC56F', height: 220 },
  iconPillOrange: { backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  
  cardBlue: { backgroundColor: '#AECBFA', height: 180 },
  iconPillBlue: { backgroundColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  
  cardPink: { backgroundColor: '#FA96E8', height: 140, justifyContent: 'center' },
  
  cardWhite: { backgroundColor: '#fff', height: 160, borderWidth: 1, borderColor: '#f0f0f0' },
  cardIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },

  cardDarkPurple: { backgroundColor: '#6C63FF', height: 120 },

  pillText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  rowCenter: { flexDirection: 'row' },
});