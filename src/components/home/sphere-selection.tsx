"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { SphereType } from "@/types";

export const HOME_SPHERES = [
  {
    type: SphereType.POLITICA,
    anchor: "political",
    label: "Política",
    emoji: "🏛️",
    title: "Política (Executivo e Legislativo)",
    description:
      "Prefeitos, governadores, presidente, vereadores, deputados e senadores.",
    indicators: [
      "Mandatos do Executivo e do Legislativo",
      "Assiduidade e votações nominais",
      "Peso institucional frente ao peso cidadão",
    ],
  },
  {
    type: SphereType.JUDICIARIO,
    anchor: "judiciary",
    label: "Judiciário",
    emoji: "⚖️",
    title: "Judiciário e Controle",
    description:
      "Juízes, desembargadores, ministros (STF, STJ, TSE) e magistrados.",
    indicators: [
      "Magistratura e tribunais superiores",
      "Decisões colegiadas e fontes primárias",
      "Situação legal e badges de integridade",
    ],
  },
  {
    type: SphereType.ACADEMIA,
    anchor: "academia",
    label: "Academia",
    emoji: "🎓",
    title: "Academia e Gestão Pública",
    description:
      "Reitores, corpo docente, gestores de universidades públicas, editais e vestibulares.",
    indicators: [
      "Gestão de universidades públicas",
      "Editais e processos seletivos",
      "Corpo docente e administração",
    ],
  },
  {
    type: SphereType.SEGURANCA,
    anchor: "security",
    label: "Segurança",
    emoji: "🛡️",
    title: "Segurança Pública e Defesa",
    description:
      "Comandantes de polícia, delegados-gerais, secretários de segurança e lideranças operacionais.",
    indicators: [
      "Comando e delegacias-gerais",
      "Secretarias de segurança",
      "Lideranças operacionais",
    ],
  },
] as const;

type SphereSelectionValue = {
  activeSphere: SphereType;
  selectSphere: (sphere: SphereType) => void;
};

const SphereSelectionContext = createContext<SphereSelectionValue | null>(null);

export function SphereSelectionProvider({ children }: { children: ReactNode }) {
  const [activeSphere, setActiveSphere] = useState<SphereType>(SphereType.POLITICA);

  useEffect(() => {
    function syncFromHash() {
      const anchor = window.location.hash.replace(/^#/, "");
      const match = HOME_SPHERES.find((sphere) => sphere.anchor === anchor);
      if (!match) {
        return;
      }

      setActiveSphere(match.type);
    }

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  function selectSphere(sphere: SphereType) {
    setActiveSphere(sphere);
    const match = HOME_SPHERES.find((item) => item.type === sphere);
    if (match) {
      window.history.replaceState(null, "", `#${match.anchor}`);
    }
  }

  return (
    <SphereSelectionContext.Provider value={{ activeSphere, selectSphere }}>
      {children}
    </SphereSelectionContext.Provider>
  );
}

export function useSphereSelection() {
  const value = useContext(SphereSelectionContext);
  if (!value) {
    throw new Error("useSphereSelection must be used within SphereSelectionProvider");
  }
  return value;
}

export function SphereTabs() {
  const { activeSphere, selectSphere } = useSphereSelection();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndex = Math.max(
    0,
    HOME_SPHERES.findIndex((sphere) => sphere.type === activeSphere),
  );

  function onTabListKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const lastIndex = HOME_SPHERES.length - 1;
    let nextIndex = activeIndex;

    if (event.key === "ArrowRight") {
      nextIndex = activeIndex === lastIndex ? 0 : activeIndex + 1;
    } else if (event.key === "ArrowLeft") {
      nextIndex = activeIndex === 0 ? lastIndex : activeIndex - 1;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = lastIndex;
    } else {
      return;
    }

    event.preventDefault();
    selectSphere(HOME_SPHERES[nextIndex].type);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label="Esferas de cobertura"
      className="grid w-full grid-cols-2 gap-1 rounded-xl border border-border bg-background p-1 shadow-sm sm:grid-cols-4"
      onKeyDown={onTabListKeyDown}
    >
      {HOME_SPHERES.map((sphere, index) => {
        const selected = sphere.type === activeSphere;
        return (
          <button
            key={sphere.type}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            id={`sphere-tab-${sphere.anchor}`}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={sphere.anchor}
            tabIndex={selected ? 0 : -1}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              selected
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-foreground hover:bg-muted"
            }`}
            onClick={() => selectSphere(sphere.type)}
          >
            <span aria-hidden="true">{sphere.emoji}</span>
            {sphere.label}
          </button>
        );
      })}
    </div>
  );
}
