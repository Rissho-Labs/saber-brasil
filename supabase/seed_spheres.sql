-- SABER Brasil — sphere seed
-- Run in the Supabase SQL editor as the database owner, after supabase/schema.sql.
-- The owner bypasses RLS. The anon key cannot insert these rows.
--
-- public_profiles has no avatar column (ARCHITECTURE.md §7). The UI draws initials from name.
-- public_projects.status is TEXT, not an enum. Values match the app: EM_TRAMITACAO, APROVADO.
-- carisma_rating is written only by tr_update_carisma_rating (average of the 10 scores).
-- gestao_score has no trigger. It stores the §3.1 index:
--   round(attendance * 0.20 + tse_coherence * 0.30 + cross_impact * 0.50)
-- Project gems use the higher of institutional_weight and citizen_weight (1–5).

INSERT INTO public.public_profiles (
  id, name, sphere, "current_role", status, badge, gestao_score
) VALUES
  -- POLITICA — attendance, coherence, impact → index
  -- 96, 90, 92 → 92 (Diamante) | 90, 84, 90 → 88 (Platina) | 98, 94, 94 → 95 (Diamante)
  ('11111111-1111-1111-1111-111111111111', 'Mariana Silva', 'POLITICA', 'Deputada Federal', 'ATIVO', 'NENHUM', 92),
  ('22222222-2222-2222-2222-222222222222', 'Carlos Eduardo', 'POLITICA', 'Senador', 'ATIVO', 'INVESTIGADO', 88),
  ('33333333-3333-3333-3333-333333333333', 'Ana Beatriz', 'POLITICA', 'Deputada Federal', 'ATIVO', 'NENHUM', 95),
  -- JUDICIARIO — 80, 74, 75 → 76 (Ouro) | 88, 82, 83 → 84 (Platina) | 70, 58, 60 → 61 (Prata)
  ('44444444-4444-4444-8444-444444444441', 'Helena Prado', 'JUDICIARIO', 'Desembargadora', 'ATIVO', 'NENHUM', 76),
  ('44444444-4444-4444-8444-444444444442', 'Ricardo Mendonça', 'JUDICIARIO', 'Ministro do STJ', 'ATIVO', 'INVESTIGADO', 84),
  ('44444444-4444-4444-8444-444444444443', 'Lúcia Ferreira', 'JUDICIARIO', 'Juíza de Direito', 'ENCERRADO', 'NENHUM', 61),
  -- ACADEMIA — 94, 90, 90 → 91 (Diamante) | 78, 70, 73 → 73 (Ouro) | 50, 40, 44 → 44 (Bronze)
  ('55555555-5555-4555-8555-555555555551', 'Paulo Nogueira', 'ACADEMIA', 'Reitor', 'ATIVO', 'NENHUM', 91),
  ('55555555-5555-4555-8555-555555555552', 'Camila Torres', 'ACADEMIA', 'Professora titular', 'CANDIDATO', 'NENHUM', 73),
  ('55555555-5555-4555-8555-555555555553', 'Jorge Almeida', 'ACADEMIA', 'Gestor de edital', 'INATIVO', 'INVESTIGADO', 44),
  -- SEGURANCA — 90, 84, 85 → 86 (Platina) | 62, 55, 58 → 58 (Prata) | 40, 35, 37 → 37 (Bronze)
  ('66666666-6666-4666-8666-666666666661', 'Renata Gomes', 'SEGURANCA', 'Secretária de Segurança', 'ATIVO', 'NENHUM', 86),
  ('66666666-6666-4666-8666-666666666662', 'Otávio Lima', 'SEGURANCA', 'Delegado-Geral', 'ATIVO', 'CASSADO', 58),
  ('66666666-6666-4666-8666-666666666663', 'Sérgio Duarte', 'SEGURANCA', 'Comandante', 'ENCERRADO', 'CONDENADO', 37)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sphere = EXCLUDED.sphere,
  "current_role" = EXCLUDED."current_role",
  status = EXCLUDED.status,
  badge = EXCLUDED.badge,
  gestao_score = EXCLUDED.gestao_score;

