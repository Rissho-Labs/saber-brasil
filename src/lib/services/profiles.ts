import { PublicProfile, SphereType, ProfileStatus, AlertBadge } from "@/types";

// Base de dados mockada alinhada ao schema PostgreSQL do ARCHITECTURE.md
const mockProfiles: PublicProfile[] = [
  {
    id: "politico-1",
    name: "Mariana Silva",
    sphere: SphereType.POLITICA,
    current_role: "Deputada Federal",
    status: ProfileStatus.ATIVO,
    badge: AlertBadge.NENHUM,
    carisma_rating: 4.8,
    gestao_score: 92,
    created_at: new Date().toISOString(),
  },
  {
    id: "politico-2",
    name: "Carlos Eduardo",
    sphere: SphereType.POLITICA,
    current_role: "Senador",
    status: ProfileStatus.ATIVO,
    badge: AlertBadge.INVESTIGADO,
    carisma_rating: 4.5,
    gestao_score: 88,
    created_at: new Date().toISOString(),
  },
  {
    id: "politico-3",
    name: "Ana Beatriz",
    sphere: SphereType.POLITICA,
    current_role: "Deputada Federal",
    status: ProfileStatus.ATIVO,
    badge: AlertBadge.NENHUM,
    carisma_rating: 4.7,
    gestao_score: 95,
    created_at: new Date().toISOString(),
  },
];

export async function getPublicProfiles(query?: string): Promise<PublicProfile[]> {
  // Simula delay de rede/banco
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (!query) return mockProfiles;

  const lowerQuery = query.toLowerCase();
  return mockProfiles.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      (p.current_role && p.current_role.toLowerCase().includes(lowerQuery))
  );
}

export async function getPublicProfileById(id: string): Promise<PublicProfile | null> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockProfiles.find((p) => p.id === id) || null;
}