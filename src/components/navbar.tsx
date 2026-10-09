import Link from "next/link";
import { Scale } from "lucide-react";

const spheres = [
  { label: "Política", emoji: "🏛️", href: "#political" },
  { label: "Judiciário", emoji: "⚖️", href: "#judiciary" },
  { label: "Academia", emoji: "🎓", href: "#academia" },
  { label: "Segurança", emoji: "🛡️", href: "#security" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <Scale className="size-6 shrink-0 text-foreground" aria-hidden />
          <span className="flex min-w-0 flex-col">
            <span className="text-lg font-semibold tracking-tight text-foreground">
              SABER Brasil
            </span>
            <span className="text-sm text-muted-foreground">
              Transparência real para quem quer decidir.
            </span>
          </span>
        </Link>
        <nav aria-label="Esferas" className="flex flex-wrap gap-2">
          {spheres.map((sphere) => (
            <a
              key={sphere.href}
              href={sphere.href}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <span aria-hidden>{sphere.emoji}</span>
              {sphere.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}