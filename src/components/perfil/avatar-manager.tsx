"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { removeAvatar, uploadAvatar } from "@/lib/auth/avatar-actions";
import {
  MAX_AVATAR_BYTES,
  avatarRemoveTitle,
  isAvatarMimeType,
  publishAvatarUrl,
} from "@/lib/auth/session-avatar";

function initialOf(name: string, email: string): string {
  const source = name !== "Nome não informado" ? name : email;
  const [first] = source.trim().split(/\s+/);
  return (first?.charAt(0) || "?").toUpperCase();
}

export function AvatarManager({
  avatarUrl,
  fullName,
  email,
}: {
  avatarUrl: string | null;
  fullName: string;
  email: string;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [shownUrl, setShownUrl] = useState(avatarUrl);
  const [imageFailed, setImageFailed] = useState(false);
  const [pending, setPending] = useState<"upload" | "remove" | null>(null);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const initial = initialOf(fullName, email);
  const hasPhoto = Boolean(shownUrl);
  const removeTitle = avatarRemoveTitle(hasPhoto);

  useEffect(() => {
    setShownUrl(avatarUrl);
    setImageFailed(false);
  }, [avatarUrl]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timer = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  async function onFile(file: File) {
    if (!isAvatarMimeType(file.type) || file.size > MAX_AVATAR_BYTES) {
      setNotice({ tone: "error", text: "Escolha um PNG, JPEG ou WebP de até 2 MB." });
      return;
    }

    const previous = shownUrl;
    const preview = URL.createObjectURL(file);
    setShownUrl(preview);
    setImageFailed(false);
    setPending("upload");

    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadAvatar(formData);
    URL.revokeObjectURL(preview);

    if (!result.ok) {
      setShownUrl(previous);
      setNotice({ tone: "error", text: result.error });
      setPending(null);
      return;
    }

    setShownUrl(result.avatarUrl);
    publishAvatarUrl(result.avatarUrl);
    setNotice({ tone: "ok", text: "Foto atualizada." });
    setPending(null);
    router.refresh();
  }

  async function onRemove() {
    if (!hasPhoto || pending) {
      return;
    }

    const previous = shownUrl;
    setPending("remove");
    const result = await removeAvatar();

    if (!result.ok) {
      setShownUrl(previous);
      setNotice({ tone: "error", text: result.error });
      setPending(null);
      return;
    }

    setShownUrl(null);
    setImageFailed(false);
    publishAvatarUrl(null);
    setNotice({ tone: "ok", text: "Foto removida." });
    setPending(null);
    router.refresh();
  }

  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-3 md:w-auto">
      <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-foreground/10 text-xl font-semibold ring-1 ring-foreground/10 md:h-24 md:w-24">
        {hasPhoto && !imageFailed ? (
          // OAuth and storage hosts are not a fixed image allow-list.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shownUrl ?? undefined}
            alt=""
            referrerPolicy="no-referrer"
            className="h-20 w-20 rounded-full object-cover md:h-24 md:w-24"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span aria-hidden="true">{initial}</span>
        )}
      </span>
      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) {
              void onFile(file);
            }
          }}
        />
        <button
          type="button"
          className="inline-flex h-8 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
          disabled={pending !== null}
          onClick={() => inputRef.current?.click()}
        >
          {pending === "upload" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
          {pending === "upload" ? "Salvando..." : "Alterar foto"}
        </button>
        <span title={removeTitle} className="inline-flex">
          <button
            type="button"
            className="inline-flex h-8 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
            disabled={!hasPhoto || pending !== null}
            title={removeTitle}
            onClick={() => {
              void onRemove();
            }}
          >
            {pending === "remove" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Remover foto
          </button>
        </span>
      </div>
      <p className="text-xs text-muted-foreground">PNG, JPEG ou WebP até 2MB</p>
      {notice ? (
        <p
          role="status"
          className={`fixed right-4 bottom-4 z-50 max-w-sm rounded-xl border bg-background px-4 py-3 text-sm shadow-lg ${
            notice.tone === "error" ? "border-destructive text-destructive" : "border-slate-200 dark:border-slate-800"
          }`}
        >
          {notice.text}
        </p>
      ) : null}
    </div>
  );
}
