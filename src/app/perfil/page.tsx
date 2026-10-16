import { redirect } from "next/navigation";
import { ConnectedAccounts } from "@/components/perfil/connected-accounts";
import { UserEvaluations } from "@/components/perfil/user-evaluations";
import { UserInfo } from "@/components/perfil/user-info";
import { sessionAvatarUrl } from "@/lib/auth/session-avatar";
import { getUserEvaluationHistory } from "@/lib/services/user-history";
import { createClient } from "@/lib/supabase/server";

function fullNameOf(metadata: { full_name?: unknown }): string {
  return typeof metadata.full_name === "string" && metadata.full_name.trim()
    ? metadata.full_name.trim()
    : "Nome não informado";
}

function linkedProviders(user: {
  identities?: { provider: string }[] | null;
  app_metadata: { provider?: unknown; providers?: unknown };
}): string[] {
  const fromIdentities = (user.identities ?? [])
    .map((identity) => identity.provider)
    .filter((provider) => provider.length > 0);
  if (fromIdentities.length > 0) {
    return fromIdentities;
  }

  if (Array.isArray(user.app_metadata.providers)) {
    return user.app_metadata.providers.filter((provider): provider is string => typeof provider === "string");
  }

  return typeof user.app_metadata.provider === "string" ? [user.app_metadata.provider] : [];
}

function createdAtLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Data não informada";
  }
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(date);
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login?next=/perfil");
  }

  const history = await getUserEvaluationHistory(supabase, data.user.id);
  const method = data.user.app_metadata.provider === "google" ? "google" : "email";
  const providers = linkedProviders(data.user);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Meu perfil</h1>
      <UserInfo
        fullName={fullNameOf(data.user.user_metadata)}
        email={data.user.email ?? "E-mail não informado"}
        createdAtLabel={createdAtLabel(data.user.created_at)}
        method={method}
        avatarUrl={sessionAvatarUrl(data.user.user_metadata)}
      />
      <ConnectedAccounts
        googleConnected={providers.includes("google")}
        canUnlinkGoogle={providers.includes("google") && providers.includes("email")}
      />
      <UserEvaluations items={history} />
    </main>
  );
}
