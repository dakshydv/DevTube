"use client";

import { useEffect, useState, type ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";

export interface FilterColumn {
  key: string;
  title: string;
  options: { value: string; label: string }[];
  /** Sort-style columns always have exactly one value selected and can't be cleared. */
  required?: boolean;
}

/**
 * YouTube-style "Filters" button that expands into columns of options (Upload date, Type, Duration, …).
 * One choice per column; clicking the selected option again clears it.
 */
export default function FilterPanel({
  columns,
  values,
  onChange,
  onClear,
  extra,
}: {
  columns: FilterColumn[];
  values: Record<string, string | null | undefined>;
  onChange: (key: string, value: string | null) => void;
  onClear: () => void;
  /** Rendered to the right of the Filters button (e.g. level chips). */
  extra?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const active = columns.filter((c) => !c.required && values[c.key]).length;

  // The filter bar is sticky, so close the panel once you scroll away instead of letting it cover the results.
  useEffect(() => {
    if (!open) return;
    const start = window.scrollY;
    const onScroll = () => Math.abs(window.scrollY - start) > 250 && setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  return (
    <div>
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className={`inline-flex h-8 shrink-0 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors ${
            open ? "bg-fg text-bg" : "bg-hover hover:bg-hover-strong"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {active > 0 && (
            <span
              className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs ${
                open ? "bg-bg text-fg" : "bg-fg text-bg"
              }`}
            >
              {active}
            </span>
          )}
        </button>
        {active > 0 && (
          <button
            onClick={onClear}
            aria-label="Clear filters"
            className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full px-2 text-sm text-muted hover:bg-hover hover:text-fg sm:px-3"
          >
            <X className="h-4 w-4" /> <span className="hidden sm:inline">Clear filters</span>
          </button>
        )}
        {extra}
      </div>

      {open && (
        <div
          className={`no-scrollbar mt-4 grid max-h-[60vh] grid-cols-2 gap-x-6 gap-y-6 overflow-y-auto overscroll-contain border-b border-line pb-5 sm:grid-cols-3 lg:max-h-none lg:gap-x-8 lg:overflow-visible ${
            columns.length >= 6 ? "lg:grid-cols-6" : "lg:grid-cols-5"
          }`}
        >
          {columns.map((col) => (
            <div key={col.key}>
              <h3 className="border-b border-line pb-2 text-xs font-medium uppercase tracking-wider text-muted">
                {col.title}
              </h3>
              <ul className="mt-3 flex flex-col gap-1">
                {col.options.map((o) => {
                  const selected = values[col.key] === o.value;
                  return (
                    <li key={o.value}>
                      <button
                        onClick={() => onChange(col.key, selected && !col.required ? null : o.value)}
                        className={`w-full py-1 text-left text-sm transition-colors ${
                          selected ? "font-medium text-fg" : "text-muted hover:text-fg"
                        }`}
                      >
                        {o.label}
                        {selected && !col.required && <X className="ml-1.5 inline h-3 w-3 opacity-70" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
