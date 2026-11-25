"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Chip {
  key: string;
  label: string;
}

/** YouTube's horizontally scrolling chip row, with arrow buttons that appear when there's more to scroll. */
export default function ChipBar({
  chips,
  active,
  onSelect,
  className = "",
}: {
  chips: Chip[];
  active: string;
  onSelect: (key: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({ left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const scroll = (dir: number) => ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  return (
    <div className={`relative ${className}`}>
      <div ref={ref} className="no-scrollbar flex gap-3 overflow-x-auto">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => onSelect(c.key)}
            className={`h-8 shrink-0 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition-colors ${
              active === c.key ? "bg-fg text-bg" : "bg-hover hover:bg-hover-strong"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      {edges.left && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex w-24 items-center bg-gradient-to-r from-bg from-50% to-transparent">
          <button
            onClick={() => scroll(-1)}
            aria-label="Previous"
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full hover:bg-hover"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </div>
      )}
      {edges.right && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex w-24 items-center justify-end bg-gradient-to-l from-bg from-50% to-transparent">
          <button
            onClick={() => scroll(1)}
            aria-label="Next"
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full hover:bg-hover"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </div>
  );
}