INSERT INTO public.public_projects (
  id, profile_id, title, description, institutional_weight, citizen_weight, status, source_url
) VALUES
  ('77777777-7777-4777-8777-777777777701', '11111111-1111-1111-1111-111111111111', 'PL — Execução pública de emendas', 'Publicação mensal da execução das emendas vinculadas ao mandato.', 5, 4, 'EM_TRAMITACAO', 'https://www.camara.leg.br/'),
  ('77777777-7777-4777-8777-777777777702', '11111111-1111-1111-1111-111111111111', 'PL — Prestação de contas de gabinete', 'Detalha despesas de gabinete em formato aberto.', 3, 2, 'APROVADO', 'https://www.camara.leg.br/'),
  ('77777777-7777-4777-8777-777777777703', '22222222-2222-2222-2222-222222222222', 'PLS — Coerência entre discurso e voto', 'Exige relatório de divergência entre pronunciamento e voto nominal.', 4, 3, 'EM_TRAMITACAO', 'https://www25.senado.leg.br/'),
  ('77777777-7777-4777-8777-777777777704', '22222222-2222-2222-2222-222222222222', 'PLS — Agenda local de audiências', 'Registro das audiências públicas realizadas no estado.', 2, 2, 'APROVADO', 'https://www25.senado.leg.br/'),
  ('77777777-7777-4777-8777-777777777705', '33333333-3333-3333-3333-333333333333', 'PL — Dados abertos de votações nominais', 'Padroniza a série histórica de votações nominais.', 5, 5, 'EM_TRAMITACAO', 'https://www.camara.leg.br/'),
  ('77777777-7777-4777-8777-777777777706', '33333333-3333-3333-3333-333333333333', 'PL — Painel de assiduidade', 'Consolida presença em plenário e comissões.', 4, 4, 'APROVADO', 'https://www.camara.leg.br/'),
  ('77777777-7777-4777-8777-777777777707', '44444444-4444-4444-8444-444444444441', 'Metas de julgamento do tribunal', 'Acompanha o estoque e o prazo médio dos processos colegiados.', 3, 3, 'EM_TRAMITACAO', 'https://www.cnj.jus.br/'),
  ('77777777-7777-4777-8777-777777777708', '44444444-4444-4444-8444-444444444441', 'Pauta residual de recursos', 'Lista recursos sem movimentação no semestre.', 1, 1, 'APROVADO', 'https://www.cnj.jus.br/'),
  ('77777777-7777-4777-8777-777777777709', '44444444-4444-4444-8444-444444444442', 'Súmula sobre transparência de decisões', 'Propõe publicação estruturada de decisões colegiadas.', 4, 3, 'EM_TRAMITACAO', 'https://www.stj.jus.br/'),
  ('77777777-7777-4777-8777-777777777710', '44444444-4444-4444-8444-444444444442', 'Relatório de tempo de acervo', 'Mede o tempo médio até o julgamento.', 3, 2, 'APROVADO', 'https://www.stj.jus.br/'),
  ('77777777-7777-4777-8777-777777777711', '44444444-4444-4444-8444-444444444443', 'Corregedoria de rotinas de vara', 'Registro das rotinas de uma vara já encerrada.', 2, 1, 'APROVADO', 'https://www.cnj.jus.br/'),
  ('77777777-7777-4777-8777-777777777712', '44444444-4444-4444-8444-444444444443', 'Inventário de processos físicos', 'Levantamento residual de autos físicos.', 1, 2, 'EM_TRAMITACAO', 'https://www.cnj.jus.br/'),
  ('77777777-7777-4777-8777-777777777713', '55555555-5555-4555-8555-555555555551', 'Plano de dados abertos da universidade', 'Publica orçamento, editais e contratos da reitoria.', 5, 4, 'EM_TRAMITACAO', 'https://www.gov.br/mec/'),
  ('77777777-7777-4777-8777-777777777714', '55555555-5555-4555-8555-555555555551', 'Painel de execução orçamentária', 'Série mensal da execução do orçamento universitário.', 4, 4, 'APROVADO', 'https://www.gov.br/mec/'),
  ('77777777-7777-4777-8777-777777777715', '55555555-5555-4555-8555-555555555552', 'Edital de permanência estudantil', 'Critérios públicos de auxílio e moradia.', 3, 3, 'EM_TRAMITACAO', 'https://www.gov.br/capes/'),
  ('77777777-7777-4777-8777-777777777716', '55555555-5555-4555-8555-555555555552', 'Relatório de turmas e carga horária', 'Divulga oferta efetiva de disciplinas.', 2, 2, 'APROVADO', 'https://www.gov.br/capes/'),
  ('77777777-7777-4777-8777-777777777717', '55555555-5555-4555-8555-555555555553', 'Retificação de edital antigo', 'Corrige um edital de processo seletivo já inativo.', 1, 1, 'APROVADO', 'https://www.gov.br/mec/'),
  ('77777777-7777-4777-8777-777777777718', '55555555-5555-4555-8555-555555555553', 'Arquivo de recursos administrativos', 'Lista recursos de um edital encerrado.', 1, 1, 'EM_TRAMITACAO', 'https://www.gov.br/mec/'),
  ('77777777-7777-4777-8777-777777777719', '66666666-6666-4666-8666-666666666661', 'Plano estadual de policiamento ostensivo', 'Metas públicas de cobertura e tempo de resposta.', 4, 4, 'EM_TRAMITACAO', 'https://www.gov.br/mj/'),
  ('77777777-7777-4777-8777-777777777720', '66666666-6666-4666-8666-666666666661', 'Observatório de indicadores criminais', 'Série aberta de indicadores usados pela secretaria.', 5, 4, 'APROVADO', 'https://www.gov.br/mj/'),
  ('77777777-7777-4777-8777-777777777721', '66666666-6666-4666-8666-666666666662', 'Relatório de inquéritos da delegacia-geral', 'Consolida o estoque de inquéritos.', 2, 2, 'EM_TRAMITACAO', 'https://www.gov.br/mj/'),
  ('77777777-7777-4777-8777-777777777722', '66666666-6666-4666-8666-666666666662', 'Protocolo de atendimento em delegacias', 'Padroniza o registro inicial de ocorrências.', 3, 2, 'APROVADO', 'https://www.gov.br/mj/'),
  ('77777777-7777-4777-8777-777777777723', '66666666-6666-4666-8666-666666666663', 'Ordem de serviço operacional antiga', 'Registro histórico de uma ordem já encerrada.', 1, 1, 'APROVADO', 'https://www.gov.br/mj/'),
  ('77777777-7777-4777-8777-777777777724', '66666666-6666-4666-8666-666666666663', 'Inventário de viaturas desativadas', 'Lista viaturas fora de operação.', 1, 1, 'EM_TRAMITACAO', 'https://www.gov.br/mj/')
