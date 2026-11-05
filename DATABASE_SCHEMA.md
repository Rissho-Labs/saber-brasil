# Saber Brasil — Database Schema & Data Contracts

## 1. PostgreSQL Enums
```sql
CREATE TYPE sphere_type AS ENUM ('POLITICA', 'JUDICIARIO', 'ACADEMIA', 'SEGURANCA');
CREATE TYPE profile_status AS ENUM ('ATIVO', 'CANDIDATO', 'INATIVO', 'ENCERRADO');
CREATE TYPE alert_badge AS ENUM ('NENHUM', 'INVESTIGADO', 'CASSADO', 'CONDENADO');
```

## 2. Estrutura das Tabelas Principais

### `public_profiles` (Perfis de Representantes Públicos)
```sql
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
```

### `public_projects` (Projetos, Leis e Deliberações)
```sql
CREATE TABLE public_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public_profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  institutional_weight INT CHECK (institutional_weight BETWEEN 1 AND 5),
  citizen_weight INT CHECK (citizen_weight BETWEEN 1 AND 5),
  status VARCHAR(50),
  source_url TEXT NOT NULL
);
```

### `user_evaluations` (Avaliações Cidadãs dos 10 Critérios)
```sql
CREATE TABLE user_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  profile_id UUID REFERENCES public_profiles(id) ON DELETE CASCADE,
  scores JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, profile_id)
);
```

## 3. Os 10 Critérios de Competência (Payload JSONB `scores`)
A coluna `scores` em `user_evaluations` armazena valores inteiros entre 1 e 5 para as seguintes chaves obrigatórias:
1. `postura`
2. `decoro`
3. `coerencia_discursiva`
4. `articulacao_politica`
5. `transparencia`
6. `accountability`
7. `responsividade`
8. `conduta_etica`
9. `comunicacao_publica`
10. `compromisso_institucional`

## 4. Métricas, Funções e Triggers
- **Carisma Rating (Subjetivo, 1.00 a 5.00 estrelas):** Recomputado automaticamente pela função PostgreSQL `recalculate_profile_scores(target_profile_id)` (ou trigger `tr_update_carisma_rating`) tirando a média simples dos 10 critérios enviados pelos cidadãos em `user_evaluations`.
- **Índice de Gestão (Objetivo, 0 a 100 pontos):** Métrica calculada a partir de dados oficiais: `Gestão = Assiduidade (20%) + Coerência TSE (30%) + Impacto Cruzado (50%)`.
- **Níveis de Destaque (Gem Tiers):** Derivados das pontuações nos cards da UI (Bronze, Prata, Ouro, Platina e Diamante).

## 5. Diretrizes de RLS (Row Level Security)
- Consultas públicas `SELECT` são permitidas para usuários anon/authenticated em `public_profiles` e `public_projects`.
- Gravações e exclusões em `user_evaluations` exigem verificação estrita de `auth.uid() == user_id` para impedir adulteração de notas por terceiros.