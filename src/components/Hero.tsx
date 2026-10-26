"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { heroVideo } from "@/data/media";
import { gsap, MOTION_OK, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { ArrowRight, PauseIcon, PlayIcon, SoundOffIcon, SoundOnIcon } from "./icons";

const scenes = heroVideo.scenes;

const sceneAt = (t: number) => {
  let i = 0;
  while (i < scenes.length - 1 && t >= scenes[i + 1].at) i++;
  return i;
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const userPaused = useRef(false);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [scene, setScene] = useState(0);

  // Hareket azaltma tercihi yoksa film sessiz başlar
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (prefersReducedMotion()) {
      userPaused.current = true;
      return;
    }
    v.play().catch(() => {
      /* tarayıcı otomatik oynatmayı engelledi; afiş görünür kalır */
    });
  }, []);

  // İlerleme çizgisi ve sahne altyazısı
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !playing) return;
    let raf = 0;
    const tick = () => {
      progressRef.current?.style.setProperty("--p", String(v.currentTime / (v.duration || 15)));
      const next = sceneAt(v.currentTime);
      setScene((prev) => (prev === next ? prev : next));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // Menü bölümü hero'nun üzerine kayarken derinlik efekti; tamamen kapanınca film durur
  useEffect(() => {
    const menu = document.getElementById("menu");
    if (!menu) return;

    const visibility = ScrollTrigger.create({
      trigger: menu,
      start: "top top",
      onEnter: () => videoRef.current?.pause(),
      onLeaveBack: () => {
        if (!userPaused.current) videoRef.current?.play().catch(() => {});
      },
    });

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap
        .timeline({
          scrollTrigger: { trigger: menu, start: "top bottom", end: "top top", scrub: true },
        })
        .to(mediaRef.current, { scale: 1.08, ease: "none" }, 0)
        .to(contentRef.current, { yPercent: -8, ease: "none" }, 0)
        .to(shadeRef.current, { opacity: 0.6, ease: "none" }, 0);
    });

    return () => {
      visibility.kill();
      mm.revert();
    };
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  }, []);

  const toggleSound = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted && v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    }
  }, []);

  const current = scenes[scene];

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-labelledby="hero-baslik"
      data-surface="dark"
      className="sticky top-0 h-svh min-h-[600px] w-full overflow-hidden bg-ink text-white"
    >
      <div ref={mediaRef} className="absolute inset-0 origin-[50%_35%]">
        <video
          ref={videoRef}
          className="h-full w-full object-cover object-[50%_42%]"
          poster={heroVideo.poster}
          muted
          loop
          playsInline
          preload="auto"
          aria-label="Başkent Aspava tanıtım filmi: ocakbaşı, döner, fırın ve salondan kareler"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onVolumeChange={(e) => setMuted(e.currentTarget.muted)}
        >
          <source src={heroVideo.src} type="video/mp4" />
        </video>
      </div>

      {/* Okunabilirlik için yalnızca kenarlardan karartma; görüntünün renkleri korunur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-black/50 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(12,10,10,0.85)_0%,rgba(12,10,10,0.5)_34%,rgba(12,10,10,0)_68%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(12,10,10,0.5)_0%,rgba(12,10,10,0)_50%)] lg:block"
      />
      <div ref={shadeRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black opacity-0" />

      <div
        ref={contentRef}
        className="px-gutter relative mx-auto flex h-full max-w-[1600px] flex-col justify-end pb-7 lg:pb-12"
      >
        <div className="grid items-end gap-x-10 gap-y-8 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <p
              className="hero-fade type-eyebrow mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-white/85 lg:mb-7"
              style={{ "--d": "0.15s" } as React.CSSProperties}
            >
              <span aria-hidden="true" className="h-px w-8 bg-brand" />
              <span className="hidden sm:inline">Restoran</span>
              <span aria-hidden="true" className="hidden text-white/50 sm:inline">
                /
              </span>
              İstanbul · Samsun · Amasya · Tokat
            </p>

            <h1
              id="hero-baslik"
              className="type-display text-[clamp(4.5rem,min(19vw,23svh),12.5rem)] drop-shadow-[0_2px_24px_rgba(0,0,0,0.25)]"
            >
              <span className="hero-line">
                <span style={{ "--d": "0.05s" } as React.CSSProperties}>Başkent</span>
              </span>
              <span className="hero-line">
                <span style={{ "--d": "0.16s" } as React.CSSProperties}>Aspava</span>
              </span>
            </h1>

            <p
              className="hero-fade type-serif mt-3 text-[clamp(2rem,4.4vw,3.75rem)] leading-none lg:mt-4"
              style={{ "--d": "0.45s" } as React.CSSProperties}
            >
              Lezzetin Başkenti<span className="text-brand">.</span>
            </p>

            <div
              className="hero-fade mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 lg:mt-10"
              style={{ "--d": "0.6s" } as React.CSSProperties}
            >
              <a
                href="#menu"
                className="group inline-flex h-14 items-center gap-4 bg-brand pr-5 pl-6 text-[0.95rem] font-semibold transition-colors duration-300 hover:bg-brand-deep"
              >
                Menüyü İncele
                <ArrowRight className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
              </a>
              <a
                href="#subeler"
                className="group inline-flex h-14 items-center gap-3 text-[0.95rem] font-semibold"
              >
                <span className="link-underline pb-1">Şubelerimizi Keşfet</span>
                <ArrowRight className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          <div
            className="hero-fade lg:col-span-3 lg:justify-self-end"
            style={{ "--d": "0.8s" } as React.CSSProperties}
          >
            <div className="flex items-end gap-5 border-t border-white/20 pt-4 lg:w-64 lg:flex-col lg:items-stretch lg:border-t-0 lg:pt-0">
              <div className="min-w-0 flex-1" aria-hidden="true">
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="type-eyebrow text-[0.6875rem] text-white/70">Tanıtım filmi</span>
                  <span className="font-serif text-base italic tabular-nums text-white/80">
                    {String(scene + 1).padStart(2, "0")} / {String(scenes.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="hidden h-px bg-white/25 lg:block">
                  <span ref={progressRef} className="progress-bar block h-px bg-white" />
                </div>
                <p key={current.label} className="hero-fade mt-2 truncate text-lg font-medium lg:mt-3">
                  {current.label}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={playing ? "Filmi durdur" : "Filmi oynat"}
                  title={playing ? "Durdur" : "Oynat"}
                  className="flex size-11 items-center justify-center rounded-full border border-white/40 transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
                >
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-label={muted ? "Sesi aç" : "Sesi kapat"}
                  aria-pressed={!muted}
                  title={muted ? "Sesi aç" : "Sesi kapat"}
                  className="flex size-11 items-center justify-center rounded-full border border-white/40 transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
                >
                  {muted ? <SoundOffIcon /> : <SoundOnIcon />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Markanın tanıtım filmlerindeki dua, sağ kenarda dikey */}
      <p
        aria-hidden="true"
        className="type-eyebrow absolute top-1/2 right-[clamp(0.75rem,1.4vw,1.5rem)] hidden -translate-y-1/2 rotate-180 text-[0.625rem] tracking-[0.34em] text-white/55 [writing-mode:vertical-rl] xl:block"
      >
        Allah Sağlık, Para, Afiyet Versin, Amin
      </p>
    </section>
  );
}
