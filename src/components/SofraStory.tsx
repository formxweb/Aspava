import { branches } from "@/data/branches";
import type { MediaId } from "@/data/media";
import { site } from "@/data/site";
import { ArrowUpRight, InstagramIcon } from "./icons";
import { Picture } from "./Picture";
import { ScrollEffects } from "./ScrollEffects";

type Column = {
  letter: string;
  word: string;
  photo?: MediaId;
  title?: string;
  text: string;
};

// A·S·P·A·V·A — duanın her kelimesi sofranın bir sütunu
const columns: Column[] = [
  {
    letter: "A",
    word: "Allah",
    text: "Aspava adını bu duanın baş harflerinden alır. Başkent Aspava'da her sofra aynı dilekle kurulur: misafir doysun, bereket eksik olmasın.",
  },
  {
    letter: "S",
    word: "Sağlık",
    photo: "mangal",
    title: "Ateş",
    text: "Kebaplar kömür ateşinin başında, ustasının gözü önünde pişer.",
  },
  {
    letter: "P",
    word: "Para",
    photo: "firin",
    title: "Fırın",
    text: "Lahmacun fırının ateşinden çıkar çıkmaz masaya gelir.",
  },
  {
    letter: "A",
    word: "Afiyet",
    photo: "patlicanli-kebap",
    title: "Tereyağı",
    text: "Patlıcanlı kebabın üzerine sofrada, kızgın kızgın dökülür.",
  },
  {
    letter: "V",
    word: "Versin",
    photo: "salon-bayrak",
    title: "Salon",
    text: "Bayrağın altında, kalabalık ve sıcak bir sofra.",
  },
  {
    letter: "A",
    word: "Amin",
    photo: "salon-misafir",
    title: "Sofra",
    text: "Aspava geleneğinde yemek, tatlı ve çayla tamamlanır.",
  },
];

// Sütunların dikey ritmi (masaüstü)
const offsets = ["lg:mt-0", "lg:mt-24", "lg:mt-6", "lg:mt-32", "lg:mt-12", "lg:mt-40"];

export function SofraStory() {
  const cities = branches.map((b) => b.city);

  return (
    <section id="sofra" aria-labelledby="sofra-baslik" className="relative z-10 overflow-hidden bg-white">
      <ScrollEffects scope="sofra" />

      <div className="px-gutter mx-auto max-w-[1600px] pt-24 pb-28 lg:pt-36 lg:pb-40">
        <div className="grid gap-y-8 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-8">
            <p className="type-eyebrow flex items-center gap-3 text-brand">
              <span aria-hidden="true" className="h-px w-8 bg-brand" />
              02 — Aspava Sofrası
            </p>
            <h2
              id="sofra-baslik"
              data-reveal="text"
              className="type-serif mt-6 max-w-[18ch] text-[clamp(2.4rem,5vw,4.75rem)] leading-[1.02]"
            >
              Allah sağlık, para, afiyet versin. <span className="text-brand">Amin.</span>
            </h2>
          </div>
          <p
            data-reveal="text"
            className="max-w-[32ch] text-[1.0625rem] leading-relaxed text-ink/70 lg:col-span-3 lg:col-start-10 lg:self-end"
          >
            Baş harfleri yan yana gelince bir isim çıkar. Sofranın altı sütunu, altı kelime.
          </p>
        </div>

        <div className="no-scrollbar -mx-[clamp(1rem,4.2vw,3.75rem)] mt-14 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1rem,4.2vw,3.75rem)] pb-4 lg:mx-0 lg:mt-20 lg:grid lg:grid-cols-6 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
          {columns.map((c, i) => (
            <article
              key={c.word}
              className={`w-[68vw] shrink-0 snap-start sm:w-[42vw] lg:w-auto ${offsets[i]}`}
            >
              <p
                aria-hidden="true"
                data-reveal="letter"
                data-delay={i * 0.06}
                className="type-display text-center text-[clamp(7rem,11.5vw,12.5rem)] leading-[0.78] text-brand"
              >
                {c.letter}
              </p>
              <p className="type-eyebrow mt-4 text-center text-ink">{c.word}</p>

              {c.photo ? (
                <figure className="mt-6">
                  <div data-reveal="arch" className="aspect-[3/4] overflow-hidden rounded-t-full bg-stone">
                    <Picture
                      id={c.photo}
                      sizes="(min-width: 1024px) 16vw, 68vw"
                      className="block h-full w-full"
                      imgClassName="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-4 text-[0.9375rem] leading-relaxed text-ink/75">
                    <span className="font-semibold text-ink">{c.title}.</span> {c.text}
                  </figcaption>
                </figure>
              ) : (
                <div className="mt-6 flex aspect-[3/4] flex-col justify-between rounded-t-full bg-brand px-5 pt-[38%] pb-6 text-white">
                  <p className="type-serif text-center text-[1.75rem] leading-none">A·S·P·A·V·A</p>
                  <p className="text-[0.9375rem] leading-relaxed text-white/90">{c.text}</p>
                </div>
              )}
            </article>
          ))}
        </div>

        <div className="mt-20 grid gap-10 border-t border-ink/10 pt-12 lg:mt-48 lg:grid-cols-12 lg:gap-x-8 lg:pt-16">
          <p data-reveal="text" className="type-serif text-[clamp(2.1rem,4.4vw,4.25rem)] leading-[1.04] lg:col-span-8">
            {cities.slice(0, -1).join(", ")} ve {cities.at(-1)}
            <span className="text-ink/45">: aynı sofra, aynı dua.</span>
          </p>
          <div data-reveal="text" className="lg:col-span-3 lg:col-start-10 lg:self-end">
            <a
              href={site.instagram.reels}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 rounded-full border border-ink py-3 pr-4 pl-5 text-[0.9375rem] font-semibold transition-colors hover:bg-ink hover:text-white"
            >
              <span className="flex items-center gap-3">
                <InstagramIcon />
                Sofradan kareler
              </span>
              <ArrowUpRight className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <span className="sr-only">(Instagram yeni sekmede açılır)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
