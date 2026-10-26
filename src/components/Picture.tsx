import type { CSSProperties } from "react";
import { media, MEDIA_HEIGHT, MEDIA_WIDTH, type MediaId } from "@/data/media";

type Props = {
  id: MediaId;
  sizes: string;
  className?: string;
  imgClassName?: string;
  imgStyle?: CSSProperties;
  priority?: boolean;
  alt?: string;
};

const srcSet = (id: MediaId, ext: "avif" | "webp") =>
  `/media/${id}-480.${ext} 480w, /media/${id}-720.${ext} 720w`;

// Statik çıktı için görseller önceden AVIF/WebP olarak üretilir; tarayıcı uygun boyutu seçer.
export function Picture({ id, sizes, className, imgClassName, imgStyle, priority, alt }: Props) {
  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcSet(id, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(id, "webp")} sizes={sizes} />
      <img
        src={`/media/${id}-720.webp`}
        width={MEDIA_WIDTH}
        height={MEDIA_HEIGHT}
        alt={alt ?? media[id].alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        decoding="async"
        className={imgClassName}
        style={imgStyle}
      />
    </picture>
  );
}
