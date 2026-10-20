"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Package, Pencil, Plus, Save, Search, Trash2, X } from "lucide-react";
import { ProductImage } from "@/components/product-image";
import { pkr } from "@/lib/format";
import { categories } from "@/lib/site";
import { discountPercent, sellingPrice, type ProductImageKind, type StoreProduct } from "@/lib/types";

const KINDS: { value: ProductImageKind; label: string }[] = [
  { value: "food-bag", label: "Food bag" }, { value: "food-pouch", label: "Food pouch" },
  { value: "kitten-food", label: "Kitten food" }, { value: "litter", label: "Litter sack" },
  { value: "toy", label: "Rope toy" }, { value: "wand", label: "Cat wand" },
  { value: "harness", label: "Harness" }, { value: "grooming", label: "Grooming kit" },
  { value: "bowls", label: "Bowls" }, { value: "treats", label: "Treats jar" },
  { value: "bed", label: "Pet bed" }, { value: "carrier", label: "Carrier" },
  { value: "wet-food", label: "Wet food tins" }, { value: "supplement", label: "Supplement" },
  { value: "record-kit", label: "Record kit" },
];

type FormState = {
  name: string; slug: string; categorySlug: string; unit: string; price: string; salePrice: string;
  stock: string; imageKind: ProductImageKind; imageUrl: string; description: string; highlights: string;
  featured: boolean; active: boolean;
};

const EMPTY: FormState = {
  name: "", slug: "", categorySlug: categories[0].slug, unit: "", price: "", salePrice: "",
  stock: "20", imageKind: "food-bag", imageUrl: "", description: "", highlights: "", featured: false, active: true,
};

function toForm(p: StoreProduct): FormState {
  return {
    name: p.name, slug: p.slug, categorySlug: p.categorySlug, unit: p.unit,
    price: String(p.price), salePrice: p.salePrice ? String(p.salePrice) : "", stock: String(p.stock),
    imageKind: p.imageKind, imageUrl: p.imageUrl, description: p.description,
    highlights: p.highlights.join("\n"), featured: p.featured, active: p.active,
  };
}

