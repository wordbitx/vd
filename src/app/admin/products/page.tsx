import { PortalHead } from "@/components/portal-shell";
import { AdminProducts } from "@/components/admin-products";
import { requireRole } from "@/lib/auth";
import { listProducts } from "@/lib/hospital-db";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("Products · Admin", "Manage Pet Mall products, prices and stock.", "/admin/products");
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminProductsPage() {
  const user = await requireRole(["admin", "vet"], "/admin/products");
  const products = listProducts(false);
  return (
    <div>
      <PortalHead
        eyebrow="Pet Mall"
        title="Products & stock"
        description="Prices, sale offers and stock update instantly across the shop, homepage and checkout."
      />
      <AdminProducts products={products} canEdit={user.role === "admin"} />
    </div>
  );
}
