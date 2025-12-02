from flask import Flask, request, jsonify
from flask_cors import CORS
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from data import documents
import speech_recognition as sr
from pydub import AudioSegment
import os
import uuid
import time

ffmpeg_path = r"D:\ffmpeg-2025-11-27-git-61b034a47c-essentials_build\bin\ffmpeg.exe"
ffprobe_path = r"D:\ffmpeg-2025-11-27-git-61b034a47c-essentials_build\bin\ffprobe.exe"

app = Flask(__name__)
CORS(app) # Agar bisa diakses dari HP/Emulator

# --- HELPER FUNCTION: PREPROCESSING ---
def preprocess(text):
    # Di sini Anda bisa tambah stemming/stopword removal (Sastrawi/NLTK)
    return text.lower()

# 1. REGEX SEARCH
@app.route('/search/regex', methods=['POST'])
def search_regex():
    query = request.json.get('query')
    results = []
    try:
        pattern = re.compile(query, re.IGNORECASE)
        for doc in documents:
            if pattern.search(doc['text']):
                results.append(doc)
    except re.error:
        return jsonify({"error": "Invalid Regex Pattern"}), 400
    return jsonify(results)

@app.route('/voice-search', methods=['POST'])
def voice_search_handler():
    print("\n--- [DEBUG] START VOICE SEARCH ---")

    # Cek apakah konfigurasi path benar
    if not os.path.exists(FFMPEG_PATH):
        print(f"[FATAL ERROR] FFmpeg tidak ditemukan di: {FFMPEG_PATH}")
        return jsonify({"error": "Konfigurasi Server Salah: FFmpeg hilang"}), 500

    if 'audio' not in request.files:
        return jsonify({"error": "No audio file"}), 400
    
    audio_file = request.files['audio']
    filename = f"rec_{uuid.uuid4().hex[:8]}"
    input_path = os.path.abspath(f"{filename}.m4a")
    wav_path = os.path.abspath(f"{filename}.wav")

    try:
        # Simpan File Asli
        audio_file.save(input_path)
        
        # Cek ukuran file
        size = os.path.getsize(input_path)
        if size < 100:
            return jsonify({"error": "Rekaman kosong/corrupt"}), 400

        # Konversi ke WAV
        sound = AudioSegment.from_file(input_path)
        sound.export(wav_path, format="wav")

        # Speech to Text
        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_path) as source:
            recognizer.adjust_for_ambient_noise(source) 
            audio_data = recognizer.record(source)
            # Kenali bahasa Indonesia
            text = recognizer.recognize_google(audio_data, language='id-ID')
            print(f"[SUCCESS] Teks: {text}")

        # Bersihkan File
        safe_delete(input_path)
        safe_delete(wav_path)

        return jsonify({"text": text})

    except sr.UnknownValueError:
        safe_delete(input_path)
        safe_delete(wav_path)
        return jsonify({"error": "Suara tidak jelas, coba lagi."}), 400
        
    except Exception as e:
        print(f"[CRASH ERROR] {str(e)}")
        safe_delete(input_path)
        safe_delete(wav_path)
        return jsonify({"error": str(e)}), 500

def safe_delete(path):
    try:
        time.sleep(0.1) # Beri jeda agar file dilepas Windows
        if os.path.exists(path):
            os.remove(path)
    except Exception as e:
        print(f"[WARNING] Gagal hapus {path}: {e}")

# 2. BOOLEAN RETRIEVAL (Sederhana AND/OR)
@app.route('/search/boolean', methods=['POST'])
def search_boolean():
    query = request.json.get('query').lower().split()
    results = []
    for doc in documents:
        text = doc['text'].lower()
        # Ganti 'all' menjadi 'any' agar jadi logika OR
        if any(word in text for word in query): 
            results.append(doc)
    return jsonify(results)

# 3. VECTOR SPACE MODEL (VSM) - Cosine Similarity
# 
@app.route('/search/vsm', methods=['POST'])
def search_vsm():
    query = request.json.get('query')
    print(f"User mencari: {query}")
    
    # Gabungkan query dengan dokumen untuk vectorisasi
    corpus = [d['text'] for d in documents]
    corpus.append(query)
    
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)
    
    # Hitung Cosine Similarity antara Query (elemen terakhir) dan semua Dokumen
    cosine_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])
    
    # Urutkan berdasarkan skor tertinggi
    scores = cosine_sim[0]
    ranked_indices = np.argsort(scores)[::-1]
    
    results = []
    for idx in ranked_indices:
        if scores[idx] > 0: # Hanya ambil yang relevan
            doc_data = documents[idx].copy()
            doc_data['score'] = float(scores[idx]) # Tambah skor untuk ditampilkan
            results.append(doc_data)
            
    return jsonify(results)

