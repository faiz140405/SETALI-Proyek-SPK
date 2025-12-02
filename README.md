# 📱 Sistem Temu Kembali (Information Retrieval Mobile App)

Aplikasi mobile berbasis **React Native** dan **Python Flask** yang dirancang untuk mendemonstrasikan berbagai metode Sistem Temu Kembali Informasi (*Information Retrieval*). Proyek ini dibuat untuk memenuhi tugas mata kuliah Sistem Temu Kembali.

## ✨ Fitur Utama
Aplikasi ini mengimplementasikan 6 metode pencarian dokumen secara lengkap:

1.  **Regex Search:** Pencarian pola teks presisi (e.g., email, tanggal).
2.  **Vector Space Model (VSM):** Ranking dokumen berdasarkan *Cosine Similarity* & *TF-IDF*.
3.  **Boolean Retrieval:** Pencarian eksak menggunakan logika operator AND/OR.
4.  **Relevance Feedback:** Ekspansi query otomatis berdasarkan feedback relevansi (Query Expansion).
5.  **Document Clustering:** Pengelompokan dokumen otomatis menggunakan *K-Means (Unsupervised)*.
6.  **Probabilistic (BIM):** Estimasi peluang relevansi dokumen (*Binary Independence Model*).

🚀 **Fitur Unggulan:** **Explainable IR** - Klik hasil pencarian untuk melihat detail langkah demi langkah perhitungan matematis (Tokenisasi, Filtering, Scoring) secara transparan.

---

## 🛠️ Teknologi yang Digunakan

### Frontend (Mobile)
* **Framework:** React Native (Expo Router)
* **Language:** TypeScript
* **Networking:** Axios
* **UI/UX:** Modern Dashboard Style, Custom Pill Tab Bar, Lottie/Icons.

### Backend (Server)
* **Framework:** Python Flask
* **Machine Learning:** Scikit-Learn (TF-IDF, Cosine Similarity, K-Means)
* **NLP:** NLTK (Text Processing)
* **Math:** NumPy

---

## ⚙️ Cara Instalasi & Menjalankan

Ikuti langkah-langkah berikut secara berurutan untuk menjalankan proyek di komputer lokal Anda.

### 1. Clone Repository
```bash
git clone [https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git](https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git)
cd NAMA_REPO_ANDA
2. Setup Backend (Python Flask)
Siapkan server terlebih dahulu agar API tersedia.

Bash

# Masuk ke folder backend
cd backend

# Buat Virtual Environment (Rekomendasi)
python -m venv venv

# Aktifkan Virtual Environment
# Untuk Windows:
venv\Scripts\activate
# Untuk Mac/Linux:
source venv/bin/activate

# Install Dependencies
pip install -r requirements.txt

# Jalankan Server
python app.py
Pastikan terminal menampilkan: Running on http://0.0.0.0:5000

3. Setup Frontend (React Native)
Buka terminal baru (jangan matikan terminal backend), lalu masuk ke folder frontend.

Bash

# Kembali ke root, lalu masuk frontend
cd ../frontend

# Install Dependencies
npm install
4. ⚠️ Konfigurasi IP Address (PENTING)
Agar HP Android/iOS Anda bisa berkomunikasi dengan Laptop, Anda harus mengatur IP Address.

Buka Command Prompt/Terminal, ketik ipconfig (Windows) atau ifconfig (Mac/Linux).

Salin IPv4 Address (misal: 192.168.1.10).

Buka file frontend/app/search/[method].tsx dan frontend/app/detail-analysis.tsx.

Ganti variabel API_URL:

JavaScript

// Ganti dengan IP Laptop Anda
const API_URL = '[http://192.168.x.x:5000](http://192.168.x.x:5000)';
5. Jalankan Aplikasi
Bash

npx expo start
Scan QR Code yang muncul menggunakan aplikasi Expo Go di HP Anda.

📝 Struktur Folder
Plaintext

/
├── backend/            # Server Python Flask
│   ├── app.py          # Main Logic & API Endpoints
│   ├── data.py         # Dummy Corpus Data
│   └── requirements.txt
│
└── frontend/           # React Native Expo
    ├── app/
    │   ├── (tabs)/     # Halaman Menu (Home, Features, Guide)
    │   ├── search/     # Halaman Pencarian Dinamis
    │   └── detail-analysis.tsx  # Halaman Explainable AI
    └── ...
❓ Troubleshooting
Masalah: "Network Request Failed" atau "Axios Error"

Pastikan Laptop dan HP terhubung ke WiFi yang sama.

Pastikan IP Address di kodingan frontend sudah benar sesuai IP Laptop saat ini.

Matikan Firewall laptop sementara waktu jika memblokir koneksi masuk.

Pastikan app.py berjalan dengan host 0.0.0.0.

👨‍💻 Author
[Faiz Nizar Nu'aim]