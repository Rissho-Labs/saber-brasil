-- Apply on an existing database. One evaluation per authenticated user and profile.
DROP POLICY IF EXISTS "Usuários criam suas próprias avaliações" ON public.user_evaluations;
DROP POLICY IF EXISTS "Usuários atualizam suas próprias avaliações" ON public.user_evaluations;

CREATE POLICY "Usuários criam suas próprias avaliações"
  ON public.user_evaluations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários atualizam suas próprias avaliações"
  ON public.user_evaluations
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
