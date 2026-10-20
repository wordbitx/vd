import { PawPrint } from "lucide-react";
import { APPOINTMENT_STATUS_LABELS, barcodeBars, formatDate, formatDateTime, pkr } from "@/lib/format";
import { business } from "@/lib/site";
import type { Appointment } from "@/lib/types";

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\s/g, "");
  if (digits.length < 7) return phone;
  return `${digits.slice(0, 4)} •••• ${digits.slice(-3)}`;
}

export function Barcode({ value, height = 44 }: { value: string; height?: number }) {
  const bars = barcodeBars(value);
  return (
    <div className="barcode-wrap">
      <div className="barcode" style={{ height }} aria-hidden="true">
        {bars.map((w, i) => <i key={i} style={{ width: w }} />)}
      </div>
      <small>{value}</small>
    </div>
  );
}

const STAMP_TONES: Record<string, string> = {
  pending: "pending", confirmed: "", "checked-in": "", completed: "", cancelled: "cancelled", "no-show": "cancelled",
};

export function BookingSlip({ appointment, full = false }: { appointment: Appointment; full?: boolean }) {
  const a = appointment;
  return (
    <article className="slip print-sheet" aria-label={`Booking slip ${a.ref}`}>
      <header className="slip-head">
        <span className="slip-logo-mark" aria-hidden="true"><PawPrint size={27} /></span>
        <div>
          <h2>{business.name}</h2>
          <p>{business.address}<br />{business.phone} · {business.email}</p>
        </div>
        <div className="slip-doc-type">
          <small>Booking Slip</small>
          <strong>{a.ref}</strong>
        </div>
      </header>

      <div className="slip-token-row">
        <div className="slip-token">
          <small>Token No.</small>
          <strong>{a.token}</strong>
          <span>{formatDate(a.date)}</span>
        </div>
        <div className="slip-token-side">
          <div className="st-fact"><span>Appointment time</span><strong>{a.timeSlot}</strong></div>
          <div className="st-fact"><span>Visit type</span><strong>{a.visitType === "home" ? "Home Visit" : "Hospital Visit"}{a.emergency ? " · Emergency" : ""}</strong></div>
          <div className="st-fact"><span>Status</span><strong>{APPOINTMENT_STATUS_LABELS[a.status]}</strong></div>
          <div className="st-fact"><span>Booked on</span><strong>{formatDateTime(a.createdAt)}</strong></div>
        </div>
      </div>

      <div className="slip-body">
        <div className="slip-grid">
          <p className="slip-section-title">Pet &amp; Service</p>
          <div className="slip-field"><span>Pet name</span><strong>{a.petName}</strong></div>
          <div className="slip-field"><span>Service</span><strong>{a.serviceTitle}</strong></div>
          <div className="slip-field"><span>Species{a.petBreed ? " / Breed" : ""}</span><strong>{a.petType}{a.petBreed ? ` · ${a.petBreed}` : ""}</strong></div>
          <div className="slip-field"><span>Pet age</span><strong>{a.petAge || "—"}</strong></div>
          {a.symptoms && <div className="slip-field wide"><span>Symptoms / notes</span><strong>{a.symptoms}</strong></div>}

          <p className="slip-section-title">Owner &amp; Visit</p>
          <div className="slip-field"><span>Owner</span><strong>{a.ownerName}</strong></div>
          <div className="slip-field"><span>Phone / WhatsApp</span><strong>{full ? a.ownerPhone : maskPhone(a.ownerPhone)}</strong></div>
          {a.doctorName && <div className="slip-field"><span>Veterinarian</span><strong>{a.doctorName}</strong></div>}
          <div className="slip-field"><span>{a.visitType === "home" ? "Visit address" : "Hospital address"}</span>
            <strong>{a.visitType === "home" ? `${a.address}${a.area ? `, ${a.area}` : ""}, Lahore` : business.address}</strong>
          </div>
          {a.vetNotes && full && <div className="slip-field wide"><span>Vet notes / prescription</span><strong style={{ whiteSpace: "pre-line" }}>{a.vetNotes}</strong></div>}
          {a.followUpDate && <div className="slip-field"><span>Follow-up date</span><strong>{formatDate(a.followUpDate)}</strong></div>}

          <p className="slip-section-title">Charges</p>
          <div className="slip-field"><span>{a.emergency ? "Emergency visiting charges" : "Visiting charges"}</span><strong>{pkr(a.fee)}</strong></div>
          <div className="slip-field"><span>Service / medicine charges</span><strong>Confirmed before treatment</strong></div>
        </div>
      </div>

      <footer className="slip-foot">
        <Barcode value={a.ref} />
        <p>
          {a.visitType === "hospital"
            ? "Please arrive 10 minutes early and show this slip (or your token number) at reception. Keep your pet on a leash or in a carrier."
            : "Our vet will call before arriving. Please keep your pet in a quiet room with previous records ready."}{" "}
          To reschedule, WhatsApp us at {business.phone} with your booking reference.
        </p>
        <span className={`slip-stamp ${STAMP_TONES[a.status] ?? ""}`}>{APPOINTMENT_STATUS_LABELS[a.status]}</span>
      </footer>
    </article>
  );
}
