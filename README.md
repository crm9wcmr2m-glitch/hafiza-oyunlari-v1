# Hafıza Oyunları v1

4-6 yaş çocukları için hafıza güçlendirme odaklı, tarayıcı tabanlı oyun sitesi.

## Özellikler
- Kız/erkek profil seçimi (pembe veya mavi tema paleti)
- Her profile özel emoji içerikleri (yiyecek içermez)
- 5 hafıza oyunu, her biri 3 zorluk seviyesi (Kolay / Orta / Zor)
- Seviye kilit sistemi + yıldız puanlama (localStorage)
- Ses efektleri (Web Audio API) ve animasyonlu geri bildirim
- Saf HTML/CSS/JS — kurulum gerektirmez

## Oyunlar
| # | Oyun | Açıklama |
|---|------|----------|
| 1 | 🎴 Kart Eşleştirme | Arkası dönük kartları çevirerek çiftleri bul |
| 2 | 🎶 Sıra Hatırlama | Gösterilen sırayı tekrar et (Simon tarzı) |
| 3 | 🔍 Farkı Bul | İki grid arasındaki farklı hücreleri bul |
| 4 | ❓ Hangisi Kayıp? | Gösterilen nesnelerden hangilerinin gittiğini seç |
| 5 | 🌓 Gölge Eşleme | Siluete uyan doğru emojiyi bul |

## Çalıştırma
Doğrudan `index.html` dosyasını tarayıcıda açabilir ya da yerel bir HTTP sunucusu kullanabilirsin:

```bash
# Ruby (macOS'ta genelde hazır)
ruby -run -e httpd . -p 8000

# Python 3
python3 -m http.server 8000
```

Ardından tarayıcıda: http://localhost:8000
