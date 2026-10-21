import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { business, primaryNav } from "@/lib/site";
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
    <div className="site-shell">
      <SiteHeader
        links={primaryNav}
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
      <div className="v-mobilebar r-mobilebar">
        <a href={`tel:${(settings?.phone ?? business.phone).replace(/[^\d+]/g, "")}`} className="v-mobilebar-em r-mobilebar-em">Emergency</a>
        <a href="/book-vet-appointment-lahore" className="v-mobilebar-book r-mobilebar-book">Book Visit</a>
      </div>
    </div>
  );
}
