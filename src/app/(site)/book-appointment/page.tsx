import { redirect } from "next/navigation";

/** Legacy URL kept alive for links already shared with clients. */
export default function LegacyBooking() {
  redirect("/book-vet-appointment-lahore");
}
