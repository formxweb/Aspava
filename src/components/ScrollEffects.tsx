"use client";

import { useEffect } from "react";
import { gsap, MOTION_OK } from "@/lib/gsap";

// Sunucuda üretilen bölümlere kaydırma animasyonu ekler.
// data-reveal="image" → görsel aşağıdan açılır, data-reveal="text" → metin yükselir,
// data-parallax="0.1" → görsel kaydırmaya göre hafifçe kayar.
export function ScrollEffects({ scope }: { scope: string }) {
  useEffect(() => {
    const root = document.getElementById(scope);
    if (!root) return;
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      root.querySelectorAll<HTMLElement>("[data-reveal='image']").forEach((el) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
        tl.fromTo(
          el,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out" },
        ).fromTo(
          el.querySelector("img"),
          { scale: 1.18 },
          { scale: 1, duration: 1.8, ease: "expo.out" },
          0,
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

      root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax) || 0.1;
        gsap.fromTo(
          el,
          { yPercent: amount * 50 },
          {
            yPercent: -amount * 50,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });

    return () => mm.revert();
  }, [scope]);

  return null;
}
