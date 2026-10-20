import Link from "next/link";
import { ArrowRight, Calendar, Clock, MapPin, Printer, Stethoscope, X } from "lucide-react";
import { ActionForm, DialogForm, type FieldDef } from "@/components/forms";
import { Empty, Eyebrow, WhatsAppButton } from "@/components/ui";
import { cancelAppointment, requestReschedule } from "@/server/actions/account";
import { uploadPaymentProof } from "@/server/actions/shop";
import { appointmentsForUser, isLive } from "@/server/queries";
import { requireUser } from "@/server/auth";
import { ago, dateShort, money, todayISO } from "@/lib/format";
import { business } from "@/lib/site";

const slotOptions = [
  { value: "morning", label: "Morning · 10:00 AM – 02:00 PM" },
  { value: "midday", label: "Midday · 02:00 PM – 06:00 PM" },
  { value: "evening", label: "Evening · 06:00 PM – 10:00 PM" },
  { value: "night", label: "Night · 10:00 PM – 02:00 AM" },
  { value: "any", label: "Any time — call me" },
];

export default async function PortalAppointments({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const [{ status }, user] = await Promise.all([searchParams, requireUser()]);
  const all = await appointmentsForUser(user.id);
  const tabs = [
    { id: "", label: "All", count: all.length },
    { id: "upcoming", label: "Upcoming", count: all.filter((a) => isLive(a.status)).length },
    { id: "completed", label: "Completed", count: all.filter((a) => a.status === "completed").length },
    { id: "cancelled", label: "Cancelled", count: all.filter((a) => a.status === "cancelled" || a.status === "no_show").length },
  ];
  const visible = !status ? all : status === "upcoming" ? all.filter((a) => isLive(a.status)) : status === "completed" ? all.filter((a) => a.status === "completed") : all.filter((a) => a.status === "cancelled" || a.status === "no_show");

  return (
    <>
      <section className="app-card">
        <div className="app-card-head">
          <div><h2>Appointments</h2><p>Cancel or move a visit yourself — the front desk is notified immediately.</p></div>
          <span className="spacer" />
          <Link href="/book-vet-appointment-lahore" className="button button-primary button-sm"><Calendar size={15} /> New booking</Link>
        </div>
        <div className="filter-bar">
          <div className="tabbar" style={{ border: "none", gap: 2 }}>
            {tabs.map((tab) => (
              <Link key={tab.id} href={`/portal/appointments${tab.id ? `?status=${tab.id}` : ""}`} data-active={(status ?? "") === tab.id ? "true" : undefined}>
                {tab.label} <span className="tiny muted">{tab.count}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="app-card-body col" style={{ gap: 14 }}>
          {visible.length ? visible.map((appointment) => {
            const canChange = ["pending", "confirmed"].includes(appointment.status);
            return (
              <article key={appointment.id} className="card" style={{ overflow: "hidden" }}>
                <div className="row-between" style={{ padding: "16px 18px", gap: 14 }}>
                  <div className="row" style={{ gap: 14, flexWrap: "wrap" }}>
                    <span className="service-icon" style={{ marginBottom: 0 }}><Stethoscope size={19} /></span>
                    <div>
                      <div className="row" style={{ gap: 9 }}>
                        <b style={{ fontSize: 15.5, letterSpacing: "-0.02em" }}>{appointment.serviceTitle}</b>
                        <span className={`status status-${appointment.status}`}>{appointment.status.replace(/_/g, " ")}</span>
                        {appointment.urgency === "emergency" ? <span className="pill pill-danger" style={{ fontSize: 9 }}>Emergency</span> : null}
                      </div>
                      <span className="small muted">
                        {appointment.petName} · {appointment.mode === "home" ? "Home visit" : "Hospital"} · {dateShort(appointment.date)}
                      </span>
                    </div>
                  </div>
                  <div className="row" style={{ gap: 14 }}>
                    <div className="col" style={{ gap: 1, alignItems: "flex-end" }}>
                      <b style={{ fontSize: 14 }}>{money(appointment.total)}</b>
                      <span className="tiny muted">{appointment.payment.status === "paid" ? "Paid" : "Due after visit"}</span>
                    </div>
                    <span className="table-ref">{appointment.ref}</span>
                  </div>
                </div>

                <div className="card-pad" style={{ paddingTop: 0 }}>
                  <div className="grid cols-3" style={{ gap: 12, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
                    <div className="col" style={{ gap: 2 }}>
                      <span className="tiny" style={{ fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-2)" }}>When</span>
                      <b className="small">{dateShort(appointment.date)}</b>
                      <span className="tiny muted"><Clock size={11} style={{ verticalAlign: "-2px" }} /> {appointment.slotLabel} · {appointment.slotWindow}</span>
                    </div>
                    <div className="col" style={{ gap: 2 }}>
                      <span className="tiny" style={{ fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-2)" }}>Where</span>
                      <b className="small">{appointment.mode === "home" ? appointment.area : "Al Kabir Town hospital"}</b>
                      <span className="tiny muted" style={{ display: "block", maxWidth: 230, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}><MapPin size={11} style={{ verticalAlign: "-2px" }} /> {appointment.address}</span>
                    </div>
                    <div className="col" style={{ gap: 2 }}>
                      <span className="tiny" style={{ fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted-2)" }}>Veterinarian</span>
                      <b className="small">{appointment.vetName ?? "Being assigned"}</b>
                      <span className="tiny muted">Booked {ago(appointment.createdAt)}</span>
                    </div>
                  </div>

                  <div className="row" style={{ gap: 8, marginTop: 14, paddingTop: 12, borderTop: "1px dashed var(--line-2)" }}>
                    <Link href={`/slip/${appointment.ref}`} className="button button-ghost button-xs"><Printer size={13} /> Print slip</Link>
                    {canChange ? (
                      <>
                        <DialogForm
                          action={requestReschedule}
                          title="Move this visit"
                          description="The desk confirms the new window on WhatsApp. Nothing changes until a person confirms."
                          trigger={<button type="button" className="button button-ghost button-xs">Reschedule</button>}
                          fields={[
                            { name: "id", label: "id", type: "hidden", defaultValue: appointment.id },
                            { name: "preferredDate", label: "New date", type: "date", required: true, min: todayISO() },
                            { name: "slotId", label: "Preferred window", type: "select", options: slotOptions, required: true, defaultValue: appointment.slotId },
                          ]}
                          submitLabel="Request new slot"
                        />
                        <DialogForm
                          action={cancelAppointment}
                          title="Cancel this visit"
                          description="No fee is charged for cancelling before the veterinarian is dispatched."
                          trigger={<button type="button" className="button button-ghost button-xs" style={{ color: "var(--danger)" }}><X size={13} /> Cancel</button>}
                          fields={[
                            { name: "id", label: "id", type: "hidden", defaultValue: appointment.id },
                            { name: "reason", label: "Reason (optional)", type: "textarea", rows: 3, placeholder: "Pet improved / travel / rescheduling for next week" },
                          ]}
                          submitLabel="Cancel booking"
                        />
                      </>
                    ) : null}
                    {appointment.payment.status === "unpaid" && appointment.status === "completed" ? (
                      <DialogForm
                        action={uploadPaymentProof}
                        title="Add your payment reference"
                        description="Bank transfer or Easypaisa — paste the TID and the desk will mark it paid the same working day."
                        trigger={<button type="button" className="button button-ghost button-xs">Payment reference</button>}
                        fields={[
                          { name: "kind", label: "kind", type: "hidden", defaultValue: "appointment" },
                          { name: "id", label: "id", type: "hidden", defaultValue: appointment.id },
                          { name: "reference", label: "Transfer reference / TID", required: true, placeholder: "e.g. 8842 1170 3391" },
                        ]}
                        submitLabel="Submit reference"
                      />
                    ) : null}
                    <span className="spacer" />
                    <WhatsAppButton message={`Assalam-o-Alaikum, about booking ${appointment.ref} (${appointment.serviceTitle}) for ${appointment.petName}.`} label="Message clinic" className="button button-ghost button-xs" />
                  </div>

                  {appointment.timeline.length > 1 ? (
                    <div className="timeline" style={{ marginTop: 16 }}>
                      {appointment.timeline.slice().reverse().map((entry, i) => (
                        <div key={`${entry.at}-${i}`} className="timeline-item" data-done="true">
                          <span className="timeline-dot" />
                          <div><b className="small">{entry.label}</b><small>{entry.by} · {ago(entry.at)}</small></div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            );
          }) : (
            <Empty title={`No ${status ?? ""} appointments`} href="/book-vet-appointment-lahore" hrefLabel="Book a visit" icon={<Calendar size={24} />}>
              Home visits and hospital slots are usually available within 48 hours.
            </Empty>
          )}
        </div>
      </section>

      <section className="grid cols-2">
        <div className="app-card card-pad" style={{ background: "linear-gradient(150deg,#f8f4ec,#fffdfa)" }}>
          <Eyebrow>Change of plan</Eyebrow>
          <h3 style={{ margin: "10px 0 6px", fontSize: 20 }}>Same-day changes</h3>
          <p className="small muted" style={{ margin: "0 0 12px" }}>
            The portal stops accepting same-day changes once a veterinarian is dispatched. Call the desk — they can usually catch the
            vet before the next stop.
          </p>
          <a href={business.phoneHref} className="button button-dark button-sm">{business.phone}</a>
        </div>
        <div className="app-card card-pad">
          <Eyebrow>Payment</Eyebrow>
          <h3 style={{ margin: "10px 0 6px", fontSize: 20 }}>Nothing is charged online</h3>
          <p className="small muted" style={{ margin: 0 }}>
            Pay the veterinarian in cash after the visit, or transfer to the clinic account and add the reference here. Card payments are
            taken on the desk terminal at Al Kabir Town.
          </p>
        </div>
      </section>
    </>
  );
}
