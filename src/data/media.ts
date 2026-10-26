import { asset } from "@/lib/asset";

// Tüm görseller Başkent Aspava'nın kendi tanıtım filminden (Instagram) alınmış karelerdir.
// Her kare 720×1104 boyutundadır; filmin altındaki logo/yazı bandı kırpılmıştır.
// Dosyalar /public/media altında 480 ve 720 piksel genişlikte AVIF + WebP olarak bulunur.
export const media = {
  poster: {
    alt: "Karışık kebap tabağına yakın çekim",
  },
  "aspava-special": {
    alt: "Aspava Special: kebap, ızgara et ve bulgur pilavından oluşan karışık tabak",
  },
  lahmacun: {
    alt: "Maydanoz ve limonla servis edilen lahmacun",
  },
  "et-doner": {
    alt: "Usta bıçağıyla kesilen et döner",
  },
  "patlicanli-kebap": {
    alt: "Patlıcanlı kebabın üzerine kepçeyle kızgın tereyağı dökülüyor",
  },
  mangal: {
    alt: "Kömür ateşinde pişen patlıcanlı kebap şişleri",
  },
  firin: {
    alt: "Ateşli fırına kürekle verilen lahmacun",
  },
  "salon-bayrak": {
    alt: "Türk bayrağı ve Atatürk posteri asılı salonda yemek yiyen misafirler",
  },
  "salon-servis": {
    alt: "Başkent Aspava salonunda misafirler ve servis yapan garson",
  },
  "salon-misafir": {
    alt: "Geniş camlı salonda masada sohbet eden misafirler",
  },
} as const satisfies Record<string, { alt: string }>;

export type MediaId = keyof typeof media;

export const MEDIA_WIDTH = 720;
export const MEDIA_HEIGHT = 1104;

export const heroVideo = {
  src: asset("/media/baskent-aspava-tanitim.mp4"),
  poster: asset("/media/poster.jpg"),
  // Filmdeki sahne geçişleri (saniye) — ekrandaki altyazı bu sürelere göre değişir
  scenes: [
    { at: 0, label: "Aspava Special" },
    { at: 1.73, label: "Lahmacun" },
    { at: 3.5, label: "Et Döner" },
    { at: 6.33, label: "Ocakbaşı" },
    { at: 9.03, label: "Salon" },
    { at: 10.27, label: "Patlıcanlı Kebap" },
    { at: 11.73, label: "Fırın" },
    { at: 12.7, label: "Misafirlerimiz" },
  ],
} as const;
