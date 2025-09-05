"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  images: string[];            
  className?: string;        
  autoPlay?: boolean;
  intervalMs?: number;
  alt?: string;
};

export default function MobileScreensImgCarousel({
  images,
  className = "",
  autoPlay = true,
  intervalMs = 3000,
  alt = "App screen",
}: Props) {
  const slides = useMemo(() => Array.from(new Set(images)), [images]);
  const [current, setCurrent] = useState(0);
  const hasMany = slides.length > 1;

  const goPrev = () => setCurrent(p => (p === 0 ? slides.length - 1 : p - 1));
  const goNext = () => setCurrent(p => (p === slides.length - 1 ? 0 : p + 1));

  // autoplay
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!autoPlay || !hasMany) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(goNext, intervalMs);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoPlay, hasMany, intervalMs, goNext]);

  // swipe
  const startX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => (startX.current = e.clientX);
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current === null) return;
    const delta = e.clientX - startX.current;
    if (Math.abs(delta) > 40) (delta > 0 ? goPrev() : goNext());
    startX.current = null;
  };

  return (
    <div className="relative p-4">
      <div className={`relative overflow-hidden ${className}`}>
        <div
          className="flex h-full w-full transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {slides.map((src) => (
            <div key={src} className="min-w-full h-full grid place-items-center bg-black">
              <img
                src={src}
                alt={alt}
                className="max-h-full max-w-full object-contain select-none"
                draggable={false}
                loading="eager"
                onDragStart={(e) => e.preventDefault()}
              />
            </div>
          ))}
        </div>
      </div>
      {hasMany && (
        <>
          <button
            aria-label="Previous"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 text-white px-2 py-1"
          >
            ‹
          </button>
          <button
            aria-label="Next"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 text-white px-2 py-1"
          >
            ›
          </button>
          <div className="absolute -bottom-2 left-0 right-0 flex justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 w-1.5 rounded-full ${i === current ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
