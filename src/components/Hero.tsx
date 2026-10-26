"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { heroVideo } from "@/data/media";
import { gsap, MOTION_OK, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { ArrowRight, PauseIcon, PlayIcon, SoundOffIcon, SoundOnIcon } from "./icons";
import { RingText } from "./RingText";

const scenes = heroVideo.scenes;
const RING = "İSTANBUL • SAMSUN • AMASYA • TOKAT • ALLAH SAĞLIK, PARA, AFİYET VERSİN, AMİN • ";
const PROGRESS_R = 22;
const PROGRESS_C = 2 * Math.PI * PROGRESS_R;

const sceneAt = (t: number) => {
  let i = 0;
  while (i < scenes.length - 1 && t >= scenes[i + 1].at) i++;
  return i;
};

export function Hero() {
  const mediaRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);
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

  // Oynat düğmesinin çevresindeki ilerleme halkası ve sahne adı
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !playing) return;
    let raf = 0;
    const tick = () => {
      const p = v.currentTime / (v.duration || 15);
      progressRef.current?.setAttribute("stroke-dashoffset", String(PROGRESS_C * (1 - p)));
      const next = sceneAt(v.currentTime);
      setScene((prev) => (prev === next ? prev : next));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // Menü bölümü hero'nun üzerine yükselirken mühür büyür; tamamen kapanınca film durur
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
        .to(mediaRef.current, { scale: 1.1, ease: "none" }, 0)
        .to(sealRef.current, { scale: 1.45, rotate: 40, opacity: 0, ease: "none" }, 0)
        .to(titleRef.current, { yPercent: -18, opacity: 0.4, ease: "none" }, 0)
        .to(shadeRef.current, { opacity: 0.55, ease: "none" }, 0);
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
      aria-labelledby="hero-baslik"
      data-surface="dark"
      className="sticky top-0 h-svh min-h-[620px] w-full overflow-hidden bg-ink text-white"
    >
      <div ref={mediaRef} className="absolute inset-0">
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

      {/* Yazının okunması için merkezden kenarlara hafif karartma; renkler korunur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(12,10,10,0.42)_0%,rgba(12,10,10,0.5)_45%,rgba(12,10,10,0.78)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent"
      />
      <div ref={shadeRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black opacity-0" />

      {/* Mühür: logodaki halka, kampanya ölçeğinde */}
      <div className="absolute inset-0 flex items-center justify-center px-4 pt-10 pb-20">
        <div className="relative grid aspect-square w-[min(78svh,94vw)] max-w-[800px] place-items-center">
          <div ref={sealRef} aria-hidden="true" className="absolute inset-0">
            <div className="hero-fade absolute inset-0" style={{ "--d": "0.35s" } as React.CSSProperties}>
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none">
                <circle cx="50" cy="50" r="49.7" stroke="currentColor" strokeOpacity="0.6" strokeWidth="0.22" />
                <circle cx="50" cy="50" r="41.6" stroke="currentColor" strokeOpacity="0.6" strokeWidth="0.22" />
              </svg>
              <RingText
                text={RING}
                radius={44.3}
                fontSize={3.1}
                className="ring-spin absolute inset-0 h-full w-full text-white/90"
                textClassName="type-ring"
              />
            </div>
          </div>

          <div ref={titleRef} className="relative text-center">
            <h1
              id="hero-baslik"
              className="type-display text-[clamp(4rem,min(15vw,15svh),9.5rem)] leading-[0.8] drop-shadow-[0_2px_30px_rgba(0,0,0,0.35)]"
            >
              <span className="hero-line">
                <span style={{ "--d": "0.05s" } as React.CSSProperties}>Başkent</span>
              </span>
              <span className="hero-line">
                <span style={{ "--d": "0.16s" } as React.CSSProperties}>Aspava</span>
              </span>
            </h1>
            <p
              className="hero-fade type-serif mt-3 text-[clamp(1.6rem,3.3vw,2.85rem)] leading-none"
              style={{ "--d": "0.5s" } as React.CSSProperties}
            >
              Lezzetin Başkenti<span className="text-brand">.</span>
            </p>
          </div>

          {/* Bağlantılar halkanın alt kenarına mühür gibi basılı */}
          <div
            className="hero-fade absolute bottom-0 left-1/2 flex -translate-x-1/2 translate-y-1/2 gap-2 sm:gap-3"
            style={{ "--d": "0.7s" } as React.CSSProperties}
          >
            <a
              href="#menu"
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-brand pr-4 pl-5 text-[0.875rem] font-semibold whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-colors duration-300 hover:bg-brand-deep sm:h-14 sm:pr-5 sm:pl-7 sm:text-[0.95rem]"
            >
              Menüyü İncele
              <ArrowRight size={16} className="transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            </a>
            <a
              href="#subeler"
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-white pr-4 pl-5 text-[0.875rem] font-semibold whitespace-nowrap text-ink shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-colors duration-300 hover:bg-paper sm:h-14 sm:pr-5 sm:pl-7 sm:text-[0.95rem]"
            >
              Şubelerimizi Keşfet
              <ArrowRight size={16} className="text-brand transition-transform duration-500 ease-out-expo group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Film kontrolleri */}
      <div className="px-gutter absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 pb-5 lg:pb-8">
        <div className="hero-fade flex items-center gap-4" style={{ "--d": "0.9s" } as React.CSSProperties}>
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? "Filmi durdur" : "Filmi oynat"}
            title={playing ? "Durdur" : "Oynat"}
            className="relative flex size-12 shrink-0 items-center justify-center rounded-full transition-colors duration-300 hover:bg-white hover:text-ink"
          >
            <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90" aria-hidden="true">
              <circle cx="24" cy="24" r={PROGRESS_R} fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.2" />
              <circle
                ref={progressRef}
                cx="24"
                cy="24"
                r={PROGRESS_R}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeDasharray={PROGRESS_C}
                strokeDashoffset={PROGRESS_C}
              />
            </svg>
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <div aria-hidden="true" className="min-w-0">
            <p className="type-eyebrow text-[0.625rem] text-white/65">
              Tanıtım filmi · {String(scene + 1).padStart(2, "0")}/{String(scenes.length).padStart(2, "0")}
            </p>
            <p key={current.label} className="hero-fade mt-1.5 truncate text-[0.95rem] font-medium">
              {current.label}
            </p>
          </div>
        </div>

        <div className="hero-fade flex items-center gap-5" style={{ "--d": "0.9s" } as React.CSSProperties}>
          <p aria-hidden="true" className="type-eyebrow hidden text-[0.625rem] text-white/65 md:block">
            Kaydırın — sofra kuruluyor
          </p>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={muted ? "Sesi aç" : "Sesi kapat"}
            aria-pressed={!muted}
            title={muted ? "Sesi aç" : "Sesi kapat"}
            className="flex size-12 items-center justify-center rounded-full border border-white/35 transition-colors duration-300 hover:border-white hover:bg-white hover:text-ink"
          >
            {muted ? <SoundOffIcon /> : <SoundOnIcon />}
          </button>
        </div>
      </div>
    </section>
  );
}