ON CONFLICT (id) DO UPDATE SET
  profile_id = EXCLUDED.profile_id,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  institutional_weight = EXCLUDED.institutional_weight,
  citizen_weight = EXCLUDED.citizen_weight,
  status = EXCLUDED.status,
  source_url = EXCLUDED.source_url;

-- Two fixed evaluators, not auth.users. user_id has no foreign key in the current schema.
-- Each pair shares the same ten scores, so the trigger average is exact.
-- Targets: 4.80, 4.50, 4.70, 4.20, 3.50, 3.80, 4.40, 4.00, 2.50, 4.10, 2.80, 1.80.
INSERT INTO public.user_evaluations (user_id, profile_id, scores)
SELECT
  evaluator.user_id,
  row.profile_id,
  row.scores
FROM (
  VALUES
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'::uuid),
    ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2'::uuid)
) AS evaluator(user_id)
CROSS JOIN (
  VALUES
    ('11111111-1111-1111-1111-111111111111'::uuid, '{"posture":5,"decorum":5,"discursive_coherence":5,"articulation":5,"transparency":5,"accountability":5,"responsiveness":4,"ethical_conduct":4,"public_communication":5,"institutional_commitment":5}'::jsonb),
    ('22222222-2222-2222-2222-222222222222'::uuid, '{"posture":5,"decorum":5,"discursive_coherence":4,"articulation":4,"transparency":4,"accountability":5,"responsiveness":4,"ethical_conduct":5,"public_communication":4,"institutional_commitment":5}'::jsonb),
    ('33333333-3333-3333-3333-333333333333'::uuid, '{"posture":5,"decorum":5,"discursive_coherence":5,"articulation":5,"transparency":4,"accountability":5,"responsiveness":4,"ethical_conduct":5,"public_communication":4,"institutional_commitment":5}'::jsonb),
    ('44444444-4444-4444-8444-444444444441'::uuid, '{"posture":4,"decorum":4,"discursive_coherence":4,"articulation":5,"transparency":4,"accountability":4,"responsiveness":4,"ethical_conduct":4,"public_communication":4,"institutional_commitment":5}'::jsonb),
    ('44444444-4444-4444-8444-444444444442'::uuid, '{"posture":4,"decorum":3,"discursive_coherence":3,"articulation":4,"transparency":3,"accountability":4,"responsiveness":3,"ethical_conduct":4,"public_communication":3,"institutional_commitment":4}'::jsonb),
    ('44444444-4444-4444-8444-444444444443'::uuid, '{"posture":4,"decorum":4,"discursive_coherence":4,"articulation":4,"transparency":3,"accountability":4,"responsiveness":4,"ethical_conduct":3,"public_communication":4,"institutional_commitment":4}'::jsonb),
    ('55555555-5555-4555-8555-555555555551'::uuid, '{"posture":5,"decorum":4,"discursive_coherence":4,"articulation":5,"transparency":4,"accountability":4,"responsiveness":4,"ethical_conduct":5,"public_communication":4,"institutional_commitment":5}'::jsonb),
    ('55555555-5555-4555-8555-555555555552'::uuid, '{"posture":4,"decorum":4,"discursive_coherence":4,"articulation":4,"transparency":4,"accountability":4,"responsiveness":4,"ethical_conduct":4,"public_communication":4,"institutional_commitment":4}'::jsonb),
    ('55555555-5555-4555-8555-555555555553'::uuid, '{"posture":3,"decorum":2,"discursive_coherence":2,"articulation":3,"transparency":2,"accountability":3,"responsiveness":2,"ethical_conduct":3,"public_communication":2,"institutional_commitment":3}'::jsonb),
    ('66666666-6666-4666-8666-666666666661'::uuid, '{"posture":4,"decorum":4,"discursive_coherence":4,"articulation":4,"transparency":4,"accountability":5,"responsiveness":4,"ethical_conduct":4,"public_communication":4,"institutional_commitment":4}'::jsonb),
    ('66666666-6666-4666-8666-666666666662'::uuid, '{"posture":3,"decorum":3,"discursive_coherence":3,"articulation":2,"transparency":3,"accountability":3,"responsiveness":3,"ethical_conduct":2,"public_communication":3,"institutional_commitment":3}'::jsonb),
    ('66666666-6666-4666-8666-666666666663'::uuid, '{"posture":2,"decorum":2,"discursive_coherence":2,"articulation":1,"transparency":2,"accountability":2,"responsiveness":2,"ethical_conduct":1,"public_communication":2,"institutional_commitment":2}'::jsonb)
) AS row(profile_id, scores)
ON CONFLICT (user_id, profile_id) DO UPDATE SET
  scores = EXCLUDED.scores,
  updated_at = NOW();
