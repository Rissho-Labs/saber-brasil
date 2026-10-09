import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PublicProject, WeightScore } from "@/types";
import { ExternalLink } from "lucide-react";

interface ProjectsListProps {
  projects: PublicProject[];
}

function formatWeight(weight: WeightScore | null): string {
  if (weight === null) {
    return "Não informado";
  }

  return `${weight} de 5`;
}

export function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <section aria-labelledby="projects-heading" className="space-y-4">
      <div className="space-y-1">
        <h2 id="projects-heading" className="text-xl font-semibold tracking-tight">
          Projetos de lei
        </h2>
        <p className="text-sm text-muted-foreground">
          Propostas vinculadas a este representante. O peso institucional reflete a
          urgência atribuída pela Casa ou órgão. O peso cidadão reflete a relevância
          atribuída pela comunidade. Ambos vão de 1 a 5.
        </p>
      </div>

      {projects.length === 0 ? (
        <p role="status" className="text-sm text-muted-foreground">
          Nenhum projeto registrado para este representante.
        </p>
      ) : (
        <ul className="space-y-4 list-none p-0 m-0">
          {projects.map((project) => (
            <li key={project.id}>
              <article aria-labelledby={`project-title-${project.id}`}>
                <Card className="border-border/80">
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <CardTitle
                        id={`project-title-${project.id}`}
                        className="text-base"
                      >
                        {project.title}
                      </CardTitle>
                      {project.status ? (
                        <Badge variant="secondary">
                          <span className="sr-only">Situação do projeto: </span>
                          {project.status}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Situação não informada</Badge>
                      )}
                    </div>
                    <CardDescription>
                      {project.description ?? "Descrição não informada."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Peso institucional</dt>
                        <dd className="font-medium">
                          {formatWeight(project.institutional_weight)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Peso cidadão</dt>
                        <dd className="font-medium">
                          {formatWeight(project.citizen_weight)}
                        </dd>
                      </div>
                    </dl>
                    <p>
                      <a
                        href={project.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        Fonte oficial
                        <ExternalLink className="size-3.5" aria-hidden="true" />
                        <span className="sr-only"> (abre em nova aba)</span>
                      </a>
                    </p>
                  </CardContent>
                </Card>
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
