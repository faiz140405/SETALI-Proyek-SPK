// Location: app/(tabs)/index.tsx
import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native'; // <--- IMPORT INI

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const animation = useRef(null);

  const goToSearch = (methodId: string) => {
    router.push({ pathname: "/search/[method]", params: { method: methodId } });
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar style="dark" />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* --- 1. HEADER SECTION --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Faiz!</Text>
            <Text style={styles.date}>
                {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
            </Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
             <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=Faiz+Nizar&background=6C63FF&color=fff&size=128' }} 
              style={styles.avatar} 
             />
          </TouchableOpacity>
        </View>

        {/* --- 2. HERO CARD (ANIMATED) --- */}
        <TouchableOpacity 
          style={styles.heroCard} 
          activeOpacity={0.9}
          onPress={() => router.push('/(tabs)/features')}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>AI SEARCH</Text>
            </View>
            <Text style={styles.heroTitle}>SETALI Mobile</Text>
            <Text style={styles.heroSubtitle}>Sistem Temu Kembali Informasi Cerdas.</Text>
            
            <View style={styles.miniBtn}>
                <Text style={styles.miniBtnText}>Mulai Eksplorasi</Text>
                <Ionicons name="arrow-forward" size={16} color="#6C63FF" />
            </View>
          </View>
          
          {/* --- LOTTIE ANIMATION (ROBOT) --- */}
          <View style={styles.lottieContainer}>
              <LottieView
                autoPlay
                ref={animation}
                style={{
                  width: 160,
                  height: 160,
                }}
                // Pastikan path ini sesuai tempat Anda menyimpan file JSON tadi
                source={require('../../assets/lottie/robot.json')}
              />
          </View>
        </TouchableOpacity>

        {/* --- 3. SECTION TITLE --- */}
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Metode Populer</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/features')}>
                <Text style={styles.seeAll}>Lihat Semua</Text>
            </TouchableOpacity>
        </View>
        
        {/* --- 4. MASONRY GRID (SAMA SEPERTI SEBELUMNYA) --- */}
        <View style={styles.gridContainer}>
          {/* KOLOM KIRI */}
          <View style={styles.column}>
            <TouchableOpacity 
              style={[styles.card, styles.cardOrange]} 
              onPress={() => goToSearch('vsm')}
              activeOpacity={0.8}
            >
              <View style={styles.cardTop}>
                 <View style={styles.iconCircleWhite}><MaterialCommunityIcons name="vector-combine" size={24} color="#FF9F43" /></View>
                 <View style={styles.badge}><Text style={styles.badgeText}>#1 Popular</Text></View>
              </View>
              <View>
                  <Text style={styles.cardTitleWhite}>Vector Space Model</Text>
                  <Text style={styles.cardDescWhite}>Ranking berbasis Cosine Similarity.</Text>
              </View>
            </TouchableOpacity>

             <TouchableOpacity 
              style={[styles.card, styles.cardWhite]} 
              onPress={() => goToSearch('regex')}
              activeOpacity={0.8}
            >
               <View style={[styles.iconCircle, {backgroundColor: '#FFEBEE'}]}>
                  <MaterialCommunityIcons name="code-braces" size={24} color="#FF6B6B" />
               </View>
              <Text style={styles.cardTitleDark}>Regex Search</Text>
              <Text style={styles.cardDescDark}>Pencarian pola teks presisi.</Text>
            </TouchableOpacity>
          </View>

          {/* KOLOM KANAN */}
          <View style={styles.column}>
            <TouchableOpacity 
              style={[styles.card, styles.cardBlue]}
              onPress={() => goToSearch('boolean')}
              activeOpacity={0.8}
            >
              <View style={styles.cardTop}>
                 <View style={styles.iconCircleWhite}><MaterialCommunityIcons name="function-variant" size={24} color="#54A0FF" /></View>
              </View>
              <Text style={styles.cardTitleWhite}>Boolean</Text>
              <Text style={styles.cardDescWhite}>Logika AND/OR.</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.card, styles.cardPink]}
              onPress={() => goToSearch('clustering')}
              activeOpacity={0.8}
            >
               <View style={styles.cardTop}>
                  <View style={styles.iconCircleWhite}><MaterialCommunityIcons name="chart-bubble" size={24} color="#FD79A8" /></View>
               </View>
               <View>
                   <Text style={styles.cardTitleWhite}>Clustering</Text>
                   <Text style={styles.cardDescWhite}>Pengelompokan dokumen (K-Means).</Text>
               </View>
               <MaterialCommunityIcons name="chart-scatter-plot" size={50} color="rgba(255,255,255,0.2)" style={{position:'absolute', right:-10, bottom:-10}} />
            </TouchableOpacity>

             <TouchableOpacity 
              style={[styles.card, styles.cardPurple]}
              onPress={() => goToSearch('bim')}
              activeOpacity={0.8}
            >
              <View style={{flexDirection:'row', alignItems:'center'}}>
                  <MaterialCommunityIcons name="calculator" size={20} color="#fff" />
                  <Text style={[styles.cardTitleWhite, {marginLeft:8, fontSize:14}]}>BIM (Probabilistic)</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={{height: 100}} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity 
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/add-document')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#F8F9FE' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  greeting: { fontSize: 26, fontWeight: '800', color: '#2D3436' },
  date: { fontSize: 14, color: '#636E72', fontWeight: '500', marginTop: 2 },
  profileButton: { padding: 3, backgroundColor: '#fff', borderRadius: 25, elevation: 2 },
  avatar: { width: 45, height: 45, borderRadius: 22.5 },

  // HERO CARD STYLES (UPDATED)
  heroCard: { 
    backgroundColor: '#6C63FF', 
    borderRadius: 24, 
    padding: 24, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 30,
    shadowColor: '#6C63FF', 
    shadowOffset: {width: 0, height: 8}, 
    shadowOpacity: 0.3, 
    shadowRadius: 15, 
    elevation: 10,
    overflow: 'hidden', // Tetap hidden agar rapi
    minHeight: 180, // Tambahkan tinggi minimum agar tidak gepeng
  },
  heroContent: { 
    flex: 1, 
    paddingRight: 10, 
    zIndex: 2,
    maxWidth: '60%', // Batasi lebar teks hanya 60%
    justifyContent: 'center' 
  },
  heroTag: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 10 },
  heroTagText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  heroTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  heroSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.9)', marginBottom: 15, lineHeight: 18 },
  miniBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignSelf: 'flex-start' },
  miniBtnText: { color: '#6C63FF', fontWeight: 'bold', fontSize: 11, marginRight: 5 },
  
  // CONTAINER LOTTIE
  lottieContainer: {
    position: 'absolute',
    right: 0, // Tempel ke kanan (jangan minus)
    bottom: 0, // Tempel ke bawah (jangan minus)
    top: 0, // Tambahkan top agar dia centering secara vertikal juga
    width: '45%', // Lebar area robot 45% dari kartu
    justifyContent: 'center', // Tengah vertikal
    alignItems: 'center', // Tengah horizontal
    zIndex: 1,
    // backgroundColor: 'rgba(255,255,255,0.1)' // (Opsional) Uncomment untuk debug area robot
},
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#2D3436' },
  seeAll: { fontSize: 14, color: '#6C63FF', fontWeight: '600' },

  gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  column: { width: (width - 50) / 2, gap: 15 },

  card: { borderRadius: 20, padding: 18, justifyContent: 'space-between', shadowColor: "#000", shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 15 },
  cardOrange: { backgroundColor: '#FF9F43', height: 200 },
  cardWhite: { backgroundColor: '#FFF', height: 150 },
  cardBlue: { backgroundColor: '#54A0FF', height: 150 },
  cardPink: { backgroundColor: '#FD79A8', height: 200 },
  cardPurple: { backgroundColor: '#A29BFE', paddingVertical: 15 },

  cardTitleWhite: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  cardDescWhite: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  cardTitleDark: { fontSize: 16, fontWeight: 'bold', color: '#2D3436', marginTop: 10, marginBottom: 4 },
  cardDescDark: { fontSize: 12, color: '#636E72' },

  iconCircle: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  iconCircleWhite: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  badge: { backgroundColor: 'rgba(0,0,0,0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  fab: {
    position: 'absolute',
    bottom: 95, 
    right: 25,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: "#6C63FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  }
});