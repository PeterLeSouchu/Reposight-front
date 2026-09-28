"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = { id: string; title: string };

// Hauteur (depuis le haut de l'écran) à partir de laquelle une section devient active
const ACTIVATION_OFFSET = 160;

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const updateActive = () => {
      const sections = items
        .map((item) => document.getElementById(item.id))
        .filter((section): section is HTMLElement => section !== null);
      if (sections.length === 0) return;

      // En bas de page, la dernière section est active même si elle est courte
      const last = sections[sections.length - 1];
      if (last.getBoundingClientRect().bottom <= window.innerHeight) {
        setActiveId(last.id);
        return;
      }

      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= ACTIVATION_OFFSET) {
          current = section.id;
        }
      }
      setActiveId(current);
    };

    updateActive();
    // Capture : le body est le conteneur de scroll (voir globals.css), pas window
    document.addEventListener("scroll", updateActive, { capture: true, passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      document.removeEventListener("scroll", updateActive, { capture: true });
      window.removeEventListener("resize", updateActive);
    };
  }, [items]);

  return (
    <nav aria-label="Sommaire" className="sticky top-28">
      <p className="text-sm font-semibold">Sommaire</p>
      <ol className="mt-4 space-y-1 border-l border-iris-200 text-sm">
        {items.map((item, i) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id} className="relative">
              {isActive && (
                <motion.span
                  layoutId="toc-indicator"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  className="absolute -left-px inset-y-0 w-0.5 rounded-full bg-iris-600"
                />
              )}
              <a
                href={`#${item.id}`}
                onClick={() => setActiveId(item.id)}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "block py-1.5 pl-4 transition-colors",
                  isActive
                    ? "font-medium text-iris-700"
                    : "text-ink/55 hover:text-ink"
                )}
              >
                {i + 1}. {item.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
