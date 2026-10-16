"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  AVATAR_REMOVED_KEY,
  MAX_AVATAR_BYTES,
  isAvatarMimeType,
  type AvatarMimeType,
} from "@/lib/auth/session-avatar";

const AVATAR_BUCKET = "avatars";
const AVATAR_PATH_NAME = "avatar";

const avatarFileSchema = z.object({
  size: z.number().int().positive().max(MAX_AVATAR_BYTES),
  type: z.enum(["image/png", "image/jpeg", "image/webp"]),
});

const avatarUrlSchema = z
  .string()
  .url()
  .refine((value) => value.startsWith("https://"));

export type AvatarActionResult =
  | { ok: true; avatarUrl: string | null }
  | { ok: false; error: string };

function matchesSignature(bytes: Uint8Array, type: AvatarMimeType): boolean {
  if (type === "image/png") {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  }

  if (type === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }

  return (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}

function storageFailure(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("bucket") || normalized.includes("not found") || normalized.includes("row-level")) {
    return "Não foi possível salvar a foto. O armazenamento de avatares ainda não está ativo.";
  }

  return "Não foi possível salvar a foto.";
}

export async function uploadAvatar(formData: FormData): Promise<AvatarActionResult> {
  const entry = formData.get("file");
  if (!(entry instanceof File)) {
    return { ok: false, error: "Escolha um PNG, JPEG ou WebP de até 2 MB." };
  }

  const parsed = avatarFileSchema.safeParse({ size: entry.size, type: entry.type });
  if (!parsed.success || !isAvatarMimeType(parsed.data.type)) {
    return { ok: false, error: "Escolha um PNG, JPEG ou WebP de até 2 MB." };
  }

  const bytes = new Uint8Array(await entry.arrayBuffer());
  if (bytes.length < 12 || !matchesSignature(bytes, parsed.data.type)) {
    return { ok: false, error: "O arquivo não é uma imagem PNG, JPEG ou WebP válida." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { ok: false, error: "Entre novamente para alterar a foto." };
  }

  const path = `${data.user.id}/${AVATAR_PATH_NAME}`;
  const { error: uploadError } = await supabase.storage.from(AVATAR_BUCKET).upload(path, bytes, {
    upsert: true,
    contentType: parsed.data.type,
    cacheControl: "3600",
  });

  if (uploadError) {
    return { ok: false, error: storageFailure(uploadError.message) };
  }

  const { data: publicUrl } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  const versioned = `${publicUrl.publicUrl}${publicUrl.publicUrl.includes("?") ? "&" : "?"}v=${Date.now()}`;
  const url = avatarUrlSchema.safeParse(versioned);
  if (!url.success) {
    return { ok: false, error: "Não foi possível salvar a foto." };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      avatar_url: url.data,
      [AVATAR_REMOVED_KEY]: false,
    },
  });

  if (updateError) {
    return { ok: false, error: "Não foi possível salvar a foto." };
  }

  return { ok: true, avatarUrl: url.data };
}

export async function removeAvatar(): Promise<AvatarActionResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { ok: false, error: "Entre novamente para alterar a foto." };
  }

  await supabase.storage.from(AVATAR_BUCKET).remove([`${data.user.id}/${AVATAR_PATH_NAME}`]);

  const { error: updateError } = await supabase.auth.updateUser({
    data: {
      avatar_url: "",
      [AVATAR_REMOVED_KEY]: true,
    },
  });

  if (updateError) {
    return { ok: false, error: "Não foi possível remover a foto." };
  }

  return { ok: true, avatarUrl: null };
}
