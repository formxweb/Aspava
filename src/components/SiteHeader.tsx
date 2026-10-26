"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { branches } from "@/data/branches";
import { sections, site } from "@/data/site";
import { ArrowRight, InstagramIcon } from "./icons";
import { asset } from "@/lib/asset";

export function SiteHeader() {
  const [onHero, setOnHero] = useState(true);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Hero'nun üzerindeyken şeffaf, sonrasında düz zemin
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setOnHero(window.scrollY < window.innerHeight - 72);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Görünen bölümü navigasyonda işaretle
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  // Mobil menü: kaydırmayı kilitle, Esc ile kapat, odağı panel içinde tut
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panel) return;
      const items = panel.querySelectorAll<HTMLElement>("a, button");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const solid = !onHero;

  return (
    <header
      data-surface={solid ? "light" : "dark"}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color] duration-500 ${
        solid ? "border-b border-ink/10 bg-paper text-ink" : "border-b border-transparent text-white"
      }`}
    >
      <div className="px-gutter mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-6">
        <a href="#top" className="group flex items-center gap-3" aria-label="Başkent Aspava, sayfa başı">
          <picture>
            <source srcSet={asset("/brand/baskent-aspava-logo.webp")} type="image/webp" />
            <img
              src={asset("/brand/baskent-aspava-logo.png")}
              alt=""
              width={44}
              height={44}
              className="size-10 transition-transform duration-500 ease-out-expo group-hover:rotate-[-8deg] lg:size-11"
            />
          </picture>
          <span className="type-display text-[1.2rem] leading-none tracking-[0.02em]">
            Başkent Aspava
          </span>
        </a>

        <nav aria-label="Ana menü" className="hidden lg:block">
          <ul className="flex items-center gap-10">
            {sections.map((s) => {
              const isActive = active === s.id && solid;
              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className="group relative flex items-baseline gap-2 py-2 text-[0.9rem] font-medium"
                  >
                    <span
                      className={`font-serif text-[0.95rem] italic transition-colors ${
                        isActive ? "text-brand" : "opacity-60"
                      }`}
                    >
                      {s.index}
                    </span>
                    {s.label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current transition-transform duration-500 ease-out-expo ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden size-11 items-center justify-center rounded-full transition-colors hover:bg-current/10 sm:flex"
            aria-label="Instagram: @baskent_aspava (yeni sekmede açılır)"
          >
            <InstagramIcon />
          </a>
          <a
            href="#subeler"
            className="hidden h-11 items-center gap-2 bg-brand px-5 text-[0.875rem] font-semibold text-white transition-colors hover:bg-brand-deep sm:flex"
          >
            Yol Tarifi
            <ArrowRight size={16} />
          </a>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobil-menu"
            className="flex h-11 items-center gap-3 pl-3 text-[0.875rem] font-semibold lg:hidden"
          >
            Menü
            <span aria-hidden="true" className="flex w-6 flex-col gap-[5px]">
              <span className="h-[1.5px] w-full bg-current" />
              <span className="h-[1.5px] w-2/3 self-end bg-current" />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          id="mobil-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menüsü"
          data-surface="brand"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-brand text-white lg:hidden"
        >
          <div className="px-gutter flex h-16 shrink-0 items-center justify-between">
            <span className="type-display text-[1.2rem] tracking-[0.02em]">Başkent Aspava</span>
            <button
              type="button"
              onClick={close}
              className="flex h-11 items-center gap-3 text-[0.875rem] font-semibold"
            >
              Kapat
              <span aria-hidden="true" className="relative block size-5">
                <span className="absolute top-1/2 left-0 h-[1.5px] w-full rotate-45 bg-current" />
                <span className="absolute top-1/2 left-0 h-[1.5px] w-full -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          <nav aria-label="Mobil menü" className="px-gutter flex-1 pt-8">
            <ul className="flex flex-col">
              {sections.map((s, i) => (
                <li key={s.id} className="border-b border-white/25">
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="hero-fade flex items-baseline justify-between py-4"
                    style={{ "--d": `${0.05 + i * 0.06}s` } as React.CSSProperties}
                  >
                    <span className="type-display text-[clamp(2.5rem,11.5vw,3.5rem)]">{s.label}</span>
                    <span className="font-serif text-xl italic opacity-80">{s.index}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-gutter grid grid-cols-2 gap-x-4 gap-y-5 pt-10 pb-10 text-[0.9rem]">
            {branches.map((b) => (
              <div key={b.id}>
                <p className="type-eyebrow mb-2 text-white/75">{b.city}</p>
                <a href={`tel:${b.phone.value.tel}`} className="link-underline font-medium">
                  {b.phone.value.display}
                </a>
              </div>
            ))}
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-2 mt-2 flex items-center gap-3 font-medium"
            >
              <InstagramIcon />@{site.instagram.handle}
              <span className="sr-only">(yeni sekmede açılır)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
