"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import type { IndividualVote, VoteChoice } from "@/types/voting";

const VOTE_LABEL: Record<VoteChoice, string> = {
  Yes: "Sim",
  No: "Não",
  Abstain: "Abstenção",
  Absent: "Ausente",
};

const VOTE_VARIANT: Record<VoteChoice, "approved" | "rejected" | "abstention" | "outline"> = {
  Yes: "approved",
  No: "rejected",
  Abstain: "abstention",
  Absent: "outline",
};

const VOTE_OPTIONS: { value: VoteChoice; label: string }[] = [
  { value: "Yes", label: "Sim" },
  { value: "No", label: "Não" },
  { value: "Abstain", label: "Abstenção" },
  { value: "Absent", label: "Ausente" },
];

export interface IndividualVotesListProps {
  votes: readonly IndividualVote[];
}

export function IndividualVotesList({ votes }: IndividualVotesListProps) {
  const [query, setQuery] = useState("");
  const [party, setParty] = useState("");
  const [state, setState] = useState("");
  const [vote, setVote] = useState("");

  const parties = useMemo(
    () => [...new Set(votes.map((item) => item.party))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [votes],
  );
  const states = useMemo(
    () => [...new Set(votes.map((item) => item.state))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [votes],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase("pt-BR");
    return votes.filter((item) => {
      if (needle && !item.politicianName.toLocaleLowerCase("pt-BR").includes(needle)) {
        return false;
      }
      if (party && item.party !== party) {
        return false;
      }
      if (state && item.state !== state) {
        return false;
      }
      if (vote && item.vote !== vote) {
        return false;
      }
      return true;
    });
  }, [votes, query, party, state, vote]);

  const hasActiveFilters = Boolean(query.trim() || party || state || vote);
  const resultLabel =
    filtered.length === 1 ? "1 voto encontrado" : `${filtered.length} votos encontrados`;

  function clearFilters() {
    setQuery("");
    setParty("");
    setState("");
    setVote("");
  }

  if (votes.length === 0) {
    return (
      <p
        role="status"
        className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground"
      >
        Ainda não há votos individuais publicados para esta votação.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
          <label htmlFor="vote-name-q" className="text-sm font-medium text-foreground">
            Parlamentar
          </label>
          <SearchInput
            id="vote-name-q"
            value={query}
            debounceMs={200}
            placeholder="Nome do parlamentar…"
            aria-label="Filtrar votos pelo nome do parlamentar"
            onValueChange={setQuery}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="vote-party" className="text-sm font-medium text-foreground">
            Partido
          </label>
          <select
            id="vote-party"
            value={party}
            onChange={(event) => setParty(event.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Todos</option>
            {parties.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="vote-state" className="text-sm font-medium text-foreground">
            UF
          </label>
          <select
            id="vote-state"
            value={state}
            onChange={(event) => setState(event.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Todas</option>
            {states.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="vote-choice" className="text-sm font-medium text-foreground">
            Voto
          </label>
          <select
            id="vote-choice"
            value={vote}
            onChange={(event) => setVote(event.target.value)}
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Todos</option>
            {VOTE_OPTIONS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {resultLabel}
        </p>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Limpar filtros
          </button>
        ) : null}
      </div>

      {filtered.length === 0 ? (
        <p
          role="status"
          className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground"
        >
          Nenhum voto corresponde aos filtros selecionados.
        </p>
      ) : (
        <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
          {filtered.map((item) => (
            <li
              key={`${item.politicianId}-${item.vote}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="min-w-0 space-y-1">
                <Link
                  href={`/politicos/${item.politicianId}`}
                  className="block truncate font-medium text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {item.politicianName}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {item.party} · {item.state}
                </p>
              </div>
              <Badge variant={VOTE_VARIANT[item.vote]}>{VOTE_LABEL[item.vote]}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
