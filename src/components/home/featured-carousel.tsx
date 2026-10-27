"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileCard } from "@/components/ui/profile-card";
import { SphereCard } from "@/components/home/sphere-modals";
import { SphereTabs, useSphereSelection } from "@/components/home/sphere-selection";
import { FeaturedProfilesBySphere } from "@/lib/services/profiles";
import { sphereSlugForType } from "@/lib/esferas/catalog";
import { SphereType } from "@/types";

const AUTOPLAY_MS = 5000;

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
          className={atStart ? "hidden" : "rounded-xl border-border bg-card"}
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
          className="rounded-xl border-border bg-card"
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
  const { activeSphere } = useSphereSelection();
  const profiles = profilesBySphere[activeSphere];

  return (
    <section
      aria-labelledby={`${baseId}-heading`}
      id="transparencia"
      className="scroll-mt-24 space-y-8"
    >
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <p className="text-xs font-bold tracking-wider text-emerald-700 uppercase">
            Fiscalização &amp; Votações
          </p>
          <h2
            id={`${baseId}-heading`}
            className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-foreground"
          >
            <Users className="size-5 text-emerald-700" aria-hidden="true" />
            Representantes em Destaque
          </h2>
          <p className="text-sm text-muted-foreground">
            Até 4 perfis por esfera, ordenados pelo Índice de Gestão.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Dados sincronizados com a Câmara e Senado
          </span>
          <Button asChild className="rounded-lg bg-emerald-700 text-white hover:bg-emerald-800">
            <Link href={`/esferas/${sphereSlugForType(activeSphere)}`}>
              Ver detalhes da esfera
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="mx-auto mb-2 max-w-2xl space-y-2 text-center">
          <h3 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            Como você deseja explorar?
          </h3>
          <p className="text-sm text-muted-foreground sm:text-base">
            Acesse os dados públicos organizados por área temática com auditoria contínua e
            visualizações didáticas.
          </p>
        </div>
        <SphereTabs />
        <SphereCard />
      </div>

      <FeaturedTrack key={activeSphere} profiles={profiles} />
    </section>
  );
}
