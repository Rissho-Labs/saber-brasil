"use client";

import { FormEvent, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/lib/auth/account-actions";

export function PasswordModal({ onChanged }: { onChanged: (message: string) => void }) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function resetFields() {
    setCurrentPassword("");
    setPassword("");
    setConfirmPassword("");
    setError(null);
    setPending(false);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const result = await changePassword(currentPassword, password, confirmPassword);
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    resetFields();
    closeDialog();
    onChanged("Senha alterada.");
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={openDialog}>
        Alterar senha
      </Button>
      <dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClose={resetFields}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
        className="fixed inset-0 z-50 m-0 flex h-dvh max-h-none w-full max-w-none items-center justify-center border-0 bg-black/50 p-4 text-foreground backdrop:bg-transparent backdrop-blur-sm [&:not([open])]:hidden"
      >
        <div className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-xl border border-border bg-background p-6 shadow-lg">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <h2 id={titleId} className="text-lg font-semibold">
              Alterar senha
            </h2>
            <p id={descriptionId} className="text-sm text-muted-foreground">
              Confirme a senha atual e escolha uma nova senha. Pressione Esc para fechar.
            </p>
          </div>
          <div className="space-y-1 text-left">
            <label htmlFor="current-password" className="text-sm font-medium">
              Senha atual
            </label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1 text-left">
            <label htmlFor="new-password" className="text-sm font-medium">
              Nova senha
            </label>
            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1 text-left">
            <label htmlFor="confirm-password" className="text-sm font-medium">
              Confirmar nova senha
            </label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          {error ? (
            <p role="alert" className="text-left text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2 pt-4">
            <Button type="submit" disabled={pending}>
              {pending ? "Salvando..." : "Alterar senha"}
            </Button>
            <Button type="button" variant="outline" onClick={closeDialog}>
              Fechar
            </Button>
          </div>
        </form>
        </div>
      </dialog>
    </>
  );
}
