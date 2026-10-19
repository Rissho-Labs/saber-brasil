-- Idempotent refresh of carisma_rating from user_evaluations.
-- public_profiles has carisma_rating (mean of the 10 scores) and gestao_score
-- (official index: attendance 20% + TSE coherence 30% + cross impact 50%).
-- This function does not write gestao_score and does not add columns.
-- Run in the Supabase SQL editor. The app does not apply this file itself.

CREATE OR REPLACE FUNCTION public.recalculate_profile_scores(target_profile_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  avg_score NUMERIC(3, 2);
BEGIN
  IF target_profile_id IS NULL THEN
    RETURN;
  END IF;

  SELECT ROUND(COALESCE(AVG((
    COALESCE((scores->>'posture')::numeric, 0) +
    COALESCE((scores->>'decorum')::numeric, 0) +
    COALESCE((scores->>'discursive_coherence')::numeric, 0) +
    COALESCE((scores->>'articulation')::numeric, 0) +
    COALESCE((scores->>'transparency')::numeric, 0) +
    COALESCE((scores->>'accountability')::numeric, 0) +
    COALESCE((scores->>'responsiveness')::numeric, 0) +
    COALESCE((scores->>'ethical_conduct')::numeric, 0) +
    COALESCE((scores->>'public_communication')::numeric, 0) +
    COALESCE((scores->>'institutional_commitment')::numeric, 0)
  ) / 10.0), 0.00), 2)::NUMERIC(3, 2)
  INTO avg_score
  FROM public.user_evaluations
  WHERE profile_id = target_profile_id;

  IF avg_score < 0 THEN
    avg_score := 0.00;
  ELSIF avg_score > 5 THEN
    avg_score := 5.00;
  END IF;

  UPDATE public.public_profiles
  SET carisma_rating = avg_score
  WHERE id = target_profile_id;
END;
$$;

REVOKE ALL ON FUNCTION public.recalculate_profile_scores(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.recalculate_profile_scores(UUID) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.update_profile_carisma_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  PERFORM public.recalculate_profile_scores(COALESCE(NEW.profile_id, OLD.profile_id));

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_update_carisma_rating ON public.user_evaluations;
CREATE TRIGGER tr_update_carisma_rating
AFTER INSERT OR UPDATE OR DELETE ON public.user_evaluations
FOR EACH ROW
EXECUTE FUNCTION public.update_profile_carisma_rating();
