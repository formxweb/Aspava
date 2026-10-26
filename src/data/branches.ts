import type { MediaId } from "./media";

// Doğrulama notları: `check` alanı dolu olan bilgiler henüz teyit edilmemiştir.
// Notlar sitede gizlidir; bilgi teyit edildiğinde `check` alanını silmeniz yeterli.
// Notları sitede "Doğrulanmalı" etiketiyle görmek için: NEXT_PUBLIC_SHOW_CHECKS=1
export const SHOW_CHECKS = process.env.NEXT_PUBLIC_SHOW_CHECKS === "1";

export type Checked<T> = { value: T; check?: string };

export type Branch = {
  id: "samsun" | "amasya" | "tokat" | "istanbul";
  city: string;
  district: string;
  address: Checked<string>;
  phone: Checked<{ display: string; tel: string }>;
  hours: Checked<string>;
  // Harita ve yol tarifinde kullanılan arama ifadesi
  mapQuery: string;
  // Şubeler haritasındaki yaklaşık konum ve etiketin yönü
  coords: { lat: number; lon: number };
  label: "left" | "right" | "above" | "below";
  photo?: { media: MediaId; caption: string; check?: string };
  order?: Checked<string>;
};

export const branches: Branch[] = [
  {
    id: "samsun",
    city: "Samsun",
    district: "Atakum",
    address: { value: "Denizevleri Mh. Alaçam Cd. No:6/A, Atakum / Samsun" },
    phone: {
      value: { display: "0362 437 55 14", tel: "+903624375514" },
      check: "Rehber kayıtlarından ve salondaki tabeladan alındı; mevcut HTML ile karşılaştırılmalı.",
    },
    hours: {
      value: "Her gün 10:30 – 23:00",
      check: "İşletmenin iletişim sayfasından alındı; güncelliği doğrulanmalı.",
    },
    mapQuery: "Başkent Aspava, Denizevleri Mahallesi Alaçam Caddesi No:6/A, Atakum, Samsun",
    coords: { lat: 41.33, lon: 36.27 },
    label: "above",
    photo: {
      media: "salon-servis",
      caption: "Salon",
      check:
        "Tanıtım filmindeki salon; tabelada 0362 437 55 14-15 okunduğu için Samsun şubesiyle eşleştirildi.",
    },
    order: {
      value: "https://www.yemeksepeti.com/restaurant/hb8r/baskent-aspava-hb8r",
      check: "Arama sonuçlarından bulundu; linkler sayfasıyla karşılaştırılmalı.",
    },
  },
  {
    id: "amasya",
    city: "Amasya",
    district: "Merkez",
    address: { value: "Hacılar Meydanı Mh. Necip Fazıl Cd. No:7/C, Merkez / Amasya" },
    phone: {
      value: { display: "0358 213 06 08", tel: "+903582130608" },
      check: "Rehber kayıtlarından alındı; mevcut HTML ile karşılaştırılmalı.",
    },
    hours: {
      value: "Her gün 10:30 – 23:00",
      check: "Kaynaklar farklı saat veriyor (10:00 – 23:30); doğrulanmalı.",
    },
    mapQuery: "Başkent Aspava, Hacılar Meydanı Mahallesi Necip Fazıl Caddesi No:7/C, Amasya",
    coords: { lat: 40.65, lon: 35.83 },
    label: "left",
    order: {
      value: "https://www.yemeksepeti.com/restaurant/jrgf/baskent-aspava",
      check: "Arama sonuçlarından bulundu; linkler sayfasıyla karşılaştırılmalı.",
    },
  },
  {
    id: "tokat",
    city: "Tokat",
    district: "Merkez",
    address: { value: "Yeşilırmak Mh. Zekai Gümüşdiş Blv. No:9/C, Merkez / Tokat" },
    phone: {
      value: { display: "0356 233 00 00", tel: "+903562330000" },
      check: "Rehber kayıtlarından alındı; mevcut HTML ile karşılaştırılmalı.",
    },
    hours: {
      value: "Her gün 10:30 – 23:00",
      check: "İşletmenin iletişim sayfasından alındı; güncelliği doğrulanmalı.",
    },
    mapQuery: "Başkent Aspava, Yeşilırmak Mahallesi Vali Zekai Gümüşdiş Bulvarı No:9/C, Tokat",
    coords: { lat: 40.31, lon: 36.55 },
    label: "below",
    order: {
      value: "https://www.yemeksepeti.com/restaurant/ec6p/baskent-aspava-ec6p",
      check: "Arama sonuçlarından bulundu; linkler sayfasıyla karşılaştırılmalı.",
    },
  },
  {
    id: "istanbul",
    city: "İstanbul",
    district: "Ataşehir",
    address: {
      value: "Küçükbakkalköy Mh. Attila İlhan Cd. No:44 D:1, Ataşehir / İstanbul",
      check: "Mevcut HTML dosyasındaki adresle karşılaştırılmalı (bazı haritalarda No:46 görünüyor).",
    },
    phone: {
      value: { display: "0216 358 00 05", tel: "+902163580005" },
      check: "Harita kayıtlarından alındı; işletme sayfasında 0501 085 05 05 de geçiyor. Doğrulanmalı.",
    },
    hours: {
      value: "Her gün 08:00 – 23:00",
      check: "Şube sayfasından alındı; güncelliği doğrulanmalı.",
    },
    mapQuery: "Başkent Aspava Ataşehir, Küçükbakkalköy Mahallesi Attila İlhan Caddesi No:44, Ataşehir, İstanbul",
    coords: { lat: 40.98, lon: 29.12 },
    label: "above",
  },
];

export const directionsUrl = (b: Branch) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(b.mapQuery)}`;

export const mapEmbedUrl = (b: Branch) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(b.mapQuery)}&z=16&hl=tr&output=embed`;
