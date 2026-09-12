# 🏎️ GTCAT CALENDAR (GT3 RS Cockpit Edition)

> **İstanbul Üniversitesi Hukuk Fakültesi (İÜHF)** çift şube öğrencisi, genç girişimci ve yazılımcı **Erdal Çetin** için özel olarak geliştirilmiş interaktif ajanda, ders takip, Pomodoro odak sayacı ve haftalık zaman matrisi sistemi.

---

## ⚡ Yeni V3 Güncellemeleri

1. **Gelişmiş Pomodoro & Seans Yönetimi:**
   * **Manuel Süre Ayarı:** `+5 dk`, `-5 dk`, `+1 dk`, `-1 dk` adımlarıyla süreyi anında artırıp azaltabilme.
   * **Hızlı Preset Butonları:** `15 dk`, `25 dk (Klasik)`, `40 dk (İÜHF 1 Amfi Dersi)`, `50 dk`, `60 dk (Altın Blok)`.
   * **Seans & Tur Silme:** Tamamlanan seans geçmişini tek tıkla silme veya tek tek temizleme.
   * **Seans Günlüğü:** Tamamlanan her odak bloğunun saati, süresi ve etiket geçmişi.
2. **Korumalı Sağlam Veritabanı (Zero-Loss DB Engine):**
   * **Çift Katmanlı Güvenlik:** `localStorage` + Anlık Otomatik Snapshot Sistemi.
   * **Otomatik Geri Yükleme (Rollback):** Yapılan her düzenlemede otomatik snapshot alınır (son 12 durum saklanır). İstenildiğinde "Bu Yedeğe Dön" butonuyla geçmişe tek tıkla dönülebilir.
   * **JSON Yedek İndir / Yükle:** Tüm notlarınızı dosya olarak indirip saklayabilme.
3. **Hostinger Uyumlu Altyapı & Bulut Eşitleme:**
   * **LiteSpeed / Apache `.htaccess`:** Hostinger sunucularında sayfa yenilemede 404 hatasını önleyen, Gzip ve önbellek yapılandırması.
   * **Hostinger PHP Sync API (`api/sync.php`):** Hostinger sunucusunda çalışan hafif bulut depolama servisi. Telefon ve bilgisayar arasında tek tıkla senkronizasyon sağlar.
   * **Tek Tıkla Dağıtım:** `npm run pack:hostinger` komutu ile `hostinger-deploy.zip` hazır!

---

## 🌐 Hostinger'da 3 Adımda Yayınlama Rehberi

Hostinger hesabınızda alan adınız (domain) ve hostinginiz hazır olduğuna göre şu 3 adımla anında yayına alabilirsiniz:

1. **Paketi Oluşturun:**
   ```powershell
   cd C:\projeler\gtcat-calender
   npm run pack:hostinger
   ```
   *Bu komut proje kök dizininde `hostinger-deploy.zip` dosyasını oluşturur.*

2. **Hostinger hPanel'e Yükleyin:**
   * Hostinger hPanel'e giriş yapın -> **Dosya Yöneticisi (File Manager)**'ne girin.
   * `public_html` klasörünü açın.
   * Sağ üstteki **Yükle (Upload)** butonuna tıklayıp `C:\projeler\gtcat-calender\hostinger-deploy.zip` dosyasını seçin.

3. **Arşivden Çıkarın (Extract):**
   * Yüklediğiniz `hostinger-deploy.zip` dosyasına sağ tıklayıp **Çıkar (Extract)** deyin ve hedef olarak `public_html` seçin.
   * Artık `https://erdalcetin.com` (veya alan adınız ne ise) üzerinden siteniz dünya çapında anında yayında! 🎉

---

## 🛠️ Yerel Geliştirme (Local Dev)

```bash
cd C:\projeler\gtcat-calender
npm run dev
```
Tarayıcınızda `http://localhost:5173` adresinden çalıştırabilirsiniz.
