"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Search, Users, X } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Role, User } from "@/lib/types";

type Row = User & { petCount: number; orderCount: number; appointmentCount: number };

const ROLE_TONES: Record<Role, string> = { admin: "tone-gold", vet: "tone-violet", customer: "tone-blue" };

export function AdminCustomers({ users, currentUserId, canManage }: { users: Row[]; currentUserId: string; canManage: boolean }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [resetting, setResetting] = useState<Row | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const filtered = useMemo(() => users.filter((u) =>
    `${u.name} ${u.email} ${u.phone} ${u.role}`.toLowerCase().includes(search.trim().toLowerCase())), [users, search]);

  async function changeRole(user: Row, role: Role) {
    setError("");
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Could not change the role.");
      return;
    }
    router.refresh();
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!resetting) return;
    setBusy(true);
    setError("");
    const res = await fetch(`/api/admin/users/${resetting.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ newPassword }) });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) { setError(data.error ?? "Could not reset the password."); return; }
    setDone(`Password reset for ${resetting.name}. Share the new password with them securely and ask them to change it after logging in.`);
    setResetting(null);
    setNewPassword("");
  }

  return (
    <div>
      {error && <div className="form-error-summary" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
      {done && <div className="form-success-summary" role="status" style={{ marginBottom: 14 }}><KeyRound size={16} /><span>{done}</span></div>}
      <div className="admin-filters no-print">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search users</span>
          <input type="search" placeholder="Search name, email, phone…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <span className="results-count">{filtered.length} accounts</span>
      </div>
      {!canManage && <p className="form-info-summary" style={{ marginBottom: 14 }}><Users size={16} /><span>Role changes and password resets are available to administrators.</span></p>}

      {filtered.length === 0 ? (
        <div className="empty-note"><Users size={24} /><strong>No accounts match</strong>Try another search term.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table" style={{ minWidth: 800 }}>
            <thead><tr><th>Name</th><th>Contact</th><th>Role</th><th>Pets</th><th>Visits</th><th>Orders</th><th>Joined</th>{canManage && <th aria-label="Actions" />}</tr></thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td><span className="cell-strong">{u.name}{u.id === currentUserId ? " (you)" : ""}</span>{u.address && <span className="cell-sub">{u.address}</span>}</td>
                  <td>{u.email}<span className="cell-sub">{u.phone || "No phone"}</span></td>
                  <td>
                    {canManage ? (
                      <select className="status-select" value={u.role} onChange={(e) => changeRole(u, e.target.value as Role)} aria-label={`Role for ${u.name}`}>
                        <option value="customer">Customer</option>
                        <option value="vet">Vet staff</option>
                        <option value="admin">Administrator</option>
                      </select>
                    ) : <span className={`badge ${ROLE_TONES[u.role]}`}>{u.role === "vet" ? "Vet staff" : u.role === "admin" ? "Admin" : "Customer"}</span>}
                  </td>
                  <td>{u.petCount}</td>
                  <td>{u.appointmentCount}</td>
                  <td>{u.orderCount}</td>
                  <td>{formatDate(u.createdAt.slice(0, 10))}</td>
                  {canManage && (
                    <td><div className="row-actions"><button type="button" className="icon-btn" onClick={() => { setResetting(u); setDone(""); }} aria-label={`Reset password for ${u.name}`} title="Reset password"><KeyRound size={15} /></button></div></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {resetting && (
        <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-label="Reset password">
          <div className="dialog" style={{ maxWidth: 460 }}>
            <div className="card-head-row">
              <h2>Reset password</h2>
              <button type="button" className="icon-btn" onClick={() => setResetting(null)} aria-label="Close"><X size={16} /></button>
            </div>
            <p className="dialog-sub">Set a new password for <strong>{resetting.name}</strong> ({resetting.email}). They will use it at next login.</p>
            <form className="form-grid" onSubmit={resetPassword}>
              <div className="field field-full">
                <label htmlFor="reset-pw">New password <span>*</span></label>
                <input id="reset-pw" type="text" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="off" />
              </div>
              <div className="dialog-actions field-full" style={{ marginTop: 2 }}>
                <button type="submit" className="button button-primary" disabled={busy || newPassword.length < 8}>{busy ? <Loader2 size={16} className="spin" /> : <KeyRound size={16} />} Reset password</button>
                <span className="spacer" />
                <button type="button" className="button button-outline" onClick={() => setResetting(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
