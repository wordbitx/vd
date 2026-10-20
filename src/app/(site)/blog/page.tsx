import { redirect } from "next/navigation";

/** The journal moved to /pet-care-tips; keep old links working. */
export default function LegacyBlog() {
  redirect("/pet-care-tips");
}
