"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { CAST_VOTES, type VotingParticipant } from "@/lib/search/catalog";
import { VoteBadge } from "@/components/votacoes/vote-badge";

function initial(name: string): string {
  const letter = name.trim().charAt(0);
  return letter ? letter.toLocaleUpperCase("pt-BR") : "?";
}

export function VoterDisclosure({
  participants,
}: {
  participants: readonly VotingParticipant[];
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  if (participants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        {open ? "Ocultar posicionamentos" : "Ver posicionamentos"}
      </button>
      {open ? (
        <div id={panelId} className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Só os perfis acompanhados no SABER. O placar acima é o total ilustrativo do plenário.
          </p>
          {CAST_VOTES.map((vote) => {
            const people = participants.filter((person) => person.vote === vote);
            if (people.length === 0) {
              return null;
            }

            return (
              <div key={vote} className="space-y-2">
                <VoteBadge vote={vote} />
                <ul className="space-y-2">
                  {people.map((person) => (
                    <li key={person.profileId}>
                      <Link
                        href={`/politicos/${person.profileId}`}
                        className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                      >
                        <span
                          aria-hidden="true"
                          className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold"
                        >
                          {initial(person.name)}
                        </span>
                        {person.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
