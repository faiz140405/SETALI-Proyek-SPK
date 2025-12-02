// Location: app/(tabs)/features.tsx
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function FeaturesScreen() {
  const router = useRouter();

  const methods = [
    { 
      id: 'regex', 
      title: 'Regex Search', 
      desc: 'Pencarian pola teks presisi (e.g., email, tanggal).', 
      icon: 'code-braces', 
      color: '#FF6B6B', 
      bg: '#FFECEC', 
      iconLib: 'MaterialCommunityIcons' 
    },
    { 
      id: 'vsm', 
      title: 'Vector Space Model', 
      desc: 'Ranking dokumen berdasarkan Cosine Similarity.', 
      icon: 'vector-combine', 
      color: '#E8912A', 
      bg: '#FFF4E5',
      iconLib: 'MaterialCommunityIcons' 
    },
    { 
      id: 'boolean', 
      title: 'Boolean Retrieval', 
      desc: 'Pencarian eksak dengan logika AND/OR.', 
      icon: 'function-variant', 
      color: '#45B7D1', 
      bg: '#E0F7FA',
      iconLib: 'MaterialCommunityIcons' 
    },
    { 
      id: 'feedback', 
      title: 'Relevance Feedback', 
      desc: 'Sistem memperbaiki query dari masukan user.', 
      icon: 'sync-circle', 
      color: '#FF9F43', 
      bg: '#FFF0D4',
      iconLib: 'Ionicons' 
    },
    { 
      id: 'clustering', 
      title: 'Document Clustering', 
      desc: 'Unsupervised Learning (K-Means).', 
      icon: 'chart-bubble', 
      color: '#FA96E8', 
      bg: '#FCE4EC',
      iconLib: 'MaterialCommunityIcons' 
    },
    { 
      id: 'bim', 
      title: 'Probabilistic (BIM)', 
      desc: 'Estimasi peluang relevansi dokumen.', 
      icon: 'calculator', 
      color: '#6C63FF', 
      bg: '#EDE7F6',
      iconLib: 'MaterialCommunityIcons' 
    },
  ];

  const handlePress = (methodId) => {
    router.push({ pathname: "/search/[method]", params: { method: methodId } });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="dark" />
      
      {/* --- HEADER SECTION --- */}
      <View style={styles.headerContainer}>
        <View>
            <Text style={styles.headerTitle}>Metode IR</Text>
            <Text style={styles.headerSubtitle}>Pilih algoritma untuk simulasi</Text>
        </View>
        <View style={styles.headerIcon}>
            <MaterialCommunityIcons name="cube-scan" size={28} color="#6C63FF" />
        </View>
      </View>

      {/* --- LIST CARD SECTION --- */}
      <View style={styles.listContainer}>
        {methods.map((item) => {
          // Dinamis memilih library icon
          let IconTag = MaterialCommunityIcons;
          if (item.iconLib === 'Ionicons') IconTag = Ionicons;
          if (item.iconLib === 'FontAwesome5') IconTag = FontAwesome5;

          return (
            <TouchableOpacity 
              key={item.id} 
              style={styles.card}
              activeOpacity={0.8} 
              onPress={() => handlePress(item.id)}
            >
              {/* Icon Box */}
              <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                  <IconTag name={item.icon} size={26} color={item.color} />
              </View>

              {/* Text Content */}
              <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc} numberOfLines={2}>{item.desc}</Text>
              </View>

              {/* Arrow Icon */}
              <View style={styles.arrowContainer}>
                 <Ionicons name="chevron-forward" size={20} color="#D1D1D6" />
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
      
      {/* Bottom Spacer */}
      <View style={{height: 40}} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    backgroundColor: '#F8F9FE' 
  },

  // Header Styles
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 30 
  },
  headerTitle: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    color: '#1E1E2D' 
  },
  headerSubtitle: { 
    fontSize: 14, 
    color: '#A0A0A0', 
    marginTop: 5 
  },
  headerIcon: {
    width: 50, height: 50,
    borderRadius: 15,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },

  // List Styles
  listContainer: { gap: 15 },
  
  // Card Styles
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20, 
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#1E1E2D", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.06, 
    shadowRadius: 12, 
    elevation: 3,
    marginBottom: 5
  },
  
  iconBox: {
    width: 55, 
    height: 55, 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginRight: 15
  },
  
  cardContent: { flex: 1 },
  
  cardTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#1E1E2D', 
    marginBottom: 4 
  },
  
  cardDesc: { 
    fontSize: 12, 
    color: '#8A8A8E', 
    lineHeight: 18 
  },
  
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingLeft: 10
  }
});