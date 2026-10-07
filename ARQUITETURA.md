# SABER Brasil — Arquitetura de Sistema e Memória Técnica

> **Slogan:** Transparência real para quem quer decidir.
> **Organização:** Rissho Labs
> **Repositório:** rissholabs/saber-brasil

---

## 1. Visão Geral e Propósito
O **SABER Brasil** (Sistema de Acompanhamento da Burocracia e Evolução da República) é uma plataforma cívica e imparcial de transparência de dados abertos, auditoria e participação popular. O objetivo central é traduzir a opacidade dos dados governamentais em conhecimento estruturado, permitindo que o cidadão avalie representantes e órgãos públicos sem viés ideológico ou desinformação.

---

## 2. As 4 Esferas de Cobertura (Modais Principais)
A navegação inicial e os perfis são segmentados em quatro pilares institucionais:

1. **🏛️ Política (Executivo e Legislativo):** Prefeitos, Governadores, Presidente, Vereadores, Deputados e Senadores.
2. **⚖️ Judiciário & Controle:** Juízes, Desembargadores, Ministros (STF, STJ, TSE) e Magistrados.
3. **🎓 Academia & Gestão Pública:** Reitores, Corpo Docente, Gestores de Universidades Públicas, Editais e Vestibulares.
4. **🛡️ Segurança Pública & Defesa:** Comandantes de Polícia, Delegados-Gerais, Secretários de Segurança e Lideranças Operacionais.

---

## 3. Modelo de Avaliação e Métricas

### 3.1. Dupla Nota do Perfil
Cada perfil é regido por dois sistemas independentes de pontuação:

* **Avaliação Subjetiva (1.0 a 5.0 Estrelas):** Calculada via Questionário de Competências (10 perguntas sobre postura, decoro, coerência discursiva e articulação). Acompanhado de modais pedagógicos (`ℹ️`) explicando cada critério.
* **Índice Ponderado de Gestão (0 a 100 Pontos):** Métrica algorítmica objetiva baseada nos dados oficiais do governo:
  `Índice = Assiduidade (20%) + Coerência TSE (30%) + Impacto Cruzado (50%)`

### 3.2. Ponderação Cruzada (Peso Institucional vs. Peso Cidadão)
* **Peso Institucional:** Grau de urgência/relevância atribuído pela Casa Legislativa ou Órgão.
* **Peso Cidadão:** Relevância atribuída pela comunidade no SABER Brasil.
* **Índice de Divergência:** Expõe visualmente quando Brasília prioriza pautas contrárias ao interesse popular direto.

### 3.3. Gamificação por Gemas (Top 10 Pautas)
A atuação do representante é classificada em hashtags (ex: `#Saúde`, `#Educação`, `#Segurança`). As 10 pautas mais ativas ganham emblemas coloridos por relevância real de execução:
* 💎 **Diamante (Nível Master)**
* ⚪ **Platina**
* 🟡 **Ouro**
* ⚪ **Prata**
* 🟤 **Bronze**

---

## 4. Matriz Visual de Status e Integridade

### Status de Atividade (Borda e Cores)
* 🟢 **Verde (Em Atividade):** Exercendo cargo/função pública ativa.
* 🔵 **Azul (Candidato):** Registrado disputando cargo eletivo.
* ⚪ **Cinza Claro (Inativo / Fora de Cargo):** Ex-mandatário ou gestor sem cargo vigente (histórico preservado).
* ⚫ **Cinza Escuro (Inadimplente / Encerramento):** Perfil encerrado em caráter definitivo (ex: falecimento).

### Badges de Integridade e Situação Legal
* 🟡 **Sob Investigação:** Inquérito ou processo oficial aberto (com link para fonte primária).
* 🟠 **Cassado / Inelegível:** Perda de mandato ou enquadramento na Lei da Ficha Limpa.
* 🔴 **Preso / Condenado:** Decisão colegiada ou trânsito em julgado.


## 5. Fórum, Diálogo e Propostas Cidadãs
* **Sem Comentários Pessoais nos Perfis:** O perfil do representante contém apenas métricas, estatísticas e questionário.
* **Fórum por Projeto/Pauta:** Espaço restrito para debates sobre obras, leis e orçamentos específicos.
* **Alertas de Atenção:** Sinalizações rápidas sobre problemas locais.
* **Propostas Elaboradas:** Projetos de Iniciativa Popular Digital com possibilidade de adoção parlamentar.

---

## 6. Stack Tecnológica e Arquitetura

* **Frontend:** Next.js (LTS/App Router), TypeScript (Strict Mode), Tailwind CSS, Lucide Icons, Shadcn/ui.
* **Backend & Database:** Supabase (PostgreSQL, Auth, Storage, Row Level Security - RLS).
* **Integrações de Dados (APIs):** Portal da Transparência, Dados Abertos (Câmara/Senado), API Google Gemini.
* **Estabilidade:** Foco exclusivo em dependências de versões LTS e estáveis do ecossistema.

---

## 7. Esquema Simplificado de Banco de Dados (ER)

```sql
-- Esferas
CREATE TYPE sphere_type AS ENUM ('POLITICA', 'JUDICIARIO', 'ACADEMIA', 'SEGURANCA');
CREATE TYPE profile_status AS ENUM ('ATIVO', 'CANDIDATO', 'INATIVO', 'ENCERRADO');
CREATE TYPE alert_badge AS ENUM ('NENHUM', 'INVESTIGADO', 'CASSADO', 'CONDENADO');

-- Tabela Principal de Entidades/Perfis Públicos
CREATE TABLE public_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sphere sphere_type NOT NULL,
  current_role VARCHAR(150),
  status profile_status DEFAULT 'ATIVO',
  badge alert_badge DEFAULT 'NENHUM',
  carisma_rating DECIMAL(3,2) DEFAULT 0.00,
  gestao_score INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Ações e Projetos
CREATE TABLE public_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public_profiles(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  institutional_weight INT CHECK (institutional_weight BETWEEN 1 AND 5),
  citizen_weight INT CHECK (citizen_weight BETWEEN 1 AND 5),
  status VARCHAR(50),
  source_url TEXT NOT NULL
);

-- Tabela de Avaliações (Questionário de 10 Perguntas)
CREATE TABLE user_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  profile_id UUID REFERENCES public_profiles(id),
  scores JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, profile_id)
);
```

## 8. Diretrizes de Desenvolvimento (Metodologia Lego & Ponto de Restauração)
1. **Desenvolvimento Modular (Lego):** Construir componente por componente. Jamais tentar criar fluxos inteiros em uma única instrução.
2. **Investigação de Causa-Raiz (Proibido "Dorflex"):** Diante de erros, consultar logs de console do navegador (DevTools) e do terminal. Tratar a origem técnica real do problema na causa-raiz em vez de aplicar contornos superficiais.
3. **Restauração e Commits (Pontos de Checkpoint):** Cada funcionalidade testada e 100% aprovada deve gerar um commit (`git commit`). Se um erro persistir por mais de 2 tentativas, reverter o código ao commit anterior (`git checkout`) e mudar a abordagem de solução.
4. **Economia Extrema de Contexto:** A IA deve ler unicamente o arquivo `TASKS.md` para entender o próximo passo da sprint, evitando re-ler todo o repositório a cada interação.
5. **Estabilidade e Versões LTS:** Priorizar estritamente pacotes em versões LTS e estáveis do ecossistema (Next.js, Node, TypeScript). Proibido utilizar versões beta, canary ou dependências instáveis ('bleeding-edge').