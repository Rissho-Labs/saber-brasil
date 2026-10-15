import { SignupForm } from "@/components/auth/signup-form";
import { safeNextPath } from "@/lib/auth/safe-next-path";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
      <p className="mt-2 mb-6 text-sm text-muted-foreground">
        O cadastro pede confirmação por e-mail. Depois do código, você volta para onde estava.
      </p>
      <SignupForm nextPath={safeNextPath(params.next)} />
    </main>
  );
}
