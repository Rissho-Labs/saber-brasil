export const AVATAR_CHANGE_EVENT = "saber-avatar";
export const AVATAR_REMOVED_KEY = "avatar_removed";
export const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
export const AVATAR_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export type AvatarMimeType = (typeof AVATAR_MIME_TYPES)[number];

const UNAVAILABLE_TITLE = "Função indisponível: você não possui uma foto cadastrada";

export function avatarRemoveTitle(hasPhoto: boolean): string | undefined {
  return hasPhoto ? undefined : UNAVAILABLE_TITLE;
}

export function readMetadataString(metadata: unknown, key: string): string | null {
  if (typeof metadata !== "object" || metadata === null || !(key in metadata)) {
    return null;
  }

  const value = Object.getOwnPropertyDescriptor(metadata, key)?.value;
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readRemovedFlag(metadata: unknown): boolean {
  if (typeof metadata !== "object" || metadata === null || !(AVATAR_REMOVED_KEY in metadata)) {
    return false;
  }

  return Object.getOwnPropertyDescriptor(metadata, AVATAR_REMOVED_KEY)?.value === true;
}

function httpsUrl(value: string | null): string | null {
  if (!value || !value.startsWith("https://")) {
    return null;
  }

  return value;
}

export function sessionName(metadata: unknown): string | null {
  return readMetadataString(metadata, "full_name");
}

export function sessionAvatarUrl(metadata: unknown): string | null {
  if (readRemovedFlag(metadata)) {
    return null;
  }

  return (
    httpsUrl(readMetadataString(metadata, "avatar_url")) ??
    httpsUrl(readMetadataString(metadata, "picture"))
  );
}

export function publishAvatarUrl(avatarUrl: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(AVATAR_CHANGE_EVENT, { detail: avatarUrl }));
}

export function isAvatarMimeType(value: string): value is AvatarMimeType {
  return AVATAR_MIME_TYPES.some((type) => type === value);
}
