# 📱 Sistem Temu Kembali (Information Retrieval Mobile App)

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

> **Project Tugas Kuliah: Sistem Temu Kembali** > Sebuah aplikasi mobile pintar yang mendemonstrasikan bagaimana mesin pencari bekerja, mulai dari pengolahan teks hingga perhitungan relevansi matematis.

---

## 📸 Screenshots
| Halaman Home | Pilihan Metode | Detail Analisis |
|:---:|:---:|:---:|
| <img src="https://via.placeholder.com/150x300?text=Home" width="150" /> | <img src="https://via.placeholder.com/150x300?text=Features" width="150" /> | <img src="https://via.placeholder.com/150x300?text=Detail" width="150" /> |

---

## ✨ Fitur Utama & Metode IR

Aplikasi ini tidak hanya mencari dokumen, tapi juga **menjelaskan** bagaimana dokumen itu ditemukan.

### 🧠 6 Metode Inti
| Metode | Deskripsi |
| :--- | :--- |
| 🔡 **Regex Search** | Pencarian pola karakter presisi (cocok untuk email, tanggal, kode). |
| 📐 **Vector Space Model** | Ranking dokumen menggunakan pembobotan **TF-IDF** & **Cosine Similarity**. |
| ⚖️ **Boolean Retrieval** | Pencarian eksak menggunakan logika operator himpunan (**AND/OR**). |
| 🔄 **Relevance Feedback** | Sistem memperbaiki query otomatis berdasarkan feedback relevansi (*Query Expansion*). |
| 🕸️ **Document Clustering** | Pengelompokan dokumen otomatis menggunakan **K-Means** (*Unsupervised Learning*). |
| 🎲 **Probabilistic (BIM)** | Estimasi peluang relevansi dokumen menggunakan *Binary Independence Model*. |

### 🚀 Fitur Canggih Tambahan
* **🎙️ Voice Search:** Cari dokumen hanya dengan suara (Integrasi Google Speech API).
* **📊 Visualisasi Data:** Grafik batang (*Bar Chart*) frekuensi kata kunci pada dokumen.
* **🔍 Explainable IR:** Transparansi algoritma! Klik hasil pencarian untuk melihat langkah tokenisasi, stemming, hingga scoring.
* **⚙️ Preprocessing Toggle:** User bisa menyalakan/mematikan *Stemming* (Sastrawi) dan *Stopword Removal* secara real-time.
* **📝 Manajemen Dokumen:** Tambah dokumen baru ke dalam korpus langsung dari aplikasi.
* **🕒 Riwayat Pencarian:** Menyimpan history kata kunci secara lokal.

---

## 🛠️ Teknologi yang Digunakan

### 📱 Frontend (Mobile)
* **Framework:** React Native (via Expo Router)
* **Bahasa:** TypeScript
* **UI Components:** `react-native-svg-charts`, `vector-icons`
* **Storage:** `AsyncStorage`
* **Audio:** `expo-av`

### 🖥️ Backend (Server)
* **Framework:** Python Flask
* **Machine Learning:** Scikit-Learn, NumPy
* **NLP:** NLTK, Sastrawi (Bahasa Indonesia)
* **Audio Processing:** Pydub, SpeechRecognition, FFmpeg

---

## ⚙️ Panduan Instalasi (Langkah demi Langkah)

### Prasyarat
Pastikan di komputer Anda sudah terinstall:
1.  **Node.js** & npm
2.  **Python 3.x**
3.  **FFmpeg** (Wajib untuk fitur Voice Search di Windows) -> *Tambahkan ke Path Environment Variable*.

### 1. Clone Repository
```bash
git clone [https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git](https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git)
cd NAMA_REPO_ANDA
# Masuk folder backend
cd backend

# Buat Virtual Environment
python -m venv venv

# Aktifkan (Windows)
venv\Scripts\activate
# Aktifkan (Mac/Linux)
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Jalankan Server
python app.py
# Masuk folder frontend
cd frontend

# Install Dependencies
npm install

# Jalankan Aplikasi
npx expo start
// Ganti dengan IP Laptop Anda yang baru
const API_URL = '[http://192.168.1.10:5000](http://192.168.1.10:5000)';

/
├── backend/                  # 🐍 Python Flask Server
│   ├── app.py                # Main Controller & API Routes
│   ├── data.py               # In-Memory Database (Corpus)
│   └── requirements.txt      # Dependency List
│
└── frontend/                 # ⚛️ React Native App
    ├── app/
    │   ├── (tabs)/           # Navigation Tabs (Home, Features, Guide)
    │   ├── search/           # Search Logic & Voice Input
    │   ├── detail-analysis   # Visualization & Explanation Page
    │   └── add-document      # CRUD Page
    ├── assets/               # Images & Icons
    └── package.json

👨‍💻 Author
Faiz Nizar Nu'aim Mahasiswa Teknik Informatika

Universitas Teknokrat Indonesia

Dibuat dengan ❤️ menggunakan React Native & Python