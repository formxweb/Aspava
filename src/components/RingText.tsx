import { useId } from "react";

type Props = {
  text: string;
  // viewBox 100×100 içinde yarıçap
  radius?: number;
  fontSize?: number;
  className?: string;
  textClassName?: string;
};

// Logodaki mühür gibi: metni bir çemberin etrafına tam tur dizer.
export function RingText({ text, radius = 46, fontSize = 4, className, textClassName }: Props) {
  const id = `ring-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const r = radius;
  const circumference = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <defs>
        <path id={id} d={`M 50 ${50 - r} a ${r} ${r} 0 1 1 0 ${2 * r} a ${r} ${r} 0 1 1 0 ${-2 * r}`} />
      </defs>
      <text fontSize={fontSize} fill="currentColor" className={textClassName}>
        <textPath href={`#${id}`} textLength={circumference - fontSize * 0.4} lengthAdjust="spacing">
          {text}
        </textPath>
      </text>
    </svg>
  );
}
