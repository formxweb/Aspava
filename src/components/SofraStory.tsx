import { branches } from "@/data/branches";
import type { MediaId } from "@/data/media";
import { site } from "@/data/site";
import { ArrowUpRight, InstagramIcon } from "./icons";
import { Picture } from "./Picture";
import { ScrollEffects } from "./ScrollEffects";

const prayerLines = [
  ["Allah", "Sağlık,"],
  ["Para,", "Afiyet"],
  ["Versin.", "Amin."],
];

function Photo({
  id,
  sizes,
  aspect,
  position = "50% 50%",
  caption,
  parallax,
}: {
  id: MediaId;
  sizes: string;
  aspect: string;
  position?: string;
  caption: string;
  parallax?: number;
}) {
  return (
    <figure data-parallax={parallax}>
      <div data-reveal="image" className={`overflow-hidden bg-stone ${aspect}`}>
        <Picture
          id={id}
          sizes={sizes}
          className="block h-full w-full"
          imgClassName="h-full w-full object-cover"
          imgStyle={{ objectPosition: position }}
        />
      </div>
      <figcaption className="mt-3 flex items-center gap-3 text-[0.875rem] text-ink/70">
        <span aria-hidden="true" className="h-px w-5 bg-brand" />
        {caption}
      </figcaption>
    </figure>
  );
}

