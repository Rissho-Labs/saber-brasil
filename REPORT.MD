================================================================================
                       SABER BRASIL — RELATÓRIO DE GOVERNANÇA
             METODOLOGIA, ARQUITETURA E ROADMAP DE MELHORIAS
================================================================================

Data do Relatório: Outubro de 2026
Versão do Projeto: Sprint 2 (Em andamento)
Tecnologias Core: Next.js 15 (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL)

--------------------------------------------------------------------------------
1. DIRETRIZES TÉCNICAS E FILOSOFIA DE DESENVOLVIMENTO
--------------------------------------------------------------------------------
• Priorização de Versões LTS e Estabilidade: Utilização estrita de versões estáveis
  e consolidadas do ecossistema React/Next.js. Proibição de bibliotecas em fase
  experimental ("bleeding edge") sem estudo prévio de impacto e relatório de
  breaking changes.
• Desenvolvimento Cadenciado ("Ir aos Poucos"): Construção incremental orientada à
  base de dados. Nenhuma interface é desenvolvida sem a definição prévia de seus
  contratos de dados e persistência.
• Tipagem Estrita (Zero 'any'): Alinhamento total das interfaces TypeScript ao
  esquema PostgreSQL documentado em ARCHITECTURE.md.
• Acessibilidade e Semântica Web: Uso de elementos HTML5 semânticos, rótulos ARIA
  para leitores de tela e suporte nativo à navegação por teclado.

--------------------------------------------------------------------------------
2. PROTOCOLO DE CONDUÇÃO E USO DE I.A. ASSISTIDA (CURSOR / COMPOSER)
--------------------------------------------------------------------------------
• Estruturação de Prompts: Todos os comandos para a ferramenta de I.A. devem conter
  o contexto dos arquivos envolvidos (@ARCHITECTURE.md, @types, etc.) e requisitos
  claros de implementação.
• Rastreabilidade via Prompt ID: Obrigatoriedade de código único de identificação
  em cada passo de execução (Ex: SPRINT2-STEP1-PROJECTS-SERVICE).
• Relatório de Execução (Execution Report): Registro obrigatório após a execução de
  cada tarefa contendo: Prompt ID, Task, Files Modified, Changes, Status e Next.

--------------------------------------------------------------------------------
3. ARQUITETURA DE BANCO DE DADOS E REGRAS DE NEGÓCIO (SUPABASE)
--------------------------------------------------------------------------------
• Tabelas Principais:
  - public_profiles: Cadastro dos representantes (nome, esfera, cargo, status, badges).
  - user_evaluations: Registro individual das notas atribuídas pelos cidadãos.
  - public_projects: Projetos de lei e proposições vinculados aos representantes.
• Métricas Principais:
  - Carisma / Avaliação Subjetiva (1.0 a 5.0 estrelas): Calculado dinamicamente no
    PostgreSQL via Trigger (tr_update_carisma_rating) e Função (PL/pgSQL) a partir
    da média dos 10 critérios de competência.
  - Índice de Gestão (0 a 100): Métrica técnica baseada em assiduidade e atuação.
• 10 Critérios de Competência: Postura, Decoro, Coerência Discursiva, Articulação
  Política, Transparência, Accountability, Responsividade, Conduta Ética,
  Comunicação Pública e Compromisso Institucional.

--------------------------------------------------------------------------------
4. STATUS ATUAL DAS ENTREGAS (MINDSET E CONQUISTAS)
--------------------------------------------------------------------------------
[X] Sprint 1: Configurações base, regras do Cursor, Tailwind v4 e arquitetura visual.
[X] Sprint 2 (Parte 1): Tela Home (HeroSearch, KPIStats, Destaques, Votações).
[X] Sprint 2 (Parte 2): Perfil do Político (/politicos/[id]), formulário dos 10
    critérios e lista de projetos de lei integrada ao Supabase.
[X] Banco de Dados: Script SQL completo, Enums, Triggers, RLS e Seeds executados.

--------------------------------------------------------------------------------
5. BRAINSTORMING, PONTOS DE ATENÇÃO E SUGESTÕES DE MELHORIA (ROADMAP)
--------------------------------------------------------------------------------
Análise crítica do produto para garantir escalabilidade, credibilidade e segurança:

1. Autenticação e Antifraude em Avaliações Cidadãs (Proteção Cívica)
   • Risco: Envio de requisições maliciosas via formulário dos 10 critérios por bots
     ou perfis falsos, distorcendo o Carisma/Avaliação Subjetiva dos políticos.
   • Sugestão de Melhoria: Integrar Supabase Auth / OAuth (Google/Gov.br) e validar
     o user_id autenticado na API route antes de inserir no banco, assegurando a
     regra de uma única avaliação por cidadão/político.

2. Consumo em Tempo Real de APIs Governamentais
   • Risco: Dependência de inserções manuais de dados limita a atualização dos
     projetos e assiduidade.
   • Sugestão de Melhoria: Criar rotinas agendadas (Cron Jobs / Supabase Edge Functions)
     para consumir a API de Dados Abertos da Câmara dos Deputados e do Senado Federal,
     atualizando automaticamente gastos de cota, presença e novas matérias.

3. Estratégia de Caching e Performance Server-Side
   • Risco: Sobrecarga de consultas ao banco de dados à medida que o volume de
     acessos simultâneos nas páginas de representantes aumentar.
   • Sugestão de Melhoria: Aplicar revalidate / fetch cache no Next.js App Router
     para servir dados estáticos recarregados periodicamente ou invalidados
     sob demanda quando houver nova submissão de avaliação.

4. Modais e Filtros Dinâmicos por Esfera
   • Risco: Links no Navbar (#political, #judiciary, #academia, #security) sem
     feedback dinâmico imediato para o usuário na página inicial.
   • Sugestão de Melhoria: Criar modais ou filtros ativos na Home que reorganizem a
     busca e os destaques instantaneamente de acordo com a esfera selecionada.

================================================================================