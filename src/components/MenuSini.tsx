"use client";

import { useEffect, useLayoutEffect, useRef, useState, type PointerEvent } from "react";
import { categories, dishes, menuCheck, type CategoryId } from "@/data/menu";
import { site } from "@/data/site";
import { gsap, MOTION_OK, prefersReducedMotion } from "@/lib/gsap";
import { CheckFlag } from "./CheckFlag";
import { ArrowRight, ArrowUpRight } from "./icons";
import { Picture } from "./Picture";
import { RingText } from "./RingText";

const pad = (n: number) => String(n).padStart(2, "0");

// Sini geometrisi (sini çapına oranla, %)
const STEP = 360 / dishes.length;
const FRONT = 180; // seçili yemek sininin sol kenarına, yazıya bakan tarafa döner
const PLATE = 62;
const THUMB = 14;
const RIM = 38.5;

const upper = (text: string, lang = "tr") => text.toLocaleUpperCase(lang);

// Halka yazısı: menünün tamamı, logodaki mühür gibi sininin çevresinde
const MENU_RING =
  categories
    .flatMap((c) => [
      ...dishes.filter((d) => d.category === c.id).map((d) => upper(d.name, d.lang)),
      ...c.more.map((m) => upper(m)),
    ])
    .join(" • ") + " • ";

const rotationFor = (index: number) => FRONT - index * STEP;

