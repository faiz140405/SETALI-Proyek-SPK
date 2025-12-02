import os
from pydub import AudioSegment

# KITA SET PAKSA DI SINI
ffmpeg_path = r"D:\ffmpeg-2025-11-27-git-61b034a47c-essentials_build\bin\ffmpeg.exe"
ffprobe_path = r"D:\ffmpeg-2025-11-27-git-61b034a47c-essentials_build\bin\ffprobe.exe"

print(f"1. Cek file FFmpeg di: {ffmpeg_path}")
if os.path.exists(ffmpeg_path):
    print("   ✅ STATUS: File ditemukan!")
else:
    print("   ❌ STATUS: File TIDAK ADA. Cek lagi lokasi ekstrak Anda!")

print(f"\n2. Cek file FFprobe di: {ffprobe_path}")
if os.path.exists(ffprobe_path):
    print("   ✅ STATUS: File ditemukan!")
else:
    print("   ❌ STATUS: File TIDAK ADA.")

# Set Pydub
AudioSegment.converter = ffmpeg_path
AudioSegment.ffprobe = ffprobe_path

print("\n3. Tes Konfigurasi Pydub...")
try:
    print(f"   Converter diset ke: {AudioSegment.converter}")
    print("   ✅ Konfigurasi berhasil (secara kode).")
except Exception as e:
    print(f"   ❌ Error setting pydub: {e}")