import { branches } from "@/data/branches";
import { sections, site } from "@/data/site";
import { ArrowUpRight, InstagramIcon } from "./icons";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer data-surface="brand" className="relative z-10 overflow-hidden bg-brand text-white">
      <div className="px-gutter mx-auto max-w-[1600px] pt-20 pb-10 lg:pt-28">
        <p className="type-serif text-[clamp(3.5rem,11.5vw,11rem)] leading-[0.92]">
          Lezzetin
          <br />
          Başkenti<span className="text-ink">.</span>
        </p>

        <div className="mt-16 grid gap-12 border-t border-white/30 pt-12 sm:grid-cols-2 lg:mt-24 lg:grid-cols-12 lg:gap-x-8">
          <div className="flex items-start gap-4 lg:col-span-4">
            <picture className="shrink-0">
              <source srcSet="/brand/baskent-aspava-logo.webp" type="image/webp" />
              <img
                src="/brand/baskent-aspava-logo.png"
                alt="Başkent Aspava logosu"
                width={88}
                height={88}
                loading="lazy"
                className="size-20 rounded-full ring-2 ring-white/90"
              />
            </picture>
            <div>
              <p className="type-display text-[1.6rem] tracking-[0.02em]">{site.legalName}</p>
              <p className="mt-2 max-w-[28ch] text-[0.9375rem] leading-relaxed text-white/85">
                Ocakbaşı, et döner ve fırın; Aspava sofrası geleneğiyle.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-6">
            <h2 className="type-eyebrow text-white/75">Şubeler</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-5">
              {branches.map((b) => (
                <li key={b.id}>
                  <p className="font-semibold">
                    {b.city} <span className="font-normal text-white/75">· {b.district}</span>
                  </p>
                  <a href={`tel:${b.phone.value.tel}`} className="link-underline mt-1 inline-block text-[0.9375rem]">
                    {b.phone.value.display}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Alt menü" className="lg:col-span-3 lg:col-start-10">
            <h2 className="type-eyebrow text-white/75">Keşfet</h2>
            <ul className="mt-5 flex flex-col gap-3 text-[0.9375rem] font-medium">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="link-underline">
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <InstagramIcon size={18} />
                  <span className="link-underline">@{site.instagram.handle}</span>
                  <span className="sr-only">(yeni sekmede açılır)</span>
                </a>
              </li>
              <li>
                <a
                  href={site.instagram.message}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <span className="link-underline">Instagram&apos;dan mesaj gönder</span>
                  <ArrowUpRight size={14} />
                  <span className="sr-only">(yeni sekmede açılır)</span>
                </a>
              </li>
              <li>
                <a
                  href={site.linksPage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <span className="link-underline">Tüm bağlantılar</span>
                  <ArrowUpRight size={14} />
                  <span className="sr-only">(yeni sekmede açılır)</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/30 pt-6 text-[0.8125rem] text-white/80 sm:flex-row sm:justify-between">
          <p className="type-eyebrow text-[0.625rem] tracking-[0.28em]">
            Allah Sağlık, Para, Afiyet Versin, Amin
          </p>
          <p>
            © {year} {site.legalName}
          </p>
        </div>
      </div>
    </footer>
  );
}