export function MenuSini() {
  const [activeId, setActiveId] = useState(dishes[0].id);
  const [prevId, setPrevId] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const layers = useRef<Record<string, HTMLDivElement | null>>({});
  const rotation = useRef(rotationFor(0));
  const swipeStart = useRef<number | null>(null);

  const activeIndex = dishes.findIndex((d) => d.id === activeId);
  const active = dishes[activeIndex];
  const category = categories.find((c) => c.id === active.category)!;

  const select = (id: string) => {
    if (id === activeId) return;
    setPrevId(activeId);
    setActiveId(id);
  };

  const step = (delta: number) => {
    select(dishes[(activeIndex + delta + dishes.length) % dishes.length].id);
  };

  const selectCategory = (id: CategoryId) => {
    const first = dishes.find((d) => d.category === id);
    if (first) select(first.id);
  };

  // GSAP başlangıç açısını bilsin (180° matristen ±180 diye okunabilir)
  useLayoutEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;
    gsap.set(wheel, { rotation: rotation.current });
    gsap.set(wheel.querySelectorAll("[data-thumb]"), { rotation: -rotation.current });
  }, []);

  // Sini döner (döner tabla), seçili tabak ortadaki tabağa açılır
  useLayoutEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel || !prevId) return;
    const target = rotationFor(activeIndex);
    const delta = ((((target - rotation.current) % 360) + 540) % 360) - 180;
    const next = rotation.current + delta;
    rotation.current = next;

    const thumbs = wheel.querySelectorAll("[data-thumb]");
    const layer = layers.current[activeId];
    if (prefersReducedMotion()) {
      gsap.set(wheel, { rotation: next });
      gsap.set(thumbs, { rotation: -next });
      return;
    }
    const tl = gsap.timeline();
    tl.to(wheel, { rotation: next, duration: 1.3, ease: "expo.out" }, 0)
      .to(thumbs, { rotation: -next, duration: 1.3, ease: "expo.out" }, 0);
    if (layer) {
      tl.fromTo(
        layer,
        { clipPath: "circle(0% at 0% 50%)" },
        { clipPath: "circle(75% at 50% 50%)", duration: 1.1, ease: "expo.out" },
        0.05,
      ).fromTo(
        layer.querySelector("img"),
        { scale: 1.2, rotation: delta > 0 ? -14 : 14 },
        { scale: 1, rotation: 0, duration: 1.4, ease: "expo.out" },
        0.05,
      );
    }
    return () => {
      tl.progress(1).kill();
    };
  }, [activeId, activeIndex, prevId]);

  // Bölümün üst kenarı, açılış filminin üzerine bir sini kenarı gibi kavisli yükselir
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(
        section,
        { "--dome": "18vh" },
        {
          "--dome": "0vh",
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "top top", scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  const onPointerDown = (e: PointerEvent) => {
    swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
  };

  return (
    <section
      id="menu"
      ref={sectionRef}
      aria-labelledby="menu-baslik"
      className="relative z-10 overflow-hidden bg-paper shadow-[0_-30px_80px_rgba(0,0,0,0.25)] [--dome:0vh]"
      style={{
        borderTopLeftRadius: "50% var(--dome)",
        borderTopRightRadius: "50% var(--dome)",
      }}
    >
      <div className="px-gutter mx-auto grid max-w-[1600px] items-center gap-y-12 pt-24 pb-24 lg:min-h-svh lg:grid-cols-12 lg:gap-x-10 lg:pt-28 lg:pb-20">
        {/* Başlık ve kategoriler */}
        <header className="lg:col-span-5 lg:row-start-1 lg:self-start">
          <p className="type-eyebrow flex items-center gap-3 text-brand">
            <span aria-hidden="true" className="h-px w-8 bg-brand" />
            01 — Menü
          </p>
          <h2 id="menu-baslik" className="type-serif mt-5 text-[clamp(2.5rem,4.2vw,4rem)] leading-none">
            Sofrada ne var?
          </h2>
          <div role="group" aria-label="Menü kategorileri" className="mt-8 flex flex-wrap gap-2">
            {categories.map((c) => {
              const isActive = c.id === active.category;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => selectCategory(c.id)}
                  className={`h-11 rounded-full border px-5 text-[0.9375rem] font-semibold transition-colors duration-300 ${
                    isActive
                      ? "border-ink bg-ink text-white"
                      : "border-ink/20 text-ink/70 hover:border-ink hover:text-ink"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </header>

        {/* Sini */}
        <div className="lg:col-span-7 lg:row-span-2 lg:row-start-1">
          <div
            className="relative mx-auto aspect-square w-full max-w-[min(78svh,760px)] touch-pan-y select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipeStart.current = null)}
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full text-ink" fill="none" aria-hidden="true">
              <circle cx="50" cy="50" r="49.6" stroke="currentColor" strokeOpacity="0.85" strokeWidth="0.25" />
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity="0.85" strokeWidth="0.25" />
            </svg>

            <div
              ref={wheelRef}
              className="absolute inset-0"
              style={{ transform: `rotate(${rotationFor(0)}deg)` }}
            >
              <RingText
                text={MENU_RING}
                radius={47.15}
                fontSize={2.25}
                className="absolute inset-0 h-full w-full text-ink"
                textClassName="type-ring"
              />
              {dishes.map((d, i) => {
                const angle = i * STEP;
                const isActive = d.id === activeId;
                return (
                  <div
                    key={d.id}
                    className="absolute top-1/2 left-1/2"
                    style={{
                      width: `${THUMB}%`,
                      height: `${THUMB}%`,
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${(RIM / THUMB) * 100}%) rotate(${-angle}deg)`,
                    }}
                  >
                    <button
                      type="button"
                      data-thumb
                      onClick={() => select(d.id)}
                      aria-pressed={isActive}
                      aria-label={d.name}
                      className="block size-full"
                      style={{ transform: `rotate(${-rotationFor(0)}deg)` }}
                    >
                      <span
                        className={`block size-full overflow-hidden rounded-full bg-stone transition-[transform,box-shadow] duration-700 ease-out-expo ${
                          isActive
                            ? "scale-[1.18] shadow-[0_0_0_3px_var(--color-paper),0_0_0_5px_var(--color-brand)]"
                            : "shadow-[0_0_0_3px_var(--color-paper)] hover:scale-110"
                        }`}
                      >
                        <Picture
                          id={d.media}
                          alt=""
                          sizes="120px"
                          className="block h-full w-full"
                          imgClassName="h-full w-full object-cover"
                        />
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Ortadaki tabak */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white p-[1.4%] shadow-[0_40px_80px_-30px_rgba(40,10,10,0.55)]"
              style={{ width: `${PLATE}%`, height: `${PLATE}%` }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-full bg-stone">
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
                      className="absolute inset-0"
                      style={{
                        zIndex: isActive ? 2 : isPrev ? 1 : 0,
                        visibility: isActive || isPrev ? "visible" : "hidden",
                      }}
                    >
                      <Picture
                        id={d.media}
                        sizes="(min-width: 1024px) 480px, 70vw"
                        className="block h-full w-full"
                        imgClassName="h-full w-full object-cover"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Siniyi geri çevir, önceki yemek"
              className="flex size-12 items-center justify-center rounded-full border border-ink/25 transition-colors hover:border-ink hover:bg-ink hover:text-white"
            >
              <ArrowRight className="rotate-180" />
            </button>
            <p aria-hidden="true" className="w-24 text-center font-serif text-xl italic tabular-nums">
              {pad(activeIndex + 1)} <span className="text-ink/40">/ {pad(dishes.length)}</span>
            </p>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Siniyi çevir, sonraki yemek"
              className="flex size-12 items-center justify-center rounded-full border border-ink/25 transition-colors hover:border-ink hover:bg-ink hover:text-white"
            >
              <ArrowRight />
            </button>
          </div>
        </div>

        {/* Seçili yemek */}
        <div className="lg:col-span-5 lg:row-start-2 lg:self-end">
          <div aria-live="polite" className="min-h-[11rem] lg:min-h-[13rem]">
            <p className="type-eyebrow text-[0.6875rem] text-ink/55">{category.label}</p>
            <h3
              key={active.id}
              lang={active.lang}
              className="type-display mt-3 text-[clamp(3rem,11vw,4.25rem)] lg:text-[clamp(3.25rem,5.4vw,6rem)]"
            >
              {active.name.split(" ").map((word, i) => (
                <span key={word} className="hero-line">
                  <span style={{ "--d": `${i * 0.07}s` } as React.CSSProperties}>{word}</span>
                </span>
              ))}
            </h3>
            <p
              key={`${active.id}-text`}
              className="hero-fade mt-4 max-w-[34ch] text-[1.125rem] leading-relaxed text-ink/75"
              style={{ "--d": "0.15s" } as React.CSSProperties}
            >
              {active.description}
            </p>
          </div>

          <div className="mt-8 border-t border-ink/15 pt-6">
            <p className="type-eyebrow flex flex-wrap items-center gap-3 text-[0.6875rem] text-ink/55">
              Ayrıca bu kategoride
              <CheckFlag note={menuCheck} />
            </p>
            <ul className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[1.0625rem] font-medium">
              {category.more.map((item, i) => (
                <li key={item} className="flex items-center gap-2">
                  {item}
                  {i < category.more.length - 1 && (
                    <span aria-hidden="true" className="text-brand">
                      •
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[0.9375rem] font-semibold">
            <a href={site.linksPage} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
              <span className="link-underline pb-0.5">Güncel menü ve sipariş</span>
              <ArrowUpRight size={16} className="text-brand" />
              <span className="sr-only">(yeni sekmede açılır)</span>
            </a>
            <a href={site.instagram.reels} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
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
