"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Inbox, Mail, MailOpen, MessageCircle, Search, Trash2 } from "lucide-react";
import { formatDateTime } from "@/lib/format";
import type { ContactMessage } from "@/lib/types";

function waNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("92") ? digits : digits.startsWith("0") ? `92${digits.slice(1)}` : digits;
}

export function AdminMessages({ messages }: { messages: ContactMessage[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState("");
  const filtered = useMemo(() => messages.filter((m) =>
    `${m.name} ${m.phone} ${m.email} ${m.subject} ${m.message}`.toLowerCase().includes(search.trim().toLowerCase())), [messages, search]);
  const unread = messages.filter((m) => !m.read).length;

  async function toggleRead(message: ContactMessage) {
    await fetch(`/api/messages/${message.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: !message.read }) });
    router.refresh();
  }
  async function remove(id: string) {
    await fetch(`/api/messages/${id}`, { method: "DELETE" });
    router.refresh();
  }
  async function openMessage(message: ContactMessage) {
    const next = openId === message.id ? "" : message.id;
    setOpenId(next);
    if (next && !message.read) {
      await fetch(`/api/messages/${message.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ read: true }) });
      router.refresh();
    }
  }

  return (
    <div>
      <div className="admin-filters no-print">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search messages</span>
          <input type="search" placeholder="Search inbox…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <span className="results-count">{filtered.length} messages · {unread} unread</span>
      </div>
      {filtered.length === 0 ? (
        <div className="empty-note"><Inbox size={24} /><strong>Inbox zero</strong>Messages from the website contact form will appear here.</div>
      ) : (
        <div className="portal-card" style={{ padding: "6px 22px" }}>
          <div className="list-rows">
            {filtered.map((message) => {
              const open = openId === message.id;
              return (
                <div key={message.id} style={{ borderBottom: "1px solid #f3ecda", padding: "6px 0" }}>
                  <button type="button" onClick={() => openMessage(message)} aria-expanded={open}
                    style={{ width: "100%", display: "flex", gap: 14, alignItems: "center", background: "none", border: 0, cursor: "pointer", textAlign: "left", padding: "10px 0" }}>
                    <span className="lr-icon">{message.read ? <MailOpen size={18} /> : <Mail size={18} />}</span>
                    <span style={{ minWidth: 0, flex: 1 }}>
                      <span className="lr-title" style={{ fontWeight: message.read ? 700 : 800 }}>{message.subject} — {message.name}</span>
                      <span className="lr-sub" style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 560 }}>{message.message}</span>
                    </span>
                    {!message.read && <span className="badge tone-red">New</span>}
                    <span className="lr-sub" style={{ flex: "none" }}>{formatDateTime(message.createdAt)}</span>
                    <ChevronDown size={16} style={{ transform: open ? "rotate(180deg)" : undefined, transition: "transform .2s", flex: "none" }} />
                  </button>
                  {open && (
                    <div style={{ padding: "4px 0 14px 56px" }}>
                      <p style={{ fontSize: 13, lineHeight: 1.8, color: "#3d4c5a", margin: "0 0 12px", whiteSpace: "pre-line" }}>{message.message}</p>
                      <p style={{ fontSize: 11.5, color: "#7a868e", margin: "0 0 14px" }}>
                        From <strong>{message.name}</strong>{message.phone ? <> · {message.phone}</> : null}{message.email ? <> · {message.email}</> : null}
                      </p>
                      <div style={{ display: "flex", gap: 9, flexWrap: "wrap" }}>
                        {message.phone && (
                          <a className="button button-whatsapp" href={`https://wa.me/${waNumber(message.phone)}?text=${encodeURIComponent(`Hello ${message.name}, thank you for contacting Jawad Veterinary Hospital about "${message.subject}". `)}`} target="_blank" rel="noopener noreferrer">
                            <MessageCircle size={15} /> Reply on WhatsApp
                          </a>
                        )}
                        {message.email && <a className="button button-outline" href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject} — Jawad Veterinary Hospital`)}`}><Mail size={15} /> Reply by email</a>}
                        <button type="button" className="button button-outline" onClick={() => toggleRead(message)}>{message.read ? "Mark unread" : "Mark read"}</button>
                        <button type="button" className="button button-danger-outline" onClick={() => remove(message.id)}><Trash2 size={15} /> Delete</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
