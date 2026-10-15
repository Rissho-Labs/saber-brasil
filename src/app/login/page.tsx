import { LoginForm } from "@/components/auth/login-form";
import { safeNextPath } from "@/lib/auth/safe-next-path";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
      <p className="mt-2 mb-6 text-sm text-muted-foreground">
        A avaliação cidadã exige uma conta. Cada pessoa envia uma avaliação por representante.
      </p>
      <LoginForm nextPath={safeNextPath(params.next)} />
    </main>
  );
}
