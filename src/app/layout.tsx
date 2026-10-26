import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Serif } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.slogan}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Başkent Aspava",
    "Aspava",
    "Samsun Aspava",
    "Amasya Aspava",
    "Tokat Aspava",
    "Ataşehir Aspava",
    "kebap",
    "et döner",
    "lahmacun",
    "patlıcanlı kebap",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: site.legalName,
    title: `${site.name} — ${site.slogan}`,
    description: site.description,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Başkent Aspava: et döner, karışık kebap ve lahmacun" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.slogan}`,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#d91111",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${archivo.variable} ${instrumentSerif.variable}`}>
      <head>
        <link rel="preload" as="image" href="/media/poster.jpg" fetchPriority="high" />
      </head>
      <body>
        <a
          href="#icerik"
          className="fixed top-3 left-3 z-[60] -translate-y-24 bg-ink px-4 py-3 text-sm font-semibold text-white transition-transform focus:translate-y-0"
        >
          İçeriğe geç
        </a>
        {children}
      </body>
    </html>
  );
}