# 4. RELEVANCE FEEDBACK (Rocchio Algorithm Simplified)
# Konsep: User mencari -> User memilih dokumen relevan -> Query diperbaiki
@app.route('/search/feedback', methods=['POST'])
def relevance_feedback():
    original_query = request.json.get('query')
    relevant_doc_ids = request.json.get('relevant_ids') # ID dokumen yang dipilih user
    
    # Logika Rocchio: Query Baru = Query Lama + (Alpha * Rata2 Vektor Relevan)
    # Untuk simplifikasi tugas: Kita append teks dokumen relevan ke query lama
    new_query = original_query
    for doc in documents:
        if doc['id'] in relevant_doc_ids:
            new_query += " " + doc['text']
            
    # Lakukan pencarian VSM lagi dengan new_query
    # (Panggil logika VSM di sini)
    return jsonify({"new_query": new_query, "message": "Query expanded, re-run VSM"})

# 5. DOCUMENT CLUSTERING

from sklearn.cluster import KMeans
@app.route('/clustering', methods=['GET'])
def clustering():
    corpus = [d['text'] for d in documents]
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(corpus)
    
    # Cluster menjadi 2 kelompok (contoh)
    kmeans = KMeans(n_clusters=2, random_state=0).fit(X)
    
    clustered_docs = []
    for i, label in enumerate(kmeans.labels_):
        doc = documents[i].copy()
        doc['cluster'] = int(label)
        clustered_docs.append(doc)
        
    return jsonify(clustered_docs)

# --- UPDATE LENGKAP FUNGSI ANALYZE (app.py) ---

