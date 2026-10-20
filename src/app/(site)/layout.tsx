import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { business, navLinks } from "@/lib/site";
import { currentUser } from "@/server/auth";
import { catalogCategories } from "@/server/catalog";
import { getSettings } from "@/server/store";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const [user, settings, categories] = await Promise.all([
    currentUser().catch(() => null),
    getSettings().catch(() => undefined),
    catalogCategories().catch(() => []),
  ]);

  return (
    <>
      <SiteHeader
        links={navLinks.filter((l) => l.href !== "/portal")}
        user={user}
        clinicName={settings?.clinicName ?? business.name}
        monogram={settings?.monogram ?? business.monogram}
        tagline={settings?.tagline ?? business.tagline}
        phone={settings?.phone ?? business.phone}
        announcement={settings?.announcement}
        announcementHref={settings?.announcementHref}
      />
      <main id="main-content" style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</main>
      <SiteFooter settings={settings} productCategories={categories} />
    </>
  );
}
