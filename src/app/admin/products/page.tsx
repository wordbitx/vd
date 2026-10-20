import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Package, Pencil, Plus } from "lucide-react";
import { DialogForm, type FieldDef } from "@/components/forms";
import { InlineButton } from "@/components/admin/inline-form";
import { adjustStock, saveProduct, toggleProduct } from "@/server/actions/admin";
import { rows } from "@/server/store";
import { categories } from "@/lib/site";
import { money } from "@/lib/format";

export default async function AdminProducts() {
  const products = await rows("products");
  const low = products.filter((p) => p.active && p.stock <= 15);
  const value = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const fields = (product?: typeof products[number]): FieldDef[] => [
    { name: "id", label: "id", type: "hidden", defaultValue: product?.id },
    { name: "name", label: "Product name", required: true, span: 2, defaultValue: product?.name },
    { name: "brand", label: "Brand", defaultValue: product?.brand, placeholder: "VetCare" },
    { name: "categorySlug", label: "Category", type: "select", options: categories.map((c) => ({ value: c.slug, label: c.name })), defaultValue: product?.categorySlug ?? "dog-food" },
    { name: "price", label: "Price (PKR)", type: "money", required: true, defaultValue: product?.price },
    { name: "compareAt", label: "Compare-at price (optional)", type: "money", defaultValue: product?.compareAt },
    { name: "stock", label: "Stock on hand", type: "number", defaultValue: product?.stock ?? 10 },
    { name: "badge", label: "Badge (optional)", defaultValue: product?.badge, placeholder: "Best seller" },
    { name: "description", label: "Description", type: "textarea", rows: 3, span: 2, defaultValue: product?.description },
    { name: "highlights", label: "Highlights", type: "list", defaultValue: product?.highlights ?? [], span: 2 },
    { name: "image", label: "Image", type: "image", defaultValue: product?.image ?? "/images/product-dog-food.jpg", span: 2 },
    { name: "active", label: "Live in the Pet Mall", type: "toggle", defaultValue: product?.active ?? true },
    { name: "featured", label: "Feature on the home page", type: "toggle", defaultValue: product?.featured ?? false },
  ];

  return (
    <>
      <div className="kpi-grid">
        {[
          { label: "Products", value: String(products.length), sub: `${products.filter((p) => p.active).length} live · ${products.filter((p) => !p.active).length} hidden` },
          { label: "Stock value", value: money(value), sub: "Retail value of shelves on hand" },
          { label: "Low stock", value: String(low.length), sub: "At or below 15 units" },
          { label: "Featured", value: String(products.filter((p) => p.featured).length), sub: "Shown on the home page" },
        ].map((card) => (
          <div key={card.label} className="kpi">
            <span className="kpi-label">{card.label}</span>
            <div className="kpi-value">{card.value}</div>
            <span className="tiny muted">{card.sub}</span>
          </div>
        ))}
      </div>

      {low.length ? (
        <div className="note note-brass">
          <AlertTriangle size={16} />
          <span><b>Restock soon:</b> {low.map((p) => `${p.name} (${p.stock})`).join(", ")}.</span>
        </div>
      ) : null}

      <section className="app-card">
        <div className="app-card-head">
          <div><h2>Pet mall catalogue</h2><p>Prices here drive the shop, the basket and every invoice.</p></div>
          <span className="spacer" />
          <DialogForm action={saveProduct} title="Add a product" description="Images can be picked from the clinic image set; uploads come later." trigger={<button type="button" className="button button-primary button-sm"><Plus size={15} /> New product</button>} fields={fields()} submitLabel="Publish product" />
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Product</th><th>Category</th><th className="num">Price</th><th>Stock</th><th>Status</th><th /></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className="row" style={{ gap: 11 }}>
                      <span style={{ width: 42, height: 38, borderRadius: 9, overflow: "hidden", background: "linear-gradient(150deg,#e6ece9,#f0e9dc)", flex: "none" }}>
                        <Image src={product.image} alt="" width={84} height={76} className="object-cover" unoptimized />
                      </span>
                      <div>
                        <span className="table-cell-title">{product.name}</span>
                        <div className="table-cell-sub">{product.brand} · {product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="small">{categories.find((c) => c.slug === product.categorySlug)?.name ?? product.categorySlug}</td>
                  <td className="num">{money(product.price)}{product.compareAt ? <div className="table-cell-sub"><s>{money(product.compareAt)}</s></div> : null}</td>
                  <td>
                    <span className={`pill ${product.stock <= 0 ? "pill-danger" : product.stock <= 15 ? "pill-warn" : "pill-ok"}`} style={{ fontSize: 10 }}>{product.stock} units</span>
                  </td>
                  <td><span className={`status status-${product.active ? "completed" : "archived"}`}>{product.active ? "Live" : "Hidden"}</span>{product.featured ? <span className="pill pill-brass" style={{ marginLeft: 6, fontSize: 9 }}>Featured</span> : null}</td>
                  <td>
                    <div className="table-actions">
                      <DialogForm action={saveProduct} title={`Edit ${product.name}`} trigger={<button type="button" className="icon-btn" aria-label="Edit"><Pencil size={14} /></button>} fields={fields(product)} values={{ id: product.id, name: product.name, brand: product.brand, categorySlug: product.categorySlug, price: product.price, compareAt: product.compareAt, stock: product.stock, badge: product.badge, description: product.description, highlights: product.highlights, image: product.image, active: product.active, featured: product.featured }} submitLabel="Save product" />
                      <InlineButton action={adjustStock} payload={{ id: product.id, delta: "10" }} title="Add 10 units">+10</InlineButton>
                      <InlineButton action={adjustStock} payload={{ id: product.id, delta: "-1" }} title="Remove one unit">−1</InlineButton>
                      <InlineButton action={toggleProduct} payload={{ id: product.id }} className="button button-ghost button-xs">{product.active ? "Hide" : "Publish"}</InlineButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <span>{products.length} products · stock changes are written to the audit log</span>
          <Link href="/shop" className="link-arrow">Preview the shop <Package size={13} /></Link>
        </div>
      </section>
    </>
  );
}