@app.route('/analyze', methods=['POST'])
def analyze_result():
    data = request.json
    # Pastikan method dibaca string kecil & tanpa spasi agar cocok dengan if/else
    method = str(data.get('method', '')).lower().strip()
    query = data.get('query', '')
    doc_id = data.get('doc_id')
    
    # Cari dokumen target
    target_doc = next((d for d in documents if d['id'] == int(doc_id)), None)
    if not target_doc:
        return jsonify({"error": "Dokumen tidak ditemukan"}), 404

    analysis = {
        "doc_text": target_doc['text'],
        "method": method,
        "steps": []
    }

    try:
        # --- 1. REGEX ---
        if method == 'regex':
            import re
            analysis['steps'].append(f"Pola Regex: '{query}'")
            try:
                pattern = re.compile(query, re.IGNORECASE)
                match = pattern.search(target_doc['text'])
                if match:
                    analysis['steps'].append(f"Status: MATCH ditemukan di posisi {match.span()}.")
                    analysis['steps'].append(f"Cuplikan: \"...{target_doc['text'][match.start():match.end()]}...\"")
                else:
                    analysis['steps'].append("Status: Tidak ada pola yang cocok (namun dokumen ini terpilih mungkin karena kesalahan logika search).")
            except Exception as e:
                analysis['steps'].append(f"Error Pola Regex: {str(e)}")

        # --- 2. BOOLEAN ---
        elif method == 'boolean':
            terms = query.lower().split()
            doc_lower = target_doc['text'].lower()
            analysis['steps'].append(f"Memecah Query: {terms}")
            found_terms = []
            for term in terms:
                status = "ADA" if term in doc_lower else "TIDAK ADA"
                analysis['steps'].append(f"Cek kata '{term}': {status}")
                if term in doc_lower: found_terms.append(term)
            
            if found_terms:
                analysis['steps'].append("Kesimpulan: Dokumen relevan karena mengandung salah satu kata kunci (Logika OR).")
            else:
                analysis['steps'].append("Kesimpulan: Tidak ada kata kunci yang cocok.")

        # --- 3. VECTOR SPACE MODEL (VSM) ---
        elif method == 'vsm':
            q_tokens = query.lower().split()
            d_tokens = target_doc['text'].lower().split()
            
            analysis['steps'].append(f"Tokenisasi Dokumen: {d_tokens[:5]}... (total {len(d_tokens)} kata)")
            analysis['steps'].append(f"Tokenisasi Query: {q_tokens}")
            
            # Hitung irisan kata
            intersection = set(q_tokens).intersection(set(d_tokens))
            analysis['steps'].append(f"Kata yang sama (Overlap): {list(intersection)}")
            
            if intersection:
                analysis['steps'].append("Perhitungan Bobot: Menghitung TF-IDF untuk kata-kata tersebut.")
                analysis['steps'].append("Cosine Similarity: Menghitung sudut antara vektor query dan dokumen.")
            else:
                analysis['steps'].append("Skor 0 karena tidak ada kata yang beririsan.")

        # --- 4. CLUSTERING ---
        elif method == 'clustering':
            cluster = target_doc.get('cluster', '?')
            analysis['steps'].append("Representasi: Dokumen diubah menjadi vektor numerik.")
            analysis['steps'].append(f"Pengelompokan: Algoritma K-Means menempatkan dokumen ini di Cluster {cluster}.")
            analysis['steps'].append("Alasan: Jarak vektor dokumen ini paling dekat dengan titik pusat (Centroid) Cluster tersebut.")

        # --- 5. RELEVANCE FEEDBACK ---
        elif method == 'feedback':
            # Feedback biasanya menggunakan VSM di baliknya
            analysis['steps'].append("Input Awal: User memasukkan query original.")
            analysis['steps'].append("Ekspansi: Sistem mendeteksi dokumen ini sebagai relevan.")
            analysis['steps'].append("Query Baru: Query original ditambahkan kata-kata penting dari dokumen ini (Rocchio Algorithm).")
            analysis['steps'].append("Pencarian Ulang: Dilakukan pencarian VSM ronde ke-2 dengan query baru.")

        # --- 6. PROBABILISTIC (BIM) ---
        elif method == 'bim':
            q_terms = query.lower().split()
            doc_terms = set(target_doc['text'].lower().split())
            
            analysis['steps'].append(f"Binary Representation: Dokumen dianggap himpunan kata biner (Ada/Tidak).")
            score_steps = []
            total_matches = 0
            
            for term in q_terms:
                if term in doc_terms:
                    score_steps.append(f"   - Kata '{term}': Muncul (+log odds)")
                    total_matches += 1
                else:
                    score_steps.append(f"   - Kata '{term}': Tidak Muncul")
            
            analysis['steps'].extend(score_steps)
            analysis['steps'].append(f"Total Matching Terms: {total_matches}")
            analysis['steps'].append("Skor Probabilitas: Dihitung dari penjumlahan log-odds ratio kata yang muncul.")

        else:
            # Jika masih masuk sini, berarti nama method typo atau tidak dikenali
            analysis['steps'].append(f"Metode '{method}' tidak dikenali oleh sistem analisis.")

    except Exception as e:
        analysis['steps'].append(f"Terjadi kesalahan sistem: {str(e)}")

    return jsonify(analysis)

@app.route('/documents', methods=['POST'])
def add_document():
    data = request.json
    
    # Validasi sederhana
    if not data or 'text' not in data:
        return jsonify({"error": "Data teks tidak boleh kosong"}), 400

    # Buat ID baru (ID terakhir + 1)
    new_id = len(documents) + 1
    
    new_doc = {
        "id": new_id,
        "text": data.get('text'),
        "category": data.get('category', 'Umum') # Default kategori 'Umum'
    }
    
    # Masukkan ke list dokumen sementara (di memori)
    documents.append(new_doc)
    
    return jsonify({
        "message": "Dokumen berhasil ditambahkan!", 
        "total_docs": len(documents),
        "doc": new_doc
    })

# 6. PROBABILISTIC (Binary Independence Model - BIM)
@app.route('/search/bim', methods=['POST'])
def search_bim():
    # BIM menghitung probabilitas P(R|D) / P(NR|D)
    # Ini memerlukan implementasi rumus log-odds ratio.
    # Rumus dasar BIM: $$ \sum \log \frac{p_i (1-s_i)}{s_i (1-p_i)} $$
    # Implementasi sederhana: Menghitung bobot term berdasarkan keberadaannya saja (biner)
    
    query = request.json.get('query').split()
    results = []
    
    for doc in documents:
        score = 0
        doc_tokens = set(doc['text'].lower().split())
        for term in query:
            if term in doc_tokens:
                # Dalam BIM murni, bobot ini dihitung dari statistik korpus
                # Untuk tugas, kita bisa asumsikan bobot tetap atau berdasarkan IDF sederhana
                score += 1 
        
        if score > 0:
            doc_res = doc.copy()
            doc_res['score'] = score
            results.append(doc_res)
            
    # Sort by score
    results.sort(key=lambda x: x['score'], reverse=True)
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)