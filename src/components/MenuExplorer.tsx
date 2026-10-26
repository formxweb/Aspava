"use client";

import { useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { categories, dishes, menuCheck, type CategoryId } from "@/data/menu";
import { site } from "@/data/site";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { CheckFlag } from "./CheckFlag";
import { ArrowRight, ArrowUpRight } from "./icons";
import { Picture } from "./Picture";

const pad = (n: number) => String(n).padStart(2, "0");

export function MenuExplorer() {
  const [activeId, setActiveId] = useState(dishes[0].id);
  const [prevId, setPrevId] = useState<string | null>(null);
  const layers = useRef<Record<string, HTMLDivElement | null>>({});
  const direction = useRef(1);
  const swipeStart = useRef<number | null>(null);

  const activeIndex = dishes.findIndex((d) => d.id === activeId);
  const active = dishes[activeIndex];
  const category = categories.find((c) => c.id === active.category)!;

  const select = (id: string) => {
    if (id === activeId) return;
    const next = dishes.findIndex((d) => d.id === id);
    direction.current = next > activeIndex ? 1 : -1;
    setPrevId(activeId);
    setActiveId(id);
  };

  const step = (delta: number) => {
    const next = (activeIndex + delta + dishes.length) % dishes.length;
    select(dishes[next].id);
    direction.current = delta;
  };

  const selectCategory = (id: CategoryId) => {
    const first = dishes.find((d) => d.category === id);
    if (first) select(first.id);
  };

  // Yeni görsel, öncekinin üzerine perde gibi açılır
  useLayoutEffect(() => {
    if (!prevId || prevId === activeId) return;
    const layer = layers.current[activeId];
    if (!layer || prefersReducedMotion()) return;
    const from = direction.current > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)";
    const tl = gsap.timeline();
    tl.fromTo(
      layer,
      { clipPath: from },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.out" },
      0,
    ).fromTo(
      layer.querySelector("img"),
      { scale: 1.14, yPercent: direction.current * 4 },
      { scale: 1, yPercent: 0, duration: 1.4, ease: "expo.out" },
      0,
    );
    return () => {
      tl.kill();
    };
  }, [activeId, prevId]);

  const onPointerDown = (e: PointerEvent) => {
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
  };

  return (
    <section
      id="menu"
      aria-labelledby="menu-baslik"
      className="relative z-10 bg-paper shadow-[0_-24px_60px_rgba(0,0,0,0.18)]"
    >
      <div className="grid lg:min-h-svh lg:grid-cols-2 lg:grid-rows-[auto_1fr]">
        {/* Başlık ve kategoriler */}
        <header className="px-gutter pt-16 pb-8 lg:col-start-2 lg:row-start-1 lg:pt-28 lg:pb-0 lg:pl-14 xl:pl-20">
          <p className="type-eyebrow flex items-center gap-3 text-brand">
            <span aria-hidden="true" className="h-px w-8 bg-brand" />
            01 — Menü
          </p>
          <h2
            id="menu-baslik"
            className="type-serif mt-5 max-w-[21ch] text-[clamp(2.25rem,3.4vw,3.25rem)] leading-[1.02]"
          >
            Ocaktan, fırından, şişten — doğrudan sofraya.
          </h2>

          <div
            role="group"
            aria-label="Menü kategorileri"
            className="no-scrollbar -mx-[clamp(1rem,4.2vw,3.75rem)] mt-9 flex gap-7 overflow-x-auto px-[clamp(1rem,4.2vw,3.75rem)] lg:mx-0 lg:px-0"
          >
            {categories.map((c) => {
              const isActive = c.id === active.category;
              const count = dishes.filter((d) => d.category === c.id).length + c.more.length;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => selectCategory(c.id)}
                  className={`group relative shrink-0 pb-3 text-left text-[1.0625rem] font-semibold transition-colors duration-300 ${
                    isActive ? "text-ink" : "text-ink/45 hover:text-ink"
                  }`}
                >
                  {c.label}
                  <sup className="ml-1 font-serif text-[0.8rem] font-normal italic">{count}</sup>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-0 h-[2px] w-full origin-left bg-brand transition-transform duration-500 ease-out-expo ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <div aria-hidden="true" className="h-px bg-ink/10" />
        </header>

        {/* Sahne: seçili yemeğin büyük fotoğrafı */}
        <div className="relative lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <div
            className="relative aspect-[4/5] w-full touch-pan-y overflow-hidden bg-stone select-none sm:aspect-[5/4] lg:sticky lg:top-16 lg:aspect-auto lg:h-[calc(100svh-4rem)]"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipeStart.current = null)}
          >
            {dishes.map((d) => {
              const isActive = d.id === activeId;
              const isPrev = d.id === prevId;
              return (
                <div
                  key={d.id}
                  ref={(el) => {
                    layers.current[d.id] = el;
                  }}
                  aria-hidden={!isActive}
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    zIndex: isActive ? 2 : isPrev ? 1 : 0,
                    visibility: isActive || isPrev ? "visible" : "hidden",
                  }}
                >
                  <Picture
                    id={d.media}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="block h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                </div>
              );
            })}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-black/45 to-transparent"
            />
            <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-[clamp(1rem,2.4vw,2rem)] text-white">
              <p className="flex items-baseline gap-3" aria-hidden="true">
                <span className="font-serif text-2xl italic tabular-nums">{pad(activeIndex + 1)}</span>
                <span className="text-sm text-white/70">/ {pad(dishes.length)}</span>
                <span className="type-eyebrow ml-2 text-[0.6875rem] text-white/85">{category.label}</span>
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Önceki yemek"
                  className="flex size-11 items-center justify-center rounded-full border border-white/60 transition-colors hover:bg-white hover:text-ink"
                >
                  <ArrowRight className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Sonraki yemek"
                  className="flex size-11 items-center justify-center rounded-full border border-white/60 transition-colors hover:bg-white hover:text-ink"
                >
                  <ArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Seçili yemek bilgisi ve öne çıkanlar */}
        <div className="px-gutter flex flex-col pt-10 pb-16 lg:col-start-2 lg:row-start-2 lg:pt-12 lg:pb-20 lg:pl-14 xl:pl-20">
          <div aria-live="polite" className="min-h-[13rem] lg:min-h-[15rem]">
            <h3 key={active.id} lang={active.lang} className="type-display text-[clamp(3.25rem,12vw,4.5rem)] lg:text-[clamp(3.5rem,6vw,6.75rem)]">
              {active.name.split(" ").map((word, i) => (
                <span key={word} className="hero-line">
                  <span style={{ "--d": `${i * 0.07}s` } as React.CSSProperties}>{word}</span>
                </span>
              ))}
            </h3>
            <p
              key={`${active.id}-text`}
              className="hero-fade mt-5 max-w-[34ch] text-[1.125rem] leading-relaxed text-ink/75"
              style={{ "--d": "0.15s" } as React.CSSProperties}
            >
              {active.description}
            </p>
          </div>

          <div className="mt-10">
            <p className="type-eyebrow flex flex-wrap items-center gap-3 text-ink/55">
              {category.label} kategorisinde ayrıca
              <CheckFlag note={menuCheck} />
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-1 text-[1.0625rem] font-medium">
              {category.more.map((item, i) => (
                <li key={item} className="flex items-center gap-2">
                  {item}
                  {i < category.more.length - 1 && (
                    <span aria-hidden="true" className="text-brand">
                      /
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-12 flex items-end gap-3" role="group" aria-label="Öne çıkan yemekler">
            {dishes.map((d, i) => {
              const isActive = d.id === activeId;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => select(d.id)}
                  aria-pressed={isActive}
                  aria-label={d.name}
                  className={`group relative shrink-0 text-left transition-[width] duration-700 ease-out-expo ${
                    isActive ? "w-24 sm:w-32" : "w-16 sm:w-20"
                  }`}
                >
                  <span className="block aspect-[3/4] overflow-hidden bg-stone">
                    <Picture
                      id={d.media}
                      alt=""
                      sizes="128px"
                      className="block h-full w-full"
                      imgClassName={`h-full w-full object-cover transition-[transform,opacity] duration-700 ease-out-expo ${
                        isActive ? "opacity-100" : "opacity-75 group-hover:scale-105 group-hover:opacity-100"
                      }`}
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className={`mt-2 flex items-baseline gap-1.5 text-[0.75rem] transition-colors ${
                      isActive ? "text-brand" : "text-ink/50"
                    }`}
                  >
                    <span className="font-serif text-sm italic">{pad(i + 1)}</span>
                    {isActive && <span className="hidden truncate font-semibold sm:inline">{d.name}</span>}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-ink/10 pt-6 text-[0.9375rem] font-semibold">
            <a
              href={site.linksPage}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2"
            >
              <span className="link-underline pb-0.5">Güncel menü ve sipariş bağlantıları</span>
              <ArrowUpRight size={16} className="text-brand" />
              <span className="sr-only">(yeni sekmede açılır)</span>
            </a>
            <a
              href={site.instagram.reels}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2"
            >
              <span className="link-underline pb-0.5">Tabakları Instagram&apos;da izle</span>
              <ArrowUpRight size={16} className="text-brand" />
              <span className="sr-only">(yeni sekmede açılır)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
