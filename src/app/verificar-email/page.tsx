import Link from "next/link";
import { OtpVerificationForm } from "@/components/auth/otp-verification-form";
import { safeNextPath } from "@/lib/auth/safe-next-path";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; next?: string }>;
}) {
  const params = await searchParams;
  const email = params.email?.trim() ?? "";
  const nextPath = safeNextPath(params.next);

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-xl items-center px-4 py-16 sm:px-6">
      {EMAIL_PATTERN.test(email) ? (
        <OtpVerificationForm email={email} nextPath={nextPath} />
      ) : (
        <div className="mx-auto max-w-md space-y-3 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Confirme seu e-mail</h1>
          <p className="text-sm text-muted-foreground">
            Comece o cadastro para receber o código de 6 dígitos.
          </p>
          <Link
            href={`/cadastro?next=${encodeURIComponent(nextPath)}`}
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Ir para o cadastro
          </Link>
        </div>
      )}
    </main>
  );
}
