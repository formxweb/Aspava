# Başkent Aspava — Web Sitesi

Başkent Aspava Restaurant için tek sayfalık kurumsal site.
Next.js 16 (App Router), TypeScript, Tailwind CSS 4 ve GSAP ile hazırlanmıştır.
Site tamamen statik üretilir; `out/` klasörü herhangi bir sunucuya yüklenebilir.

## Çalıştırma

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # statik çıktı: out/
npm run lint
```

## GitHub Pages önizlemesi

Önizleme adresi: **https://formxweb.github.io/Aspava/**

Güncellemek için `scripts/deploy-pages.sh` çalıştırın. Betik siteyi `/Aspava` alt dizinine göre
derler (`npm run build:pages`) ve `out/` klasörünü `gh-pages` dalına gönderir.
Önizleme derlemesi arama motorlarına kapalıdır (`noindex`, `robots.txt` → `Disallow: /`).
Asıl alan adına (baskentaspava.com.tr) çıkarken normal `npm run build` kullanın.

## Bölümler

| Bölüm | Bileşen | Not |
| --- | --- | --- |
| Navigasyon | `src/components/SiteHeader.tsx` | Video üzerinde şeffaf, sonra düz zemin; mobilde tam ekran menü |
| Açılış | `src/components/Hero.tsx` | Tanıtım filmi arka planda; sahne altyazısı, durdur/ses düğmeleri |
| Menü | `src/components/MenuExplorer.tsx` | Kategori geçişi, büyük sahne görseli, perde geçişi, kaydırma (swipe) |
| Aspava Sofrası | `src/components/SofraStory.tsx` | ASPAVA duası, ateş / fırın / sofra hikâyesi |
| Şubeler | `src/components/Branches.tsx` | Şehir seçimi, fotoğraf/harita, adres, telefon, yol tarifi, sipariş |
| Alt bilgi | `src/components/SiteFooter.tsx` | Şube telefonları ve bağlantılar |

## İçerik nereden düzenlenir?

Tüm içerik `src/data/` altındadır; bileşenlere dokunmadan güncellenebilir.

- `site.ts` — marka adı, slogan, Instagram ve "Tüm bağlantılar" adresleri
- `menu.ts` — kategoriler, öne çıkan yemekler ve açıklamaları (fiyat gösterilmez)
- `branches.ts` — şube adres, telefon, saat, harita sorgusu, sipariş linki
- `media.ts` — görsellerin alternatif metinleri ve tanıtım filmindeki sahne zamanları

## Doğrulanması gereken bilgiler

Kaynağı teyit edilemeyen her bilgi sitede sarı **"Doğrulanmalı"** etiketiyle görünür
(üzerine gelince kaynağı yazar). Bilgi teyit edildiğinde `src/data/branches.ts` veya
`src/data/menu.ts` içindeki ilgili `check` alanını silmeniz yeterlidir.
Tüm etiketleri yayında gizlemek için derlemeden önce `NEXT_PUBLIC_HIDE_CHECKS=1` tanımlayın.

| Bilgi | Kaynak | Durum |
| --- | --- | --- |
| Samsun, Amasya, Tokat adresleri | Instagram biyografisi (@baskent_aspava) | Doğrulandı |
| İstanbul Ataşehir adresi | Şube sayfası ve harita kayıtları | Kontrol edilmeli (No:44 / No:46) |
| Şube telefonları | Rehber ve harita kayıtları | Kontrol edilmeli |
| Çalışma saatleri | İşletmenin iletişim sayfası | Kontrol edilmeli |
| Online sipariş linkleri | Yemeksepeti arama sonuçları | Kontrol edilmeli |
| Menü ürün adları | Şubelerin çevrim içi menüleri | Kontrol edilmeli |
| Samsun şube fotoğrafı | Tanıtım filmi (tabelada 0362 437 55 14-15) | Kontrol edilmeli |

Mevcut HTML dosyasındaki bilgilerle karşılaştırıp düzeltmek için yalnızca `src/data/` yeterlidir.

## Görseller ve video

- `public/media/baskent-aspava-tanitim.mp4` — markanın Instagram tanıtım filmi;
  alttaki logo/dua bandı kırpıldı, web için yeniden sıkıştırıldı (H.264, ~2,3 MB).
- `public/media/*-480|720.avif|webp` — aynı filmden alınmış gerçek kareler.
  Stok fotoğraf veya üretilmiş görsel kullanılmamıştır; renklere filtre uygulanmamıştır.
- `public/brand/baskent-aspava-logo.*` — Instagram profil görselinden alınan logo.
  Vektörel (SVG) veya yüksek çözünürlüklü logo dosyası gelince aynı adla değiştirin.
- `public/og.jpg` — paylaşım önizlemesi (gerçek kareler + logo).

Mevcut sitedeki fotoğraflar eklenecekse: görseli 480 ve 720 piksel genişlikte AVIF + WebP
olarak `public/media/<ad>-480.avif` biçiminde kaydedin, `src/data/media.ts` içine ekleyin
ve ilgili yemeğin ya da şubenin `media` / `photo` alanında kullanın.
Şube fotoğrafı olmayan şubelerde harita gösterilir.