export function AdminProducts({ products, canEdit }: { products: StoreProduct[]; canEdit: boolean }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<StoreProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<StoreProduct | null>(null);

  const filtered = useMemo(() => products.filter((p) =>
    `${p.name} ${p.slug} ${p.categorySlug}`.toLowerCase().includes(search.trim().toLowerCase())), [products, search]);

  async function remove() {
    if (!confirmDelete) return;
    await fetch(`/api/products/${confirmDelete.id}`, { method: "DELETE" });
    setConfirmDelete(null);
    router.refresh();
  }

  return (
    <div>
      <div className="admin-filters no-print">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search products</span>
          <input type="search" placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <span className="results-count">{filtered.length} products</span>
        <span style={{ flex: 1 }} />
        {canEdit && <button type="button" className="button button-gold" onClick={() => setCreating(true)}><Plus size={16} /> Add product</button>}
      </div>
      {!canEdit && <p className="form-info-summary" style={{ marginBottom: 14 }}><Package size={16} /><span>Product editing is available to administrators. You can browse stock levels here.</span></p>}

      {filtered.length === 0 ? (
        <div className="empty-note"><Package size={24} /><strong>No products match</strong>Try another search, or add your first product.</div>
      ) : (
        <div className="table-wrap">
          <table className="data-table" style={{ minWidth: 820 }}>
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Featured</th><th>Visible</th>{canEdit && <th aria-label="Actions" />}</tr></thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={!p.active ? { opacity: 0.55 } : undefined}>
                  <td>
                    <span style={{ display: "flex", gap: 11, alignItems: "center" }}>
                      <span style={{ position: "relative", width: 46, height: 46, borderRadius: 9, overflow: "hidden", flex: "none", display: "block" }}>
                        <ProductImage product={p} />
                      </span>
                      <span><span className="cell-strong">{p.name}</span><span className="cell-sub">{p.unit || "—"} · /shop/{p.slug}</span></span>
                    </span>
                  </td>
                  <td>{categories.find((c) => c.slug === p.categorySlug)?.shortName ?? p.categorySlug}</td>
                  <td>
                    <span className="cell-strong">{pkr(sellingPrice(p))}</span>
                    {discountPercent(p) > 0 && <span className="cell-sub"><s>{pkr(p.price)}</s> · -{discountPercent(p)}%</span>}
                  </td>
                  <td>{p.stock <= 0 ? <span className="badge tone-red">Out of stock</span> : p.stock <= 5 ? <span className="badge tone-amber">{p.stock} left</span> : p.stock}</td>
                  <td>{p.featured ? <span className="badge tone-gold">Featured</span> : "—"}</td>
                  <td>{p.active ? <span className="badge tone-green">Live</span> : <span className="badge tone-grey">Hidden</span>}</td>
                  {canEdit && (
                    <td>
                      <div className="row-actions">
                        <button type="button" className="icon-btn" onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`}><Pencil size={15} /></button>
                        <button type="button" className="icon-btn danger" onClick={() => setConfirmDelete(p)} aria-label={`Delete ${p.name}`}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(creating || editing) && (
        <ProductDialog
          key={editing?.id ?? "new"}
          initial={editing ? toForm(editing) : EMPTY}
          editingId={editing?.id}
          onClose={() => { setCreating(false); setEditing(null); }}
        />
      )}
      {confirmDelete && (
        <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-label="Delete product">
          <div className="dialog" style={{ maxWidth: 440 }}>
            <h2>Delete this product?</h2>
            <p className="dialog-sub">“{confirmDelete.name}” will be removed from the Pet Mall permanently. Past order invoices keep their snapshot of the item.</p>
            <div className="dialog-actions">
              <button type="button" className="button button-danger-outline" onClick={remove}>Yes, delete</button>
              <span className="spacer" />
              <button type="button" className="button button-outline" onClick={() => setConfirmDelete(null)}>Keep product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductDialog({ initial, editingId, onClose }: { initial: FormState; editingId?: string; onClose: () => void }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (key: keyof FormState, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const previewProduct = {
    name: form.name || "Product preview", categorySlug: form.categorySlug, imageKind: form.imageKind, imageUrl: form.imageUrl,
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch(editingId ? `/api/products/${editingId}` : "/api/products", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price), salePrice: form.salePrice === "" ? null : Number(form.salePrice),
        stock: Number(form.stock),
        highlights: form.highlights.split("\n").map((line) => line.trim()).filter(Boolean),
      }),
    });
    const data = (await res.json()) as { error?: string };
    setBusy(false);
    if (!res.ok) { setError(data.error ?? "Could not save this product."); return; }
    router.refresh();
    onClose();
  }

  return (
    <div className="dialog-backdrop" role="dialog" aria-modal="true" aria-label={editingId ? "Edit product" : "Add product"}>
      <div className="dialog" style={{ maxWidth: 720 }}>
        <div className="card-head-row">
          <h2>{editingId ? "Edit product" : "Add a product"}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X size={16} /></button>
        </div>
        {error && <div className="form-error-summary" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
        <form className="form-grid" onSubmit={submit} noValidate>
          <div className="field field-full">
            <label htmlFor="pr-name">Product name <span>*</span></label>
            <input id="pr-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Premium Adult Cat Food — Salmon" />
          </div>
          <div className="field">
            <label htmlFor="pr-category">Category <span>*</span></label>
            <select id="pr-category" value={form.categorySlug} onChange={(e) => set("categorySlug", e.target.value)}>
              {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="pr-unit">Unit / pack size</label>
            <input id="pr-unit" value={form.unit} onChange={(e) => set("unit", e.target.value)} placeholder="e.g. 1.5 kg bag" />
          </div>
          <div className="field">
            <label htmlFor="pr-price">Price (PKR) <span>*</span></label>
            <input id="pr-price" type="number" min={1} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="3200" />
          </div>
          <div className="field">
            <label htmlFor="pr-sale">Sale price (PKR) <span className="optional">optional</span></label>
            <input id="pr-sale" type="number" min={0} value={form.salePrice} onChange={(e) => set("salePrice", e.target.value)} placeholder="2750" />
          </div>
          <div className="field">
            <label htmlFor="pr-stock">Stock quantity</label>
            <input id="pr-stock" type="number" min={0} value={form.stock} onChange={(e) => set("stock", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="pr-slug">URL slug <span className="optional">auto if blank</span></label>
            <input id="pr-slug" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="premium-cat-food" />
          </div>
          <div className="field">
            <label htmlFor="pr-kind">Packshot artwork</label>
            <select id="pr-kind" value={form.imageKind} onChange={(e) => set("imageKind", e.target.value)}>
              {KINDS.map((kind) => <option key={kind.value} value={kind.value}>{kind.label}</option>)}
            </select>
          </div>
          <div className="field" style={{ alignSelf: "end" }}>
            <span style={{ position: "relative", display: "block", width: 92, height: 92, borderRadius: 12, overflow: "hidden", border: "1px solid var(--line)" }}>
              <ProductImage product={previewProduct} />
            </span>
          </div>
          <div className="field field-full">
            <label htmlFor="pr-image">Real photo URL <span className="optional">overrides packshot</span></label>
            <input id="pr-image" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://… (leave blank to use the Jawad Select packshot)" />
          </div>
          <div className="field field-full">
            <label htmlFor="pr-desc">Description</label>
            <textarea id="pr-desc" rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="What makes this product great for pets?" />
          </div>
          <div className="field field-full">
            <label htmlFor="pr-highlights">Highlights <span className="optional">one per line</span></label>
            <textarea id="pr-highlights" rows={3} value={form.highlights} onChange={(e) => set("highlights", e.target.value)} placeholder={"Healthy & shiny fur\nSupports urinary health\nAdded taurine"} />
          </div>
          <div className="field field-full" style={{ display: "flex", gap: 22, flexWrap: "wrap" }}>
            <label className="checkbox-row"><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Feature on homepage</label>
            <label className="checkbox-row"><input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} /> Visible in Pet Mall</label>
          </div>
          <div className="dialog-actions field-full" style={{ marginTop: 2 }}>
            <button type="submit" className="button button-primary" disabled={busy}>{busy ? <Loader2 size={16} className="spin" /> : <Save size={16} />} {editingId ? "Save product" : "Add product"}</button>
            <span className="spacer" />
            <button type="button" className="button button-outline" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
