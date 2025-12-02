// Location: app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        
        tabBarStyle: {
          position: 'absolute',
          left: 20,
          right: 20,
          elevation: 5,
          backgroundColor: '#ffffff',
          borderRadius: 20,
          height: 70,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
        },
      }}
    >
      {/* TAB 1: HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="home" label="Home" Lib={FontAwesome5} />
          ),
        }}
      />

      {/* TAB 2: METODE */}
      <Tabs.Screen
        name="features"
        options={{
          title: 'Metode',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="manage-search" label="Metode" Lib={MaterialIcons} />
          ),
        }}
      />

      {/* TAB 3: PANDUAN (BARU) */}
      <Tabs.Screen
        name="guide"
        options={{
          title: 'tutor',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="book-open" label="tutor" Lib={FontAwesome5} />
          ),
        }}
      />
    </Tabs>
  );
}

// Komponen Kecil agar kodenya rapi
function TabIcon({ focused, icon, label, Lib }) {
    return (
        <View style={styles.tabContainer}>
            <Lib 
              name={icon} 
              size={22} 
              color={focused ? '#6C63FF' : '#B0B0C0'} 
            />
            <Text style={[
              styles.label, 
              { color: focused ? '#6C63FF' : '#B0B0C0', fontWeight: focused ? 'bold' : 'normal' }
            ]}>
              {label}
            </Text>
            {focused && <View style={styles.activeDot} />}
        </View>
    )
}

const styles = StyleSheet.create({
  tabContainer: { alignItems: 'center', justifyContent: 'center', top: 10 },
  label: { fontSize: 10, marginTop: 4 },
  activeDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#6C63FF', marginTop: 4 }
});