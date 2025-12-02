from flask import Flask, request, jsonify
from flask_cors import CORS
import speech_recognition as sr
from pydub import AudioSegment
import os
import uuid
import time
import re
import numpy as np

# Machine Learning & NLP Libraries
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.cluster import KMeans

# Library Sastrawi (Bahasa Indonesia)
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
from Sastrawi.StopWordRemover.StopWordRemoverFactory import StopWordRemoverFactory

# Import Data Dummy
from data import documents 

app = Flask(__name__)
CORS(app)

# ==========================================
# 1. KONFIGURASI FFMPEG (WAJIB DI ATAS)
# ==========================================
# Definisikan variabel path dulu
FFMPEG_PATH = r"C:\ffmpeg\bin\ffmpeg.exe"
FFPROBE_PATH = r"C:\ffmpeg\bin\ffprobe.exe"

# Baru masukkan ke Pydub
AudioSegment.converter = FFMPEG_PATH
AudioSegment.ffprobe = FFPROBE_PATH

# ==========================================
# 2. KONFIGURASI SASTRAWI
# ==========================================
stemmer_factory = StemmerFactory()
stemmer = stemmer_factory.create_stemmer()

stopword_factory = StopWordRemoverFactory()
stopword_remover = stopword_factory.create_stop_word_remover()

def preprocess_text(text, use_stemming=False, use_stopword=False):
    if not text: return ""
    processed = text.lower()
    if use_stopword:
        processed = stopword_remover.remove(processed)
    if use_stemming:
        processed = stemmer.stem(processed)
    return processed

def safe_delete(path):
    try:
        time.sleep(0.1) 
        if os.path.exists(path):
            os.remove(path)
    except Exception as e:
        print(f"[WARNING] Gagal hapus {path}: {e}")

# ==========================================
# 3. VOICE SEARCH HANDLER
# ==========================================
@app.route('/voice-search', methods=['POST'])
def voice_search_handler():
    print("\n--- [DEBUG] START VOICE SEARCH ---")

    # Cek Konfigurasi FFmpeg
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
        audio_file.save(input_path)
        
        size = os.path.getsize(input_path)
        if size < 100:
            return jsonify({"error": "Rekaman kosong/corrupt"}), 400

        sound = AudioSegment.from_file(input_path)
        sound.export(wav_path, format="wav")

        recognizer = sr.Recognizer()
        with sr.AudioFile(wav_path) as source:
            recognizer.adjust_for_ambient_noise(source) 
            audio_data = recognizer.record(source)
            text = recognizer.recognize_google(audio_data, language='id-ID')
            print(f"[SUCCESS] Teks: {text}")

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

# ==========================================
# 4. FITUR PENCARIAN
# ==========================================

@app.route('/search/regex', methods=['POST'])
def search_regex():
    query = request.json.get('query', '')
    results = []
    try:
        pattern = re.compile(query, re.IGNORECASE)
        for doc in documents:
            if pattern.search(doc['text']):
                results.append(doc)
    except re.error:
        return jsonify({"error": "Invalid Regex Pattern"}), 400
    return jsonify(results)

@app.route('/search/boolean', methods=['POST'])
def search_boolean():
    query = request.json.get('query', '').lower().split()
    results = []
    for doc in documents:
        text = doc['text'].lower()
        if any(word in text for word in query): 
            results.append(doc)
    return jsonify(results)

@app.route('/search/vsm', methods=['POST'])
def search_vsm():
    data = request.json
    query = data.get('query', '')
    use_stemming = data.get('use_stemming', False)
    use_stopword = data.get('use_stopword', False)
    
    clean_query = preprocess_text(query, use_stemming, use_stopword)
    clean_corpus = []
    for doc in documents:
        clean_corpus.append(preprocess_text(doc['text'], use_stemming, use_stopword))
        
    full_corpus = clean_corpus + [clean_query]
    
    try:
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(full_corpus)
        cosine_sim = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])
        scores = cosine_sim[0]
        ranked_indices = np.argsort(scores)[::-1]
        
        results = []
        for idx in ranked_indices:
            if scores[idx] > 0:
                doc_data = documents[idx].copy()
                doc_data['score'] = float(scores[idx])
                doc_data['processed_text'] = clean_corpus[idx]
                results.append(doc_data)
        return jsonify(results)
    except ValueError:
        return jsonify([])

@app.route('/search/feedback', methods=['POST'])
def relevance_feedback():
    return search_vsm()

@app.route('/clustering', methods=['GET'])
def clustering():
    if len(documents) < 2: return jsonify(documents)
    corpus = [d['text'] for d in documents]
    vectorizer = TfidfVectorizer()
    X = vectorizer.fit_transform(corpus)
    true_k = 2 if len(documents) >= 2 else 1
    kmeans = KMeans(n_clusters=true_k, random_state=0, n_init=10).fit(X)
    clustered_docs = []
    for i, label in enumerate(kmeans.labels_):
        doc = documents[i].copy()
        doc['cluster'] = int(label)
        clustered_docs.append(doc)
    return jsonify(clustered_docs)

