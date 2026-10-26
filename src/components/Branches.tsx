"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { branches, directionsUrl, mapEmbedUrl, type Branch } from "@/data/branches";
import { gsap, MOTION_OK } from "@/lib/gsap";
import { CheckFlag } from "./CheckFlag";
import { ArrowUpRight, BagIcon, PhoneIcon, RouteIcon } from "./icons";
import { Picture } from "./Picture";

// Haritanın kapsadığı alan (eş dikdörtgen izdüşüm, 41° enlemde boylam düzeltmesi)
const LON = [28.2, 37.4] as const;
const LAT = [39.9, 41.8] as const;
const project = ({ lat, lon }: Branch["coords"]) => ({
  x: ((lon - LON[0]) / (LON[1] - LON[0])) * 100,
  y: ((LAT[1] - lat) / (LAT[1] - LAT[0])) * 100,
});
const meridians = Array.from({ length: 9 }, (_, i) => 29 + i);
const parallels = [40, 41];
const labelPlacement: Record<Branch["label"], string> = {
  left: "top-1/2 right-full mr-2 -translate-y-1/2",
  right: "top-1/2 left-full ml-2 -translate-y-1/2",
  above: "bottom-full left-1/2 mb-1 -translate-x-1/2",
  below: "top-full left-1/2 mt-1 -translate-x-1/2",
};
// Rota: İstanbul'dan Karadeniz'e
const routeOrder: Branch["id"][] = ["istanbul", "samsun", "amasya", "tokat"];

