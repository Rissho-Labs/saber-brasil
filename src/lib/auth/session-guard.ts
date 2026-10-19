export type AuthSessionContext = {
  userId: string;
  isAuthenticated: true;
};

export class UnauthorizedError extends Error {
  readonly code = "UNAUTHORIZED";

  constructor() {
    super("Autenticação obrigatória.");
    this.name = "UnauthorizedError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function requireAuthSession(session: unknown): AuthSessionContext {
  if (!isRecord(session) || !isRecord(session.user)) {
    throw new UnauthorizedError();
  }

  const userId = session.user.id;
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new UnauthorizedError();
  }

  return {
    userId: userId.trim(),
    isAuthenticated: true,
  };
}
