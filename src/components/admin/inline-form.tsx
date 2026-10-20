"use client";

import { useState, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { ActionState } from "@/components/forms";

type Action = (prev: ActionState, form: FormData) => Promise<ActionState>;

/** A select that posts immediately — used for status changes in dense admin tables. */
export function InlineSelect({
  action, name, value, options, hidden, className = "select", label,
}: { action: Action; name: string; value: string; options: (string | { value: string; label: string })[]; hidden: Record<string, string>; className?: string; label?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [current, setCurrent] = useState(value);

  return (
    <span className="row" style={{ gap: 6 }}>
      <select
        className={className}
        aria-label={label ?? name}
        value={current}
        disabled={pending}
        style={{ minHeight: 32, padding: "5px 28px 5px 9px", fontSize: 11.5, borderRadius: 8, backgroundPosition: "right 8px center" }}
        onChange={(event) => {
          const next = event.target.value;
          setCurrent(next);
          start(async () => {
            const form = new FormData();
            for (const [key, val] of Object.entries(hidden)) form.set(key, val);
            form.set(name, next);
            await action(null, form);
            router.refresh();
          });
        }}
      >
        {options.map((option) => {
          const value = typeof option === "string" ? option : option.value;
          const text = typeof option === "string" ? option.replace(/_/g, " ") : option.label;
          return <option key={value || "none"} value={value}>{text}</option>;
        })}
      </select>
      {pending ? <span className="tiny muted">saving…</span> : null}
    </span>
  );
}

export function InlineButton({
  action, payload, children, className = "button button-ghost button-xs", confirmText, title,
}: { action: Action; payload: Record<string, string>; children: ReactNode; className?: string; confirmText?: string; title?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      className={className}
      title={title}
      disabled={pending}
      onClick={() => {
        if (confirmText && !window.confirm(confirmText)) return;
        start(async () => {
          const form = new FormData();
          for (const [key, val] of Object.entries(payload)) form.set(key, val);
          await action(null, form);
          setDone(true);
          router.refresh();
          window.setTimeout(() => setDone(false), 1400);
        });
      }}
    >
      {pending ? "…" : done ? "✓" : children}
    </button>
  );
}