export function Branches() {
  const [activeId, setActiveId] = useState(branches[0].id);
  const [view, setView] = useState<"photo" | "map">("photo");
  const [mapReady, setMapReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const routeRef = useRef<SVGSVGElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const index = branches.findIndex((b) => b.id === activeId);
  const branch = branches[index];
  const showPhoto = Boolean(branch.photo) && view === "photo";

  // Gömülü harita yalnızca bölüm görünüme yaklaşınca yüklenir
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMapReady(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Rota çizgisi bölüme girerken çizilir
  useEffect(() => {
    const route = routeRef.current;
    if (!route) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        route,
        { clipPath: "inset(-10% 100% -10% 0%)" },
        {
          clipPath: "inset(-10% 0% -10% 0%)",
          duration: 2.4,
          ease: "power2.inOut",
          scrollTrigger: { trigger: route, start: "top 85%", once: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  const choose = (id: Branch["id"]) => {
    setActiveId(id);
    setView("photo");
  };

  const onTabKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next = index;
    if (e.key in keys) next = (index + keys[e.key] + branches.length) % branches.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = branches.length - 1;
    else return;
    e.preventDefault();
    choose(branches[next].id);
    tabRefs.current[branches[next].id]?.focus();
  };

  const route = routeOrder
    .map((id) => project(branches.find((b) => b.id === id)!.coords))
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  return (
    <section
      id="subeler"
      ref={sectionRef}
      aria-labelledby="subeler-baslik"
      data-surface="brand"
      className="relative z-10 overflow-hidden bg-brand text-white"
    >
      <div className="px-gutter mx-auto max-w-[1600px] pt-24 pb-24 lg:pt-32 lg:pb-32">
        <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-8">
            <p className="type-eyebrow flex items-center gap-3 text-white/85">
              <span aria-hidden="true" className="h-px w-8 bg-white" />
              03 — Şubeler
            </p>
            <h2 id="subeler-baslik" className="type-display mt-7 text-[clamp(3.1rem,7vw,7.25rem)]">
              Dört şehir,
              <br />
              tek sofra<span className="text-ink">.</span>
            </h2>
          </div>
          <p className="max-w-[32ch] text-[1.0625rem] leading-relaxed text-white/85 lg:col-span-3 lg:col-start-10 lg:self-end">
            İstanbul&apos;dan Karadeniz&apos;e. Size en yakın şubeyi seçin; adres, telefon ve yol tarifi
            hemen altta.
          </p>
        </div>

        {/* Harita: gerçek enlem / boylamlara göre */}
        <div className="relative mt-14 aspect-[2.1/1] w-full sm:aspect-[2.8/1] lg:mt-20 lg:aspect-[3.6/1]" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {meridians.map((lon) => {
              const x = ((lon - LON[0]) / (LON[1] - LON[0])) * 100;
              return (
                <line key={lon} x1={x} x2={x} y1={0} y2={100} stroke="white" strokeOpacity="0.18" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
              );
            })}
            {parallels.map((lat) => {
              const y = ((LAT[1] - lat) / (LAT[1] - LAT[0])) * 100;
              return (
                <line key={lat} x1={0} x2={100} y1={y} y2={y} stroke="white" strokeOpacity="0.18" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
              );
            })}
          </svg>
          <svg
            ref={routeRef}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            <polyline
              points={route}
              fill="none"
              stroke="white"
              strokeOpacity="0.85"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <span className="type-ring absolute top-[4%] left-[52%] -translate-x-1/2 text-[clamp(0.625rem,1vw,0.8125rem)] tracking-[0.6em] text-white/45">
            KARADENİZ
          </span>
          {meridians.filter((_, i) => i % 2 === 0).map((lon) => (
            <span
              key={lon}
              className="absolute -bottom-6 -translate-x-1/2 text-[0.6875rem] tabular-nums text-white/55"
              style={{ left: `${((lon - LON[0]) / (LON[1] - LON[0])) * 100}%` }}
            >
              {lon}°D
            </span>
          ))}
          {parallels.map((lat) => (
            <span
              key={lat}
              className="absolute -left-1 -translate-y-1/2 -translate-x-full pr-2 text-[0.6875rem] tabular-nums text-white/55 max-lg:hidden"
              style={{ top: `${((LAT[1] - lat) / (LAT[1] - LAT[0])) * 100}%` }}
            >
              {lat}°K
            </span>
          ))}

          {branches.map((b) => {
            const { x, y } = project(b.coords);
            const selected = b.id === activeId;
            return (
              <button
                key={b.id}
                type="button"
                tabIndex={-1}
                onClick={() => choose(b.id)}
                className="group absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <span className="relative flex size-6 items-center justify-center">
                  {selected && <span className="ripple absolute inset-0 rounded-full border border-white" />}
                  <span
                    className={`rounded-full bg-white transition-all duration-500 ease-out-expo ${
                      selected ? "size-5 shadow-[0_0_0_4px_rgba(255,255,255,0.25)]" : "size-2.5 group-hover:size-4"
                    }`}
                  />
                  {selected && <span className="absolute size-2 rounded-full bg-brand" />}
                </span>
                <span
                  className={`absolute whitespace-nowrap transition-opacity duration-300 ${labelPlacement[b.label]} ${
                    selected ? "opacity-100" : "opacity-70 group-hover:opacity-100 max-sm:hidden"
                  }`}
                >
                  <span className="type-display block text-[clamp(1.1rem,2.2vw,2.25rem)]">{b.city}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Şube seçimi ve bilgileri */}
        <div className="mt-20 grid gap-8 lg:mt-24 lg:grid-cols-12 lg:gap-x-8">
          <div
            role="tablist"
            aria-label="Şube seçin"
            className="grid grid-cols-2 gap-2 lg:col-span-4 lg:flex lg:flex-col lg:gap-1"
          >
            {branches.map((b) => {
              const selected = b.id === activeId;
              return (
                <button
                  key={b.id}
                  ref={(el) => {
                    tabRefs.current[b.id] = el;
                  }}
                  role="tab"
                  id={`sube-sekme-${b.id}`}
                  aria-selected={selected}
                  aria-controls="sube-paneli"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => choose(b.id)}
                  onKeyDown={onTabKey}
                  className={`flex items-baseline justify-between gap-3 rounded-full px-5 py-3 text-left transition-colors duration-300 lg:px-6 lg:py-4 ${
                    selected ? "bg-white text-brand" : "text-white/75 ring-1 ring-white/30 hover:bg-white/10 hover:text-white lg:ring-0"
                  }`}
                >
                  <span className="type-display text-[1.6rem] sm:text-[2rem] lg:text-[clamp(2.25rem,3.4vw,3.5rem)]">{b.city}</span>
                  <span className={`text-[0.8125rem] font-medium max-sm:hidden ${selected ? "text-ink/60" : "text-white/60"}`}>
                    {b.district}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id="sube-paneli"
            aria-labelledby={`sube-sekme-${branch.id}`}
            className="rounded-[2rem] bg-paper p-3 text-ink sm:p-4 lg:col-span-8 lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-8"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-stone lg:aspect-auto lg:min-h-[26rem]">
              {/* Harita yüklenene kadar (ya da yüklenemezse) görünen zemin */}
              <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ink/30">
                <RouteIcon size={32} />
                <span className="type-display text-[clamp(2.5rem,6vw,4.5rem)] text-ink/10">{branch.city}</span>
              </div>

              {showPhoto && branch.photo ? (
                <div key={`foto-${branch.id}`} className="hero-fade absolute inset-0">
                  <Picture
                    id={branch.photo.media}
                    sizes="(min-width: 1024px) 34vw, 100vw"
                    className="block h-full w-full"
                    imgClassName="h-full w-full object-cover"
                    imgStyle={{ objectPosition: "50% 38%" }}
                  />
                </div>
              ) : mapReady ? (
                <iframe
                  key={`harita-${branch.id}`}
                  src={mapEmbedUrl(branch)}
                  title={`Başkent Aspava ${branch.city} şubesinin haritadaki konumu`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="hero-fade absolute inset-0 h-full w-full border-0 grayscale-[0.85] contrast-[1.05]"
                />
              ) : null}

              {branch.photo && (
                <div className="absolute top-3 right-3 flex rounded-full bg-white p-1 text-[0.8125rem] font-semibold shadow-sm">
                  {(["photo", "map"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={view === v}
                      onClick={() => setView(v)}
                      className={`min-h-9 rounded-full px-3 transition-colors ${
                        view === v ? "bg-ink text-white" : "text-ink hover:text-brand"
                      }`}
                    >
                      {v === "photo" ? "Fotoğraf" : "Harita"}
                    </button>
                  ))}
                </div>
              )}
              {showPhoto && branch.photo?.check && (
                <div className="absolute bottom-3 left-3">
                  <CheckFlag note={branch.photo.check} />
                </div>
              )}
            </div>

            <div key={`bilgi-${branch.id}`} className="hero-fade flex flex-col px-3 pt-7 pb-4 lg:px-0 lg:pt-6 lg:pr-6">
              <p className="type-eyebrow text-[0.6875rem] text-brand">
                Başkent Aspava · {branch.district}
              </p>
              <p className="type-display mt-3 text-[clamp(2.75rem,5vw,4.5rem)]">{branch.city}</p>

              <dl className="mt-6 grid gap-5 text-[1rem]">
                <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                  <dt className="type-eyebrow pt-1 text-[0.625rem] text-ink/50">Adres</dt>
                  <dd className="leading-snug">
                    {branch.address.value}
                    <CheckFlag note={branch.address.check} className="mt-2 block w-fit" />
                  </dd>
                </div>
                <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                  <dt className="type-eyebrow pt-1 text-[0.625rem] text-ink/50">Telefon</dt>
                  <dd>
                    <a href={`tel:${branch.phone.value.tel}`} className="link-underline font-semibold">
                      {branch.phone.value.display}
                    </a>
                    <CheckFlag note={branch.phone.check} className="mt-2 block w-fit" />
                  </dd>
                </div>
                <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                  <dt className="type-eyebrow pt-1 text-[0.625rem] text-ink/50">Saatler</dt>
                  <dd>
                    {branch.hours.value}
                    <CheckFlag note={branch.hours.check} className="mt-2 block w-fit" />
                  </dd>
                </div>
              </dl>

              <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:mt-auto lg:pt-8">
                <a
                  href={directionsUrl(branch)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-brand px-5 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand-deep"
                >
                  <RouteIcon size={17} />
                  Yol Tarifi
                  <ArrowUpRight size={14} />
                  <span className="sr-only">(Google Haritalar yeni sekmede açılır)</span>
                </a>
                <a
                  href={`tel:${branch.phone.value.tel}`}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink px-5 text-[0.9375rem] font-semibold transition-colors hover:bg-ink hover:text-white"
                >
                  <PhoneIcon size={17} />
                  Ara
                </a>
                {branch.order && (
                  <a
                    href={branch.order.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/25 px-5 text-[0.9375rem] font-semibold transition-colors hover:border-ink"
                  >
                    <BagIcon size={17} />
                    Online sipariş
                    <CheckFlag note={branch.order.check} />
                    <span className="sr-only">(yeni sekmede açılır)</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
