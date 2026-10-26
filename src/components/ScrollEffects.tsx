"use client";

import { useEffect } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

// Sunucuda üretilen bölümlere kaydırma animasyonu ekler.
// data-reveal="arch"   → kemerli görsel aşağıdan yukarı açılır
// data-reveal="letter" → harf yükselir (data-delay ile sıralı)
// data-reveal="text"   → metin yükselir
export function ScrollEffects({ scope }: { scope: string }) {
  useEffect(() => {
    const root = document.getElementById(scope);
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      root.querySelectorAll<HTMLElement>("[data-reveal='arch']").forEach((el) => {
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top 90%", once: true } })
          .fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out" },
          )
          .fromTo(el.querySelector("img"), { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0);
      });

      root.querySelectorAll<HTMLElement>("[data-reveal='letter']").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 40, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 1.2,
            delay: Number(el.dataset.delay) || 0,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-reveal='text']").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      });
    });

    return () => mm.revert();
  }, [scope]);

  return null;
}
