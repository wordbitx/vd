"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { Check, ChevronDown, Image as ImageIcon, Plus, X } from "lucide-react";

export type FieldType =
  | "text" | "textarea" | "number" | "money" | "date" | "time" | "select" | "checkbox" | "toggle"
  | "radios" | "pills" | "hidden" | "list" | "image" | "readonly" | "email" | "tel" | "password" | "checkboxes";

export type Option = { value: string; label: string; hint?: string };

export type FieldDef = {
  name: string;
  label: string;
  type?: FieldType;
  options?: Option[] | string[];
  required?: boolean;
  hint?: string;
  placeholder?: string;
  defaultValue?: string | number | boolean | string[];
  span?: 1 | 2 | 3;
  rows?: number;
  min?: number | string;
  max?: number | string;
  step?: number;
  acceptEmpty?: boolean;
};

export type ActionState = { ok: boolean; message?: string; errors?: Record<string, string> } | null;

const norm = (options: FieldDef["options"]): Option[] =>
  (options ?? []).map((o) => (typeof o === "string" ? { value: o, label: o } : o));

const spanStyle = (span?: number) => (span && span > 1 ? { gridColumn: `span ${span}` } : undefined);

export function FieldInput({ def, errors, id, value }: { def: FieldDef; errors?: Record<string, string>; id: string; value?: string | number | boolean | string[] }) {
  const type = def.type ?? "text";
  const error = errors?.[def.name];
  const errorId = error ? `${id}-err` : undefined;
  const options = norm(def.options);

  if (type === "hidden") return <input type="hidden" name={def.name} defaultValue={String(value ?? def.defaultValue ?? "")} />;
  if (type === "readonly") {
    return (
      <div className="field" style={{ gap: 5 }}>
        <span className="label">{def.label}</span>
        <div style={{ fontSize: 14.5, fontWeight: 700, letterSpacing: "-0.015em" }}>{String(value ?? def.defaultValue ?? "—")}</div>
      </div>
    );
  }
  if (type === "checkbox" || type === "toggle") {
    const checked = value === undefined ? Boolean(def.defaultValue) : Boolean(value);
    return (
      <div className="field" style={{ gap: 6 }}>
        <label className={type === "toggle" ? "toggle" : "choice"} htmlFor={id} data-checked={checked ? "true" : "false"} style={type === "checkbox" ? { alignItems: "center" } : undefined}>
          <input id={id} type="checkbox" name={def.name} defaultChecked={checked} aria-describedby={errorId} />
          {type === "toggle" ? <span className="toggle-track" /> : null}
          <span className="col" style={{ gap: 2 }}>
            <b style={type === "toggle" ? { fontWeight: 650, fontSize: 13.5 } : undefined}>{def.label}</b>
            {(def.hint || error) && <small>{error ? <span className="field-error">{error}</span> : def.hint}</small>}
          </span>
        </label>
      </div>
    );
  }
  if (type === "pills" || type === "radios") {
    const current = String(value ?? def.defaultValue ?? options[0]?.value ?? "");
    if (type === "pills") {
      return (
        <div className="field" style={{ gap: 7 }} id={id}>
          <span className="label">{def.label}</span>
          <div className="chip-row">
            {options.map((o) => (
              <label key={o.value} className="chip" data-active={current === o.value ? "true" : "false"}>
                <input type="radio" name={def.name} value={o.value} defaultChecked={current === o.value} style={{ position: "absolute", opacity: 0, width: 0 }} />
                {o.label}
              </label>
            ))}
          </div>
          {error ? <span className="field-error" id={errorId}>{error}</span> : def.hint ? <span className="hint">{def.hint}</span> : null}
        </div>
      );
    }
    return (
      <div className="field" style={{ gap: 8 }}>
        <span className="label">{def.label}</span>
        <div className="choice-grid">
          {options.map((o) => (
            <label key={o.value} className="choice" data-checked={current === o.value ? "true" : "false"}>
              <input type="radio" name={def.name} value={o.value} defaultChecked={current === o.value} />
              <span className="col" style={{ gap: 2 }}>
                <b>{o.label}</b>
                {o.hint ? <small>{o.hint}</small> : null}
              </span>
            </label>
          ))}
        </div>
        {error ? <span className="field-error">{error}</span> : null}
      </div>
    );
  }
  if (type === "checkboxes") {
    const list = Array.isArray(value) ? value : Array.isArray(def.defaultValue) ? def.defaultValue : [];
    return (
      <div className="field" style={{ gap: 8 }}>
        <span className="label">{def.label}</span>
        <div className="choice-grid">
          {options.map((o) => (
            <label key={o.value} className="choice" data-checked={list.includes(o.value) ? "true" : "false"}>
              <input type="checkbox" name={def.name} value={o.value} defaultChecked={list.includes(o.value)} />
              <span className="col" style={{ gap: 2 }}>
                <b>{o.label}</b>
                {o.hint ? <small>{o.hint}</small> : null}
              </span>
            </label>
          ))}
        </div>
        {error ? <span className="field-error">{error}</span> : null}
      </div>
    );
  }
  if (type === "list") return <RepeatList name={def.name} label={def.label} items={(Array.isArray(value) ? value : (def.defaultValue as string[])) ?? []} hint={def.hint} />;
  if (type === "image") return <ImagePicker name={def.name} label={def.label} value={String(value ?? def.defaultValue ?? "")} options={options.length ? options.map((o) => o.value) : undefined} />;
  if (type === "select") {
    const current = String(value ?? def.defaultValue ?? "");
    return (
      <div className="field" style={{ gap: 7 }}>
        <label className="label" htmlFor={id}>{def.label}{def.required ? " *" : ""}</label>
        <div style={{ position: "relative" }}>
          <select id={id} name={def.name} className={`select${error ? " input-error" : ""}`} defaultValue={current} aria-describedby={errorId}>
            {def.placeholder ? <option value="">{def.placeholder}</option> : null}
            {options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={14} style={{ position: "absolute", right: 13, top: 17, pointerEvents: "none", color: "var(--muted)" }} />
        </div>
        {error ? <span className="field-error" id={errorId}>{error}</span> : def.hint ? <span className="hint">{def.hint}</span> : null}
      </div>
    );
  }

  const inputType = type === "money" || type === "number" ? "number" : type === "textarea" ? "textarea" : type;
  const commonProps = {
    id, name: def.name, required: def.required, placeholder: def.placeholder,
    defaultValue: value !== undefined ? String(value) : def.defaultValue !== undefined ? String(def.defaultValue) : undefined,
    className: `input${error ? " input-error" : ""}`, "aria-describedby": errorId,
    ...(type === "money" || type === "number" ? { type: "number", min: def.min ?? 0, max: def.max, step: def.step ?? (type === "money" ? 50 : 1), inputMode: "numeric" as const } : {}),
    ...(type === "date" ? { type: "date" } : {}),
    ...(type === "time" ? { type: "time" } : {}),
    ...(type === "email" ? { type: "email", autoComplete: "email" } : {}),
    ...(type === "tel" ? { type: "tel", autoComplete: "tel" } : {}),
    ...(type === "password" ? { type: "password", autoComplete: "new-password" } : {}),
  };

  return (
    <div className="field" style={{ gap: 7, ...spanStyle(def.span) }}>
      <label className="label" htmlFor={id}>{def.label}{def.required ? " *" : ""}</label>
      {inputType === "textarea" ? (
        <textarea {...commonProps} className={`textarea${error ? " input-error" : ""}`} rows={def.rows ?? 4} />
      ) : (
        <input {...commonProps} />
      )}
      {error ? <span className="field-error" id={errorId}>{error}</span> : def.hint ? <span className="hint">{def.hint}</span> : null}
    </div>
  );
}

function RepeatList({ name, label, items, hint }: { name: string; label: string; items: string[]; hint?: string }) {
  const [rows, setRows] = useState<string[]>(items.length ? items : [""]);
  return (
    <div className="field" style={{ gap: 8 }}>
      <span className="label">{label}</span>
      <div className="col" style={{ gap: 8 }}>
        {rows.map((row, i) => (
          <div key={i} className="row" style={{ gap: 8 }}>
            <input className="input" name={name} defaultValue={row} placeholder={`Line ${i + 1}`} onChange={(e) => setRows((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))} />
            <button type="button" className="icon-btn icon-btn-danger" onClick={() => setRows((prev) => prev.filter((_, idx) => idx !== i))} aria-label={`Remove line ${i + 1}`}>
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="button button-ghost button-xs" style={{ alignSelf: "start" }} onClick={() => setRows((prev) => [...prev, ""])}>
        <Plus size={13} /> Add line
      </button>
      {hint ? <span className="hint">{hint}</span> : null}
    </div>
  );
}

const IMAGE_CHOICES = [
  "hero-care", "consultation", "vaccination", "deworming", "grooming", "surgery", "dental", "lab", "emergency",
  "nutrition", "home-visit", "clinic-interior", "pet-shop", "pharmacy", "team-vets", "dr-jawad", "pet-dog", "pet-cat",
  "product-dog-food", "product-cat-food", "product-toys", "product-treats", "product-grooming", "product-bed",
  "product-carrier", "product-supplement", "adopt-1", "adopt-2", "adopt-3", "adopt-4",
];

function ImagePicker({ name, label, value, options }: { name: string; label: string; value: string; options?: string[] }) {
  const choices = (options ?? IMAGE_CHOICES).map((raw) => ({ file: raw.endsWith(".jpg") ? raw : `/images/${raw}.jpg`, key: raw }));
  const [current, setCurrent] = useState(value || choices[0]?.file || "");
  return (
    <div className="field" style={{ gap: 9 }}>
      <span className="label">{label}</span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: 8 }}>
        {choices.map((c) => (
          <button
            key={c.key} type="button" title={c.key} onClick={() => setCurrent(c.file)}
            style={{
              aspectRatio: "1", borderRadius: 11, overflow: "hidden", position: "relative",
              border: current === c.file ? "2px solid var(--brand)" : "1px solid var(--line-2)",
              background: "linear-gradient(150deg,#e6ece9,#f0e9dc)", display: "grid", placeItems: "center",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.file} alt={c.key} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => ((e.currentTarget.style.opacity = "0.18"), (e.currentTarget.style.position = "absolute"))} />
            <ImageIcon size={14} style={{ position: "absolute", color: "rgba(255,255,255,.55)", pointerEvents: "none" }} />
            {current === c.file ? <Check size={13} style={{ position: "absolute", right: 4, top: 4, color: "#fff", background: "var(--brand)", borderRadius: 99, padding: 2 }} /> : null}
          </button>
        ))}
      </div>
      <input type="hidden" name={name} value={current} onChange={() => undefined} />
      <span className="hint">Selected: <code style={{ fontSize: 11 }}>{current}</code></span>
    </div>
  );
}

export function ActionForm({
  action, fields, values, title, description, submitLabel = "Save", onDone, children, className = "", size = "form-grid",
  variant = "card", notice, resetOnSuccess = false,
}: {
  action: (prev: ActionState, form: FormData) => Promise<ActionState>;
  fields: FieldDef[];
  values?: Record<string, string | number | boolean | string[] | undefined>;
  title?: string;
  description?: string;
  submitLabel?: string;
  onDone?: (state: ActionState) => void;
  children?: ReactNode;
  className?: string;
  size?: "form-grid" | "form-grid-3" | "col";
  variant?: "card" | "plain" | "panel";
  notice?: ReactNode;
  resetOnSuccess?: boolean;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action as never, null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const done = useRef(false);

  useEffect(() => {
    if (!state || done.current) return;
    if (state.ok) {
      done.current = true;
      onDone?.(state);
      router.refresh();
      if (resetOnSuccess) formRef.current?.reset();
      setTimeout(() => (done.current = false), 400);
    }
  }, [state, onDone, router, resetOnSuccess]);

  const uid = useId();
  return (
    <form ref={formRef} action={formAction} className={variant === "card" || variant === "panel" ? `app-card ${className}` : className} style={{ gap: 0 }}>
      {title && variant !== "plain" ? (
        <div className="app-card-head">
          <div>
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
        </div>
      ) : null}
      <div className={variant === "plain" ? size : "app-card-body"}>
        {notice}
        <div className={size} style={{ gap: 16 }}>
          {fields.map((def) => (
            <FieldInput key={def.name} def={def} id={`${uid}-${def.name}`} errors={state?.errors} value={values?.[def.name] ?? undefined} />
          ))}
          {children}
        </div>
      </div>
      <div className={variant === "plain" ? "form-actions" : "app-card-foot"} style={{ marginTop: 0 }}>
        {state?.message ? (
          <span className={`notice ${state.ok ? "notice-ok" : "notice-error"}`} style={{ padding: "7px 12px", fontSize: 12.5 }}>{state.message}</span>
        ) : null}
        <span className="spacer" />
        <button className="button button-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

export function DialogForm({
  trigger, title, description, ...props
}: { trigger: ReactNode; title: string; description?: string } & Omit<Parameters<typeof ActionForm>[0], "variant" | "title" | "description">) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!dialog.open && dialog.hasAttribute("data-open")) dialog.close();
  });

  return (
    <>
      <span onClick={() => ref.current?.showModal()} style={{ display: "inline-flex" }}>{trigger}</span>
      <dialog
        ref={ref}
        className="modal"
        onClose={() => props.onDone?.(null)}
        onClick={(e) => {
          if (e.target === ref.current) ref.current?.close();
        }}
      >
        <div className="modal-head">
          <div>
            <h2>{title}</h2>
            {description ? <p className="muted small" style={{ margin: "4px 0 0" }}>{description}</p> : null}
          </div>
          <span className="spacer" />
          <button type="button" className="icon-btn" onClick={() => ref.current?.close()} aria-label="Close"><X size={16} /></button>
        </div>
        <ActionForm
          {...props}
          title={undefined}
          description={undefined}
          variant="plain"
          className=""
          onDone={(state) => {
            if (state?.ok) ref.current?.close();
            props.onDone?.(state);
          }}
        />
      </dialog>
    </>
  );
}
