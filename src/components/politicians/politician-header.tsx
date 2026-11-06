import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Politician, PoliticianRole } from "@/types/politician";

const ROLE_LABEL: Record<PoliticianRole, string> = {
  deputado: "Deputado(a) Federal",
  senador: "Senador(a) da República",
};

export interface PoliticianSocialLink {
  label: string;
  href: string;
}

export interface PoliticianHeaderProps {
  politician: Politician;
  socialLinks?: readonly PoliticianSocialLink[];
}

function Avatar({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  const initial = name.trim().charAt(0).toLocaleUpperCase("pt-BR") || "?";

  if (!photoUrl) {
    return (
      <div
        className="flex size-28 shrink-0 items-center justify-center rounded-2xl bg-muted text-4xl font-semibold text-muted-foreground sm:size-32"
        aria-hidden="true"
      >
        {initial}
      </div>
    );
  }

  return (
    <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl bg-muted sm:size-32">
      <Image src={photoUrl} alt="" fill sizes="128px" className="object-cover" priority />
    </div>
  );
}

export function PoliticianHeader({ politician, socialLinks = [] }: PoliticianHeaderProps) {
  const titleId = `politician-detail-${politician.id}-name`;

  return (
    <Card className="overflow-hidden border-border/80 bg-gradient-to-br from-card via-card to-muted/40">
      <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:gap-8 sm:p-8">
        <Avatar name={politician.name} photoUrl={politician.photoUrl} />

        <div className="min-w-0 flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="category">{ROLE_LABEL[politician.role]}</Badge>
              <Badge variant="party">
                {politician.party}/{politician.state}
              </Badge>
            </div>
            <h1 id={titleId} className="text-2xl font-bold tracking-tight sm:text-3xl">
              {politician.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Nome civil: <span className="text-foreground">{politician.civilName}</span>
            </p>
          </div>

          <ul className="grid gap-2 text-sm sm:grid-cols-2">
            <li className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4 shrink-0" aria-hidden="true" />
              <span>
                {politician.state} · {politician.party}
              </span>
            </li>
            <li>
              <a
                href={`mailto:${politician.email}`}
                className="inline-flex items-center gap-2 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                {politician.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${politician.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                {politician.phone}
              </a>
            </li>
          </ul>

          {socialLinks.length > 0 ? (
            <nav aria-label="Links institucionais" className="flex flex-wrap gap-3">
              {socialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
