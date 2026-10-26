import type { MediaId } from "./media";

// Ürün adları Başkent Aspava şubelerinin çevrim içi menülerinden derlenmiştir.
// Fiyat bilinçli olarak gösterilmez; şubeye göre değişir.
// Görselli ürünler, tanıtım filminde gerçekten yer alan tabaklardır.
export const menuCheck =
  "Ürün adları şubelerin çevrim içi menülerinden derlendi; mevcut menüyle karşılaştırılmalı.";

export type CategoryId = "kebap" | "doner" | "firin";

export type Category = {
  id: CategoryId;
  label: string;
  // Görseli olmayan, menüde yer alan diğer ürünler
  more: string[];
};

export type Dish = {
  id: string;
  name: string;
  category: CategoryId;
  media: MediaId;
  description: string;
  // Türkçe olmayan ürün adları için; büyük harfe çevirirken "i" → "İ" olmasın
  lang?: string;
};

export const categories: Category[] = [
  {
    id: "kebap",
    label: "Kebap & Izgara",
    more: ["Adana Kebap", "Urfa Kebap", "Kaşarlı Köfte", "Beyti"],
  },
  {
    id: "doner",
    label: "Et Döner",
    more: ["Pilav Üstü Et Döner", "SSK Et Döner Dürüm", "İskender"],
  },
  {
    id: "firin",
    label: "Fırın",
    more: ["Pide"],
  },
];

export const dishes: Dish[] = [
  {
    id: "aspava-special",
    name: "Aspava Special",
    lang: "en",
    category: "kebap",
    media: "aspava-special",
    description: "Ocakbaşından karışık tabak: kebap, ızgara et ve bulgur pilavı bir arada.",
  },
  {
    id: "patlicanli-kebap",
    name: "Patlıcanlı Kebap",
    category: "kebap",
    media: "patlicanli-kebap",
    description: "Közde pişen patlıcan ve kebap; sofraya kızgın tereyağıyla gelir.",
  },
  {
    id: "et-doner",
    name: "Et Döner",
    category: "doner",
    media: "et-doner",
    description: "Ustasının bıçağından, ince ince kesilerek tabağa iner.",
  },
  {
    id: "lahmacun",
    name: "Lahmacun",
    category: "firin",
    media: "lahmacun",
    description: "Fırının ateşinden çıkar çıkmaz; maydanoz ve limonla.",
  },
];