export function SofraStory() {
  const cities = branches.map((b) => b.city);

  return (
    <section id="sofra" aria-labelledby="sofra-baslik" className="relative z-10 overflow-hidden bg-white">
      <ScrollEffects scope="sofra" />

      <div className="px-gutter mx-auto max-w-[1600px] pt-24 pb-28 lg:pt-36 lg:pb-44">
        {/* Açılış: Aspava adının kaynağı */}
        <div className="grid gap-y-14 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-7">
            <p className="type-eyebrow flex items-center gap-3 text-brand">
              <span aria-hidden="true" className="h-px w-8 bg-brand" />
              02 — Aspava Sofrası
            </p>

            <h2
              id="sofra-baslik"
              className="type-display mt-8 text-[clamp(3.1rem,8.2vw,8.75rem)] lg:mt-12"
            >
              {prayerLines.map((line) => (
                <span key={line.join(" ")} data-reveal="text" className="block">
                  {line.map((word, i) => (
                    <span key={word}>
                      {i > 0 && " "}
                      <span className="text-brand">{word[0]}</span>
                      {word.slice(1)}
                    </span>
                  ))}
                </span>
              ))}
            </h2>

            <div data-reveal="text" className="mt-10 grid max-w-[40rem] gap-6 sm:grid-cols-[auto_1fr] sm:gap-10 lg:mt-14">
              <p className="type-serif text-[2.5rem] leading-none text-brand" aria-hidden="true">
                A·S·P·A·V·A
              </p>
              <p className="text-[1.125rem] leading-relaxed text-ink/80">
                Aspava adını bu duanın baş harflerinden alır. Başkent Aspava&apos;da her sofra
                aynı dilekle kurulur: misafir doysun, bereket eksik olmasın.
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 lg:col-start-9 lg:pt-40">
            <Photo
              id="mangal"
              aspect="aspect-[3/4]"
              sizes="(min-width: 1024px) 30vw, 90vw"
              caption="Ocakbaşı — kömür ateşinde şişler"
              parallax={0.12}
            />
          </div>
        </div>

        {/* Ateş ve fırın */}
        <div className="mt-24 grid gap-y-14 lg:mt-40 lg:grid-cols-12 lg:gap-x-8">
          <div className="w-[78%] sm:w-[60%] lg:col-span-4 lg:col-start-2 lg:w-auto">
            <Photo
              id="firin"
              aspect="aspect-[4/5]"
              position="50% 70%"
              sizes="(min-width: 1024px) 30vw, 70vw"
              caption="Fırın — lahmacun ateşe veriliyor"
            />
          </div>

          <div className="flex flex-col justify-end gap-12 lg:col-span-5 lg:col-start-7 lg:pb-8">
            <article data-reveal="text" className="grid grid-cols-[3.5rem_1fr] gap-x-4">
              <span className="type-serif pt-1 text-2xl text-brand">i.</span>
              <div>
                <h3 className="type-display text-[2.5rem]">Ateş</h3>
                <p className="mt-3 max-w-[38ch] text-[1.0625rem] leading-relaxed text-ink/75">
                  Kebaplar kömür ateşinin başında, ustasının gözü önünde pişer. Patlıcan közde
                  yumuşar; tereyağı sofrada, tabağın üzerine dökülür.
                </p>
              </div>
            </article>
            <article data-reveal="text" className="grid grid-cols-[3.5rem_1fr] gap-x-4">
              <span className="type-serif pt-1 text-2xl text-brand">ii.</span>
              <div>
                <h3 className="type-display text-[2.5rem]">Fırın</h3>
                <p className="mt-3 max-w-[38ch] text-[1.0625rem] leading-relaxed text-ink/75">
                  Lahmacun fırının ateşinden çıkar çıkmaz masaya gelir; maydanozu, limonu
                  yanında.
                </p>
              </div>
            </article>
          </div>
        </div>

        {/* Salon */}
        <div className="mt-24 grid gap-y-10 lg:mt-40 lg:grid-cols-12 lg:gap-x-8">
          <div className="-mx-[clamp(1rem,4.2vw,3.75rem)] lg:col-span-7 lg:mx-0">
            <Photo
              id="salon-bayrak"
              aspect="aspect-[5/4]"
              position="50% 30%"
              sizes="(min-width: 1024px) 55vw, 100vw"
              caption="Salon — bayrağın altında aynı sofra"
            />
          </div>

          <div className="flex flex-col gap-12 lg:col-span-4 lg:col-start-9">
            <div className="ml-auto w-[62%] sm:w-[45%] lg:-mt-28 lg:w-[72%]">
              <Photo
                id="salon-misafir"
                aspect="aspect-[3/4]"
                position="50% 60%"
                sizes="(min-width: 1024px) 22vw, 60vw"
                caption="Misafirlerimiz"
                parallax={0.16}
              />
            </div>
            <article data-reveal="text" className="grid grid-cols-[3.5rem_1fr] gap-x-4 lg:mt-auto">
              <span className="type-serif pt-1 text-2xl text-brand">iii.</span>
              <div>
                <h3 className="type-display text-[2.5rem]">Sofra</h3>
                <p className="mt-3 max-w-[38ch] text-[1.0625rem] leading-relaxed text-ink/75">
                  Aspava geleneğinde misafir, kurulmuş bir sofrayla karşılanır; yemek, tatlı ve
                  çayla tamamlanır.
                </p>
              </div>
            </article>
          </div>
        </div>

        {/* Kapanış */}
        <div className="mt-28 border-t border-ink/10 pt-12 lg:mt-44 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:pt-16">
          <p
            data-reveal="text"
            className="type-serif text-[clamp(2.25rem,5vw,4.75rem)] leading-[1.02] lg:col-span-8"
          >
            {cities.slice(0, -1).join(", ")} ve {cities.at(-1)}
            <span className="text-ink/45">: aynı sofra, aynı dua.</span>
          </p>
          <div data-reveal="text" className="mt-10 lg:col-span-3 lg:col-start-10 lg:mt-0 lg:self-end">
            <a
              href={site.instagram.reels}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-4 border-b border-ink py-4 text-[1rem] font-semibold transition-colors hover:text-brand"
            >
              <span className="flex items-center gap-3">
                <InstagramIcon />
                Sofradan kareler: @{site.instagram.handle}
              </span>
              <ArrowUpRight className="transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <span className="sr-only">(yeni sekmede açılır)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
