// Location: app/add-document.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';

// GANTI DENGAN IP LAPTOP ANDA
const API_URL = 'http://192.168.100.9:5000'; 

export default function AddDocumentScreen() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      Alert.alert("Eits!", "Isi dokumen tidak boleh kosong ya.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/documents`, {
        text: text,
        category: category || 'Umum'
      });

      Alert.alert("Sukses", "Dokumen berhasil disimpan ke server!", [
        { text: "OK", onPress: () => router.back() } // Kembali ke Home setelah sukses
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Gagal", "Tidak bisa terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar style="dark" />
        <Stack.Screen options={{ 
            title: 'Tambah Data', 
            headerShadowVisible: false,
            headerStyle: { backgroundColor: '#F8F9FE' }
        }} />

        <View style={styles.header}>
            <Text style={styles.title}>Input Dokumen Baru</Text>
            <Text style={styles.subtitle}>Data ini akan langsung bisa dicari.</Text>
        </View>

        {/* Form Input */}
        <View style={styles.formCard}>
            
            {/* Input Kategori */}
            <Text style={styles.label}>Kategori (Opsional)</Text>
            <View style={styles.inputWrapper}>
                <FontAwesome5 name="tag" size={16} color="#A0A0A0" style={{marginRight: 10}} />
                <TextInput 
                    style={styles.input}
                    placeholder="Contoh: Kuliner, Berita, Sains..."
                    value={category}
                    onChangeText={setCategory}
                />
            </View>

            {/* Input Isi Dokumen */}
            <Text style={styles.label}>Isi Dokumen / Teks</Text>
            <View style={[styles.inputWrapper, {alignItems: 'flex-start', height: 150}]}>
                <Ionicons name="document-text-outline" size={20} color="#A0A0A0" style={{marginRight: 10, marginTop: 12}} />
                <TextInput 
                    style={[styles.input, {height: 140, textAlignVertical: 'top', paddingTop: 10}]}
                    placeholder="Ketik kalimat atau paragraf dokumen di sini..."
                    multiline
                    value={text}
                    onChangeText={setText}
                />
            </View>

        </View>

        {/* Tombol Simpan */}
        <TouchableOpacity 
            style={[styles.saveButton, loading && {backgroundColor: '#B0B0C0'}]}
            onPress={handleSubmit}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <>
                    <Ionicons name="save-outline" size={22} color="#fff" style={{marginRight: 8}} />
                    <Text style={styles.saveText}>Simpan Dokumen</Text>
                </>
            )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#F8F9FE', padding: 25 },
  header: { marginBottom: 30 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1E1E2D' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 5 },
  
  formCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 25,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3
  },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 10 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FE',
    borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#eee'
  },
  input: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#333' },

  saveButton: {
    backgroundColor: '#6C63FF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: 15,
    shadowColor: "#6C63FF", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
  },
  saveText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});