"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

interface TurnstileRenderOptions {
  sitekey: string;
  callback: (token: string) => void;
  "expired-callback": () => void;
  "error-callback": () => void;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export interface TurnstileWidgetHandle {
  reset: () => void;
}

interface TurnstileWidgetProps {
  onToken: (token: string | null) => void;
}

export const TurnstileWidget = forwardRef<TurnstileWidgetHandle, TurnstileWidgetProps>(
  function TurnstileWidget({ onToken }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const onTokenRef = useRef(onToken);
    onTokenRef.current = onToken;

    useImperativeHandle(ref, () => ({
      reset() {
        onTokenRef.current(null);
        const widgetId = widgetIdRef.current;
        if (widgetId && window.turnstile) {
          window.turnstile.reset(widgetId);
        }
      },
    }));

    useEffect(() => {
      if (!TURNSTILE_SITE_KEY) {
        return;
      }

      let cancelled = false;

      function renderWidget() {
        if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) {
          return;
        }

        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token) => {
            onTokenRef.current(token);
          },
          "expired-callback": () => {
            onTokenRef.current(null);
          },
          "error-callback": () => {
            onTokenRef.current(null);
          },
        });
      }

      const existing = document.querySelector<HTMLScriptElement>("script[data-turnstile-api]");
      if (window.turnstile) {
        renderWidget();
      } else if (existing) {
        existing.addEventListener("load", renderWidget);
      } else {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.dataset.turnstileApi = "true";
        script.addEventListener("load", renderWidget);
        document.head.appendChild(script);
      }

      return () => {
        cancelled = true;
        const widgetId = widgetIdRef.current;
        if (widgetId && window.turnstile) {
          window.turnstile.remove(widgetId);
        }
        widgetIdRef.current = null;
      };
    }, []);

    if (!TURNSTILE_SITE_KEY) {
      return (
        <p className="text-xs text-muted-foreground">
          Verificação anti-bot desativada neste ambiente.
        </p>
      );
    }

    return <div ref={containerRef} className="min-h-16" aria-label="Verificação anti-bot" />;
  },
);
