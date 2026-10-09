-- 1. Criação dos tipos ENUM (espelhando src/types/index.ts)
CREATE TYPE sphere_type AS ENUM ('POLITICA', 'JUDICIARIO', 'ACADEMIA', 'SEGURANCA');
CREATE TYPE profile_status AS ENUM ('ATIVO', 'CANDIDATO', 'INATIVO', 'ENCERRADO');
CREATE TYPE alert_badge AS ENUM ('NENHUM', 'INVESTIGADO', 'CASSADO', 'CONDENADO');

-- 2. Tabela public_profiles (Perfis Públicos / Políticos)
CREATE TABLE IF NOT EXISTS public.public_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  sphere sphere_type NOT NULL DEFAULT 'POLITICA',
  "current_role" TEXT,
  status profile_status NOT NULL DEFAULT 'ATIVO',
  badge alert_badge NOT NULL DEFAULT 'NENHUM',
  carisma_rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00 CHECK (carisma_rating >= 0.00 AND carisma_rating <= 5.00),
  gestao_score INT NOT NULL DEFAULT 0 CHECK (gestao_score >= 0 AND gestao_score <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabela public_projects (Atividades / Projetos Legislativos)
CREATE TABLE IF NOT EXISTS public.public_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.public_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  institutional_weight SMALLINT CHECK (institutional_weight BETWEEN 1 AND 5),
  citizen_weight SMALLINT CHECK (citizen_weight BETWEEN 1 AND 5),
  status TEXT,
  source_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Tabela user_evaluations (Avaliações dos 10 Critérios)
CREATE TABLE IF NOT EXISTS public.user_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- FK para auth.users futuramente
  profile_id UUID REFERENCES public.public_profiles(id) ON DELETE CASCADE,
  scores JSONB NOT NULL, -- Armazena os 10 critérios de competência
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_profile_eval UNIQUE (user_id, profile_id)
);

-- 5. Função para recalcular o carisma_rating após nova avaliação
CREATE OR REPLACE FUNCTION update_profile_carisma_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_score NUMERIC(3, 2);
BEGIN
  -- Calcula a média geral das avaliações do perfil
  SELECT COALESCE(AVG((
    (scores->>'posture')::numeric +
    (scores->>'decorum')::numeric +
    (scores->>'discursive_coherence')::numeric +
    (scores->>'articulation')::numeric +
    (scores->>'transparency')::numeric +
    (scores->>'accountability')::numeric +
    (scores->>'responsiveness')::numeric +
    (scores->>'ethical_conduct')::numeric +
    (scores->>'public_communication')::numeric +
    (scores->>'institutional_commitment')::numeric
  ) / 10.0), 0.00)
  INTO avg_score
  FROM public.user_evaluations
  WHERE profile_id = NEW.profile_id;

  -- Atualiza o perfil público
  UPDATE public.public_profiles
  SET carisma_rating = avg_score
  WHERE id = NEW.profile_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger ativado após inserção ou atualização de avaliações
CREATE TRIGGER tr_update_carisma_rating
AFTER INSERT OR UPDATE ON public.user_evaluations
FOR EACH ROW
EXECUTE FUNCTION update_profile_carisma_rating();

-- 6. Configuração de Row Level Security (RLS)
ALTER TABLE public.public_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_evaluations ENABLE ROW LEVEL SECURITY;

-- Leitura pública habilitada para todos
CREATE POLICY "Leitura pública de perfis" ON public.public_profiles FOR SELECT USING (true);
CREATE POLICY "Leitura pública de projetos" ON public.public_projects FOR SELECT USING (true);
CREATE POLICY "Leitura pública de avaliações" ON public.user_evaluations FOR SELECT USING (true);

-- Submissão de avaliação por usuários
CREATE POLICY "Usuários criam suas próprias avaliações" ON public.user_evaluations
  FOR INSERT WITH CHECK (true);

-- 7. Dados Iniciais para Seeds (Mocks Oficiais no Banco)
INSERT INTO public.public_profiles (id, name, sphere, "current_role", status, badge, carisma_rating, gestao_score)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Mariana Silva', 'POLITICA', 'Deputada Federal', 'ATIVO', 'NENHUM', 4.80, 92),
  ('22222222-2222-2222-2222-222222222222', 'Carlos Eduardo', 'POLITICA', 'Senador', 'ATIVO', 'INVESTIGADO', 4.50, 88),
  ('33333333-3333-3333-3333-333333333333', 'Ana Beatriz', 'POLITICA', 'Deputada Federal', 'ATIVO', 'NENHUM', 4.70, 95)
ON CONFLICT (id) DO NOTHING;