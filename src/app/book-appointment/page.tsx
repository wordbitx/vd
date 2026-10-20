import { redirect } from "next/navigation";

// Legacy path kept working — the booking experience now lives at /book.
export default async function LegacyBookAppointmentPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  redirect(service ? `/book?service=${encodeURIComponent(service)}` : "/book");
}
