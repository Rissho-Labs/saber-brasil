"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/ui/profile-card";
import { FeaturedProfilesBySphere } from "@/lib/services/profiles";
import { SphereType } from "@/types";

const AUTOPLAY_MS = 5000;

const SPHERES: { type: SphereType; label: string; emoji: string }[] = [
  { type: SphereType.POLITICA, label: "Política", emoji: "🏛️" },
  { type: SphereType.JUDICIARIO, label: "Judiciário", emoji: "⚖️" },
  { type: SphereType.ACADEMIA, label: "Academia", emoji: "🎓" },
  { type: SphereType.SEGURANCA, label: "Segurança", emoji: "🛡️" },
];

function FeaturedTrack({ profiles }: { profiles: FeaturedProfilesBySphere[SphereType] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef<(direction: -1 | 1) => void>(() => {});
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(profiles.length <= 1);
  const [pointerInside, setPointerInside] = useState(false);
  const [focusInside, setFocusInside] = useState(false);
  const [cycle, setCycle] = useState(0);
  const paused = pointerInside || focusInside;

  function sync() {
    const node = scrollerRef.current;
    if (!node) {
      return;
    }

    setAtStart(node.scrollLeft <= 1);
    setAtEnd(node.scrollLeft + node.clientWidth >= node.scrollWidth - 2);
  }

  useEffect(() => {
    sync();
    const node = scrollerRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver(sync);
    observer.observe(node);
    return () => observer.disconnect();
  }, [profiles]);

  function move(direction: -1 | 1) {
    const node = scrollerRef.current;
    const slide = node?.querySelector<HTMLElement>("[data-slide]");
    if (!node || !slide) {
      return;
    }

    const styles = window.getComputedStyle(node);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    node.scrollBy({
      left: direction * (slide.offsetWidth + gap),
      behavior: "smooth",
    });
  }

  moveRef.current = move;

  useEffect(() => {
    if (paused || profiles.length <= 1) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      return;
    }

    const timer = window.setInterval(() => {
      const node = scrollerRef.current;
      if (!node) {
        return;
      }

      const reachedEnd = node.scrollLeft + node.clientWidth >= node.scrollWidth - 2;
      if (reachedEnd) {
        node.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }

      moveRef.current(1);
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [paused, profiles, cycle]);

  function moveByUser(direction: -1 | 1) {
    move(direction);
    setCycle((value) => value + 1);
  }

  function resumeIfLeft(event: React.FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) {
      return;
    }

    setFocusInside(false);
  }

  if (profiles.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum representante publicado nesta esfera.
      </p>
    );
  }

  return (
    <div
      className="space-y-3"
      onMouseEnter={() => setPointerInside(true)}
      onMouseLeave={() => setPointerInside(false)}
      onFocus={() => setFocusInside(true)}
      onBlur={resumeIfLeft}
    >
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Representantes anteriores"
          className={atStart ? "hidden" : undefined}
          onClick={() => moveByUser(-1)}
        >
          <ChevronLeft aria-hidden="true" />
          <span className="sr-only">&lt;</span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Próximos representantes"
          disabled={atEnd}
          onClick={() => moveByUser(1)}
        >
          <ChevronRight aria-hidden="true" />
          <span className="sr-only">&gt;</span>
        </Button>
      </div>
      <div
        ref={scrollerRef}
        onScroll={sync}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {profiles.map((profile) => (
          <div
            key={profile.id}
            data-slide
            className="w-full shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
          >
            <ProfileCard profile={profile} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeaturedCarousel({
  profilesBySphere,
}: {
  profilesBySphere: FeaturedProfilesBySphere;
}) {
  const baseId = useId();
  const [sphere, setSphere] = useState<SphereType>(SphereType.POLITICA);
  const active = SPHERES.find((item) => item.type === sphere) ?? SPHERES[0];
  const profiles = profilesBySphere[active.type];

  return (
    <section aria-labelledby={`${baseId}-heading`} className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id={`${baseId}-heading`} className="text-xl font-bold tracking-tight">
            Representantes em Destaque
          </h2>
          <p className="text-sm text-muted-foreground">
            Até 4 perfis por esfera, ordenados pelo Índice de Gestão.
          </p>
        </div>
        <Button asChild>
          <Link href={`/busca?sphere=${active.type}`}>Ver mais</Link>
        </Button>
      </div>

      <div role="tablist" aria-label="Esfera dos destaques" className="flex flex-wrap gap-2">
        {SPHERES.map((item) => {
          const selected = item.type === active.type;
          return (
            <button
              key={item.type}
              type="button"
              role="tab"
              id={`${baseId}-tab-${item.type}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                selected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted"
              }`}
              onClick={() => setSphere(item.type)}
            >
              <span aria-hidden="true">{item.emoji}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active.type}`}
        tabIndex={0}
        className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <FeaturedTrack key={active.type} profiles={profiles} />
      </div>
    </section>
  );
}
