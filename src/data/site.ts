export const site = {
  name: "Başkent Aspava",
  legalName: "Başkent Aspava Restaurant",
  slogan: "Lezzetin Başkenti.",
  // Önizleme derlemesinde (GitHub Pages) yayın adresiyle değiştirilir
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://baskentaspava.com.tr",
  description:
    "Başkent Aspava; Samsun, Amasya, Tokat ve İstanbul Ataşehir şubeleriyle ocakbaşı kebapları, et döner ve fırından lahmacunu Aspava sofrası geleneğiyle buluşturur.",
  // Instagram biyografisindeki "Tüm Bilgiler" bağlantısı
  linksPage: "https://baskentaspava.com.tr/linkler.html",
  instagram: {
    handle: "baskent_aspava",
    url: "https://www.instagram.com/baskent_aspava/",
    reels: "https://www.instagram.com/baskent_aspava/reels/",
    message: "https://ig.me/m/baskent_aspava",
  },
  // ASPAVA: "Allah Sağlık, Para, Afiyet Versin, Amin" duasının baş harfleri
  prayer: ["Allah", "Sağlık", "Para", "Afiyet", "Versin", "Amin"],
} as const;

export const sections = [
  { id: "menu", label: "Menü", index: "01" },
  { id: "sofra", label: "Aspava Sofrası", index: "02" },
  { id: "subeler", label: "Şubeler", index: "03" },
] as const;
