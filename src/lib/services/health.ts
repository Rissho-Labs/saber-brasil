import { supabase } from "@/lib/supabase";

export type SchemaIntegrityStatus = "OK" | "DEGRADED" | "FAILED";

export interface SystemAuditReport {
  databaseConnected: boolean;
  environmentValid: boolean;
  schemaIntegrity: SchemaIntegrityStatus;
  issuesFound: string[];
}

const SCHEMA_PROBES = [
  {
    table: "public_profiles",
    columns:
      "id,name,sphere,current_role,status,badge,carisma_rating,gestao_score,created_at",
  },
  {
    table: "public_projects",
    columns:
      "id,profile_id,title,description,institutional_weight,citizen_weight,status,source_url",
  },
  {
    table: "user_evaluations",
    columns: "id,user_id,profile_id,scores,updated_at",
  },
] as const;

function hasValue(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function isTransportFailure(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("fetch") ||
    normalized.includes("network") ||
    normalized.includes("invalid url") ||
    normalized.includes("enotfound") ||
    normalized.includes("econnrefused")
  );
}

async function pingDatabase(): Promise<{ ok: boolean; issue?: string }> {
  try {
    const { error } = await supabase.from("public_profiles").select("id").limit(1);

    if (!error) {
      return { ok: true };
    }

    if (isTransportFailure(error.message)) {
      return { ok: false, issue: `Supabase ping failed: ${error.message}` };
    }

    return {
      ok: true,
      issue: `Supabase responded, but the ping query failed: ${error.message}`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown ping failure";
    return { ok: false, issue: `Supabase ping failed: ${message}` };
  }
}

async function probeSchema(): Promise<string[]> {
  const issues: string[] = [];

  for (const probe of SCHEMA_PROBES) {
    try {
      const { error } = await supabase.from(probe.table).select(probe.columns).limit(1);

      if (error) {
        issues.push(`Schema probe failed for ${probe.table}: ${error.message}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown schema probe failure";
      issues.push(`Schema probe failed for ${probe.table}: ${message}`);
    }
  }

  return issues;
}

function resolveSchemaIntegrity(
  databaseConnected: boolean,
  schemaIssues: string[]
): SchemaIntegrityStatus {
  if (!databaseConnected || schemaIssues.length === SCHEMA_PROBES.length) {
    return "FAILED";
  }

  if (schemaIssues.length > 0) {
    return "DEGRADED";
  }

  return "OK";
}

export async function runSystemAudit(): Promise<SystemAuditReport> {
  const issuesFound: string[] = [];
  const hasUrl = hasValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasAnonKey = hasValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const environmentValid = hasUrl && hasAnonKey;

  if (!hasUrl) {
    issuesFound.push("Missing environment variable NEXT_PUBLIC_SUPABASE_URL.");
  }

  if (!hasAnonKey) {
    issuesFound.push("Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  if (!environmentValid) {
    return {
      databaseConnected: false,
      environmentValid: false,
      schemaIntegrity: "FAILED",
      issuesFound,
    };
  }

  const ping = await pingDatabase();
  if (ping.issue) {
    issuesFound.push(ping.issue);
  }

  const schemaIssues = ping.ok ? await probeSchema() : [];
  issuesFound.push(...schemaIssues);

  return {
    databaseConnected: ping.ok,
    environmentValid,
    schemaIntegrity: resolveSchemaIntegrity(ping.ok, schemaIssues),
    issuesFound,
  };
}
