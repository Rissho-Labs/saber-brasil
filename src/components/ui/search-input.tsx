"use client";

import {
  useEffect,
  useId,
  useState,
  type ChangeEvent,
  type ComponentProps,
} from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SearchInputProps
  extends Omit<ComponentProps<"input">, "type" | "onChange" | "value" | "defaultValue"> {
  value?: string;
  defaultValue?: string;
  /** Debounced callback (ms). Defaults to 300. */
  debounceMs?: number;
  onValueChange?: (value: string) => void;
  onDebouncedChange?: (value: string) => void;
  clearLabel?: string;
  containerClassName?: string;
}

export function SearchInput({
  id,
  value,
  defaultValue = "",
  debounceMs = 300,
  onValueChange,
  onDebouncedChange,
  clearLabel = "Limpar busca",
  containerClassName,
  className,
  placeholder = "Buscar…",
  disabled,
  "aria-label": ariaLabel = "Campo de busca",
  ...props
}: SearchInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const current = isControlled ? value : internalValue;

  useEffect(() => {
    if (!onDebouncedChange) {
      return;
    }

    const timer = window.setTimeout(() => {
      onDebouncedChange(current);
    }, Math.max(0, debounceMs));

    return () => window.clearTimeout(timer);
  }, [current, debounceMs, onDebouncedChange]);

  function setValue(next: string) {
    if (!isControlled) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setValue(event.target.value);
  }

  function handleClear() {
    setValue("");
  }

  return (
    <div className={cn("relative w-full", containerClassName)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        {...props}
        id={inputId}
        type="search"
        role="searchbox"
        value={current}
        disabled={disabled}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onChange={handleChange}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background py-1 pr-9 pl-9 text-base text-foreground shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
          className,
        )}
      />
      {current ? (
        <button
          type="button"
          onClick={handleClear}
          disabled={disabled}
          aria-label={clearLabel}
          className="absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
