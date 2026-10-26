"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { branches, directionsUrl, mapEmbedUrl } from "@/data/branches";
import { CheckFlag } from "./CheckFlag";
import { ArrowUpRight, BagIcon, PhoneIcon, RouteIcon } from "./icons";
import { Picture } from "./Picture";

const pad = (n: number) => String(n).padStart(2, "0");

export function Branches() {
  const [activeId, setActiveId] = useState(branches[0].id);
  const [view, setView] = useState<"photo" | "map">("photo");
  const [mapReady, setMapReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const index = branches.findIndex((b) => b.id === activeId);
  const branch = branches[index];
  const showPhoto = Boolean(branch.photo) && view === "photo";

  // Harita yalnızca bölüm görünüme yaklaşınca yüklenir
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

  const choose = (id: (typeof branches)[number]["id"]) => {
    setActiveId(id);
    setView("photo");
  };

  const onTabKey = (e: KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowRight: 1,
      ArrowDown: 1,
      ArrowLeft: -1,
      ArrowUp: -1,
    };
    let next = index;
    if (e.key in keys) next = (index + keys[e.key] + branches.length) % branches.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = branches.length - 1;
    else return;
    e.preventDefault();
    const target = branches[next];
    choose(target.id);
    tabRefs.current[target.id]?.focus();
  };

  return (
    <section
      id="subeler"
      ref={sectionRef}
      aria-labelledby="subeler-baslik"
      className="relative z-10 bg-stone"
    >
      <div className="px-gutter mx-auto max-w-[1600px] pt-24 pb-24 lg:pt-36 lg:pb-36">
        <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7">
            <p className="type-eyebrow flex items-center gap-3 text-brand">
              <span aria-hidden="true" className="h-px w-8 bg-brand" />
              03 — Şubeler
            </p>
            <h2
              id="subeler-baslik"
              className="type-display mt-8 text-[clamp(3.1rem,7vw,7.25rem)] lg:mt-10"
            >
              Dört şehir,
              <br />
              <span className="text-brand">tek</span> sofra.
            </h2>
          </div>
          <p className="max-w-[34ch] text-[1.125rem] leading-relaxed text-ink/75 lg:col-span-4 lg:col-start-9 lg:self-end">
            Size en yakın Başkent Aspava&apos;yı seçin; adres, telefon ve yol tarifi tek dokunuşla
            elinizde.
          </p>
        </div>

        <div className="mt-12 grid gap-y-10 lg:mt-20 lg:grid-cols-12 lg:gap-x-8">
          {/* Şehir seçici */}
          <div
            role="tablist"
            aria-label="Şube seçin"
            className="grid grid-cols-2 gap-px border border-ink/10 bg-ink/10 lg:col-span-5 lg:flex lg:flex-col lg:gap-0 lg:border-0 lg:border-t lg:border-ink/20 lg:bg-transparent"
          >
            {branches.map((b, i) => {
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
                  className={`group relative flex min-h-[5.5rem] flex-col justify-between p-4 text-left transition-colors duration-300 lg:min-h-0 lg:flex-row lg:items-baseline lg:border-b lg:border-ink/20 lg:px-0 lg:py-6 ${
                    selected
                      ? "bg-brand text-white lg:bg-transparent lg:text-brand"
                      : "bg-paper text-ink hover:text-brand lg:bg-transparent"
                  }`}
                >
                  <span className="flex items-baseline gap-4">
                    <span
                      className={`hidden font-serif text-lg italic lg:inline ${
                        selected ? "text-brand" : "text-ink/45"
                      }`}
                    >
                      {pad(i + 1)}
                    </span>
                    <span className="type-display text-[2rem] sm:text-[2.5rem] lg:text-[clamp(2.75rem,4.6vw,4.75rem)] lg:transition-transform lg:duration-700 lg:ease-out-expo lg:group-hover:translate-x-2">
                      {b.city}
                    </span>
                  </span>
                  <span
                    className={`text-[0.875rem] font-medium ${
                      selected ? "text-white/85 lg:text-brand" : "text-ink/55"
                    }`}
                  >
                    {b.district}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-[-1px] left-0 hidden h-[2px] w-full origin-left bg-brand transition-transform duration-700 ease-out-expo lg:block ${
                      selected ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Seçili şube */}
          <div
            role="tabpanel"
            id="sube-paneli"
            aria-labelledby={`sube-sekme-${branch.id}`}
            className="lg:col-span-7"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-paper sm:aspect-[16/10]">
              {/* Harita yüklenene kadar (ya da yüklenemezse) görünen zemin */}
              <div
                aria-hidden="true"
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_center,var(--color-stone)_0,transparent_70%)] text-ink/35"
              >
                <RouteIcon size={36} />
                <span className="type-display text-[clamp(2.5rem,7vw,5rem)] text-ink/10">
                  {branch.city}
                </span>
              </div>

              {showPhoto && branch.photo ? (
                <div key={`foto-${branch.id}`} className="hero-fade absolute inset-0">
                  <Picture
                    id={branch.photo.media}
                    sizes="(min-width: 1024px) 55vw, 100vw"
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

              <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4">
                <p className="pointer-events-auto bg-white px-3 py-2 text-[0.8125rem] font-semibold text-ink shadow-sm">
                  Başkent Aspava <span className="text-brand">{branch.city}</span>
                </p>
                {branch.photo && (
                  <div className="pointer-events-auto flex bg-white text-[0.8125rem] font-semibold shadow-sm">
                    {(["photo", "map"] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={view === v}
                        onClick={() => setView(v)}
                        className={`min-h-9 px-3 transition-colors ${
                          view === v ? "bg-ink text-white" : "text-ink hover:text-brand"
                        }`}
                      >
                        {v === "photo" ? "Fotoğraf" : "Harita"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {showPhoto && branch.photo?.check && (
                <div className="absolute bottom-3 left-3">
                  <CheckFlag note={branch.photo.check} />
                </div>
              )}
            </div>

            <div key={`bilgi-${branch.id}`} className="hero-fade">
              <dl className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr]">
                <div>
                  <dt className="type-eyebrow text-[0.6875rem] text-ink/55">Adres</dt>
                  <dd className="mt-3 text-[1.0625rem] leading-snug">
                    {branch.address.value}
                    <CheckFlag note={branch.address.check} className="mt-2 ml-0 block w-fit" />
                  </dd>
                </div>
                <div>
                  <dt className="type-eyebrow text-[0.6875rem] text-ink/55">Telefon</dt>
                  <dd className="mt-3 text-[1.0625rem]">
                    <a href={`tel:${branch.phone.value.tel}`} className="link-underline font-semibold">
                      {branch.phone.value.display}
                    </a>
                    <CheckFlag note={branch.phone.check} className="mt-2 block w-fit" />
                  </dd>
                </div>
                <div>
                  <dt className="type-eyebrow text-[0.6875rem] text-ink/55">Çalışma saatleri</dt>
                  <dd className="mt-3 text-[1.0625rem]">
                    {branch.hours.value}
                    <CheckFlag note={branch.hours.check} className="mt-2 block w-fit" />
                  </dd>
                </div>
              </dl>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href={directionsUrl(branch)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-14 items-center justify-between gap-6 bg-brand px-6 font-semibold text-white transition-colors hover:bg-brand-deep sm:justify-start"
                >
                  <span className="flex items-center gap-3">
                    <RouteIcon />
                    Yol Tarifi Al
                  </span>
                  <ArrowUpRight size={16} />
                  <span className="sr-only">(Google Haritalar yeni sekmede açılır)</span>
                </a>
                <a
                  href={`tel:${branch.phone.value.tel}`}
                  className="inline-flex h-14 items-center gap-3 border border-ink px-6 font-semibold transition-colors hover:bg-ink hover:text-white"
                >
                  <PhoneIcon />
                  {branch.city} şubesini ara
                </a>
                {branch.order && (
                  <a
                    href={branch.order.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-14 items-center gap-3 border border-ink/25 px-6 font-semibold transition-colors hover:border-ink"
                  >
                    <BagIcon />
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
