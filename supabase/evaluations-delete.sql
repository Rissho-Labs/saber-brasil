-- Run in the Supabase SQL editor after evaluations-auth.sql.
-- Lets a citizen delete only their own evaluation and refreshes carisma_rating.

DROP POLICY IF EXISTS "Usuários excluem suas próprias avaliações" ON public.user_evaluations;

CREATE POLICY "Usuários excluem suas próprias avaliações"
  ON public.user_evaluations
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION update_profile_carisma_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_score NUMERIC(3, 2);
  target_id UUID;
BEGIN
  target_id := COALESCE(NEW.profile_id, OLD.profile_id);

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
  WHERE profile_id = target_id;

  UPDATE public.public_profiles
  SET carisma_rating = avg_score
  WHERE id = target_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_carisma_rating ON public.user_evaluations;
CREATE TRIGGER tr_update_carisma_rating
AFTER INSERT OR UPDATE OR DELETE ON public.user_evaluations
FOR EACH ROW
EXECUTE FUNCTION update_profile_carisma_rating();