@app.route('/search/bim', methods=['POST'])
def search_bim():
    query = request.json.get('query', '').split()
    results = []
    for doc in documents:
        score = 0
        doc_tokens = set(doc['text'].lower().split())
        for term in query:
            if term in doc_tokens: score += 1 
        if score > 0:
            doc_res = doc.copy()
            doc_res['score'] = score
            results.append(doc_res)
    results.sort(key=lambda x: x['score'], reverse=True)
    return jsonify(results)

# ==========================================
# 5. FITUR LAINNYA
# ==========================================

@app.route('/documents', methods=['POST'])
def add_document():
    data = request.json
    if not data or 'text' not in data:
        return jsonify({"error": "Data teks tidak boleh kosong"}), 400
    new_id = len(documents) + 1
    new_doc = { "id": new_id, "text": data.get('text'), "category": data.get('category', 'Umum') }
    documents.append(new_doc)
    return jsonify({"message": "Dokumen berhasil ditambahkan!", "doc": new_doc})

@app.route('/analyze', methods=['POST'])
def analyze_result():
    data = request.json
    method = str(data.get('method', '')).lower().strip()
    query = data.get('query', '')
    doc_id = data.get('doc_id')
    
    target_doc = next((d for d in documents if d['id'] == int(doc_id)), None)
    if not target_doc:
        return jsonify({"error": "Dokumen tidak ditemukan"}), 404

    analysis = {
        "doc_text": target_doc['text'],
        "method": method,
        "steps": [],
        "chart_data": {} # Default kosong
    }

    # --- [BARU] LOGIKA CHART UNTUK SEMUA METODE ---
    # Kita hitung frekuensi kata kunci query di dalam dokumen ini
    # terlepas dari metode apa yang dipakai.
    if query:
        # Tokenisasi sederhana
        q_tokens = query.lower().split()
        d_tokens = target_doc['text'].lower().split()
        
        chart_data = {}
        found_any = False

        for term in set(q_tokens): # Gunakan set agar kata duplikat di query dihitung sekali
            # Hitung berapa kali kata query muncul di dokumen
            count = d_tokens.count(term)
            if count > 0:
                chart_data[term] = count
                found_any = True
        
        # Jika tidak ada kata yang cocok, beri info default (Opsional)
        if not found_any:
            chart_data = {"(No Match)": 0}
            
        analysis['chart_data'] = chart_data
    # -----------------------------------------------------

    try:
        if method == 'regex':
            import re
            analysis['steps'].append(f"1. Pola Regex: '{query}'")
            try:
                pattern = re.compile(query, re.IGNORECASE)
                match = pattern.search(target_doc['text'])
                if match:
                    analysis['steps'].append(f"2. Status: MATCH ditemukan di posisi {match.span()}.")
                    analysis['steps'].append(f"3. Cuplikan: \"...{target_doc['text'][match.start():match.end()]}...\"")
                else:
                    analysis['steps'].append("2. Status: Tidak ada pola yang cocok.")
            except Exception as e:
                analysis['steps'].append(f"Error Regex: {str(e)}")

        elif method == 'vsm':
            # Logika VSM (Chart sudah dihitung di atas secara global)
            q_tokens = query.lower().split()
            d_tokens = target_doc['text'].lower().split()
            analysis['steps'].append(f"1. Tokenisasi Dokumen: {d_tokens[:5]}...")
            analysis['steps'].append(f"2. Tokenisasi Query: {q_tokens}")
            intersection = set(q_tokens).intersection(set(d_tokens))
            analysis['steps'].append(f"3. Overlap Kata: {list(intersection)}")
            analysis['steps'].append("4. Perhitungan: TF-IDF x Cosine Similarity.")

        elif method == 'boolean':
             analysis['steps'].append(f"1. Query: {query}")
             analysis['steps'].append("2. Logika: OR (Mencari salah satu kata).")
             analysis['steps'].append("3. Hasil: Dokumen terpilih karena mengandung kata kunci.")
             
        elif method == 'clustering':
             cluster = target_doc.get('cluster', '?')
             analysis['steps'].append(f"1. Dokumen masuk ke Cluster {cluster}")
             analysis['steps'].append("2. Metode: K-Means Clustering.")

        elif method == 'bim':
             analysis['steps'].append("1. Model Probabilistik Biner.")
             analysis['steps'].append(f"2. Query Terms: {query}")
             analysis['steps'].append("3. Score dihitung berdasarkan kemunculan kata.")

        else:
             analysis['steps'].append(f"Analisis standar untuk {method}.")

    except Exception as e:
        analysis['steps'].append(f"Error analisis: {str(e)}")

    return jsonify(analysis)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)