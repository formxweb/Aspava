import { Branches } from "@/components/Branches";
import { Hero } from "@/components/Hero";
import { MenuExplorer } from "@/components/MenuExplorer";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SofraStory } from "@/components/SofraStory";
import { branches } from "@/data/branches";
import { site } from "@/data/site";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  url: site.url,
  logo: `${site.url}/brand/baskent-aspava-logo.png`,
  slogan: site.slogan,
  sameAs: [site.instagram.url],
  subOrganization: branches.map((b) => ({
    "@type": "Restaurant",
    name: `${site.name} ${b.city}`,
    servesCuisine: "Türk mutfağı",
    image: `${site.url}/og.jpg`,
    telephone: b.phone.value.tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: b.address.value.split(",")[0],
      addressLocality: b.district,
      addressRegion: b.city,
      addressCountry: "TR",
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapQuery)}`,
  })),
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="icerik">
        {/* Menü bölümü, yapışkan açılış filminin üzerine perde gibi kayar */}
        <div className="relative">
          <Hero />
          <MenuExplorer />
        </div>
        <SofraStory />
        <Branches />
      </main>
      <SiteFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
