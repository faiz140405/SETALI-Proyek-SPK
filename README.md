# 📱 Sistem Temu Kembali (Information Retrieval Mobile App)

Aplikasi mobile berbasis **React Native** dan **Python Flask** yang dirancang untuk mendemonstrasikan berbagai metode Sistem Temu Kembali Informasi (*Information Retrieval*). Proyek ini dibuat untuk memenuhi tugas mata kuliah Sistem Temu Kembali.

## ✨ Fitur Utama
Aplikasi ini mengimplementasikan 6 metode pencarian dokumen:

1.  **Regex Search:** Pencarian pola teks presisi (e.g., email, tanggal).
2.  **Vector Space Model (VSM):** Ranking dokumen berdasarkan *Cosine Similarity* & *TF-IDF*.
3.  **Boolean Retrieval:** Pencarian eksak menggunakan logika operator AND/OR.
4.  **Relevance Feedback:** Ekspansi query otomatis berdasarkan feedback relevansi.
5.  **Document Clustering:** Pengelompokan dokumen otomatis menggunakan *K-Means (Unsupervised)*.
6.  **Probabilistic (BIM):** Estimasi peluang relevansi dokumen (*Binary Independence Model*).

🚀 **Fitur Unggulan:** **Explainable IR** - Klik hasil pencarian untuk melihat detail langkah demi langkah perhitungan matematis (Tokenisasi, Filtering, Scoring) secara transparan.

## 🛠️ Teknologi yang Digunakan

### Frontend (Mobile)
* **React Native** (Expo Router)
* **TypeScript**
* **Axios** (Networking)
* **UI/UX:** Modern Dashboard Style, Custom Tab Bar, Lottie/Icons.

### Backend (Server)
* **Python Flask**
* **Scikit-Learn** (TF-IDF, Cosine Similarity, K-Means)
* **NLTK** (Text Processing)
* **NumPy**

---

## ⚙️ Cara Instalasi & Menjalankan

Ikuti langkah berikut untuk menjalankan proyek di komputer lokal Anda.

### 1. Clone Repository
```bash
git clone [https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git](https://github.com/USERNAME_ANDA/NAMA_REPO_ANDA.git)
cd NAMA_REPO_ANDA

cd backend
# Buat Virtual Environment (Opsional tapi disarankan)
python -m venv venv
# Aktifkan Venv (Windows)
venv\Scripts\activate
# Aktifkan Venv (Mac/Linux)
source venv/bin/activate

# Install Library
pip install -r requirements.txt

python app.py