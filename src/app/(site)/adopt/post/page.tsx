import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AdoptionPostForm } from "@/components/adoption-post-form";
import { currentUser } from "@/server/auth";
import { noIndex } from "@/lib/metadata";

export const metadata: Metadata = { title: "Post a pet for adoption", ...noIndex };

export default async function PostPetPage() {
  const user = await currentUser().catch(() => null);
  if (!user) redirect("/login?next=/adopt/post");

  return (
    <section className="r-section" style={{ paddingTop: 44 }}>
      <div className="r-wrap" style={{ maxWidth: 920 }}>
        <div className="r-panel">
          <span className="r-kicker">Adoption desk</span>
          <h1 style={{ margin: "10px 0 8px", fontSize: "clamp(28px, 3.2vw, 40px)" }}>Post a Pet for Adoption</h1>
          <p className="r-muted-copy" style={{ margin: "0 0 22px" }}>
            Rehoming an animal? Add the details here and the clinic will review the listing. Every pet must be examined,
            dewormed and vaccinated before it goes on the adoption page.
          </p>
          <AdoptionPostForm />
        </div>
      </div>
    </section>
  );
}
