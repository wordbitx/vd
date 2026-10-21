"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/server/auth";
import { audit, insert } from "@/server/store";
import { checkbox, field, oneOf, required } from "@/server/validate";
import type { FieldErrors } from "@/server/validate";

export type AdoptionPostResult = { ok: boolean; message?: string; errors?: FieldErrors };

/** A signed-in client can list an animal for adoption — exactly the flow behind "Post Pet" on the reference. */
export async function postAdoptionListing(_prev: AdoptionPostResult | null, form: FormData): Promise<AdoptionPostResult> {
  const errors: FieldErrors = {};
  const user = await currentUser();
  if (!user) return { ok: false, message: "Please sign in to post a pet.", errors };

  const name = required(form, errors, "name", "Pet's name", 40);
  const species = oneOf(form, "species", ["Dog", "Cat", "Rabbit", "Bird", "Other"] as const, "Other");
  const sex = oneOf(form, "sex", ["Male", "Female", "Unknown"] as const, "Unknown");
  const breed = (field(form, "breed") || "Mixed breed").slice(0, 60);
  const age = (field(form, "age") || "Age not given").slice(0, 30);
  const story = required(form, errors, "story", "A short story", 600);
  const contact = (field(form, "contact") || user.phone || "").slice(0, 40);

  if (Object.keys(errors).length || !name || !story) {
    return { ok: false, errors, message: "Please complete the name, species and story." };
  }

  const id = `ad${Date.now().toString(36)}`;
  await insert("adoption", {
    id,
    name,
    species,
    breed,
    age,
    sex,
    status: "available",
    image: "/images/adopt-1.jpg",
    story: `${story}\n\nPosted by ${user.name}${contact ? ` · ${contact}` : ""}`,
    vaccinated: checkbox(form, "vaccinated"),
    dewormed: checkbox(form, "dewormed"),
    traits: [],
    postedAt: new Date().toISOString().slice(0, 10),
  });
  await audit(user.name, "Posted a pet for adoption", name, species);

  revalidatePath("/adopt");
  revalidatePath("/admin/adoption");
  redirect("/adopt?posted=1");
}
