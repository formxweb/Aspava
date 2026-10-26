import { SHOW_CHECKS } from "@/data/branches";

// Kaynağı doğrulanamayan bilgilerin yanında görünen geçici işaret.
export function CheckFlag({ note, className = "" }: { note?: string; className?: string }) {
  if (!note || !SHOW_CHECKS) return null;
  return (
    <span className={`check-flag ${className}`} title={note}>
      <svg aria-hidden="true" width="9" height="9" viewBox="0 0 10 10">
        <path d="M5 0.8 9.6 9.2H0.4Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M5 4v2.4M5 7.4v.4" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      Doğrulanmalı
      <span className="sr-only">: {note}</span>
    </span>
  );
}
