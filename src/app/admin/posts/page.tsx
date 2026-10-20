import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { DialogForm, type FieldDef } from "@/components/forms";
import { InlineButton } from "@/components/admin/inline-form";
import { deletePost, savePost } from "@/server/actions/admin";
import { rows } from "@/server/store";
import { dateLabel, todayISO } from "@/lib/format";

export default async function AdminPosts() {
  const posts = await rows("posts");

  const fields = (post?: typeof posts[number]): FieldDef[] => [
    { name: "id", label: "id", type: "hidden", defaultValue: post?.id },
    { name: "title", label: "Title", required: true, span: 2, defaultValue: post?.title },
    { name: "category", label: "Category", type: "select", options: ["Vet Tips", "Everyday care", "Preventive care", "Nutrition", "Pet wellbeing", "Clinic news"], defaultValue: post?.category ?? "Vet Tips" },
    { name: "date", label: "Publish date", type: "date", defaultValue: post?.date ?? todayISO() },
    { name: "readTime", label: "Read time", defaultValue: post?.readTime ?? "4 min read" },
    { name: "image", label: "Image", type: "image", defaultValue: post?.image ?? "/images/consultation.jpg", span: 2 },
    { name: "excerpt", label: "Standfirst / excerpt", type: "textarea", rows: 2, span: 2, defaultValue: post?.excerpt },
    { name: "heading", label: "First section heading", defaultValue: post?.body[0]?.heading ?? "What pet parents should know" },
    { name: "paragraph", label: "Paragraphs", type: "list", defaultValue: post?.body[0]?.paragraphs ?? [], span: 2 },
    { name: "bullet", label: "Bullet points", type: "list", defaultValue: post?.body[0]?.bullets ?? [], span: 2 },
    { name: "publish", label: "Publish immediately", type: "toggle", defaultValue: post?.status === "published" },
  ];

  return (
    <>
      <div className="kpi-grid">
        {[
          { label: "Articles", value: String(posts.length), sub: `${posts.filter((p) => p.status === "published").length} published` },
          { label: "Drafts", value: String(posts.filter((p) => p.status === "draft").length), sub: "Finish before publishing" },
          { label: "Categories", value: String(new Set(posts.map((p) => p.category)).size), sub: "Used for the journal filter" },
          { label: "Latest", value: posts.slice().sort((a, b) => b.date.localeCompare(a.date))[0]?.date ? dateLabel(posts.slice().sort((a, b) => b.date.localeCompare(a.date))[0].date).slice(0, 6) : "—", sub: "Most recent publish date" },
        ].map((card) => (
          <div key={card.label} className="kpi">
            <span className="kpi-label">{card.label}</span>
            <div className="kpi-value">{card.value}</div>
            <span className="tiny muted">{card.sub}</span>
          </div>
        ))}
      </div>

      <section className="app-card">
        <div className="app-card-head">
          <div><h2>Journal &amp; events</h2><p>Guides should be reviewed by a veterinarian before publishing — the editor keeps the caveats.</p></div>
          <span className="spacer" />
          <DialogForm action={savePost} title="New article" trigger={<button type="button" className="button button-primary button-sm"><Plus size={15} /> Write an article</button>} fields={fields()} submitLabel="Save article" />
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Article</th><th>Category</th><th>Date</th><th>Status</th><th /></tr></thead>
            <tbody>
              {posts.slice().sort((a, b) => b.date.localeCompare(a.date)).map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className="row" style={{ gap: 11 }}>
                      <span style={{ width: 54, height: 42, borderRadius: 9, overflow: "hidden", background: "linear-gradient(150deg,#e6ece9,#f0e9dc)", flex: "none" }}>
                        <Image src={post.image} alt="" width={108} height={84} className="object-cover" unoptimized />
                      </span>
                      <div>
                        <span className="table-cell-title">{post.title}</span>
                        <div className="table-cell-sub">{post.slug.slice(0, 52)} · {post.readTime}</div>
                      </div>
                    </div>
                  </td>
                  <td className="small">{post.category}</td>
                  <td className="small tnum">{dateLabel(post.date)}</td>
                  <td><span className={`status status-${post.status === "published" ? "completed" : "draft"}`}>{post.status}</span></td>
                  <td>
                    <div className="table-actions">
                      <DialogForm action={savePost} title="Edit article" trigger={<button type="button" className="icon-btn" aria-label="Edit"><Pencil size={14} /></button>} fields={fields(post)} values={{ id: post.id, title: post.title, category: post.category, date: post.date, readTime: post.readTime, image: post.image, excerpt: post.excerpt, heading: post.body[0]?.heading, paragraph: post.body[0]?.paragraphs ?? [], bullet: post.body[0]?.bullets ?? [], publish: post.status === "published" }} submitLabel="Save changes" />
                      <InlineButton action={deletePost} payload={{ id: post.id }} confirmText={`Delete “${post.title}”? This cannot be undone.`} className="icon-btn icon-btn-danger" title="Delete"><Trash2 size={14} /></InlineButton>
                      <Link href={`/pet-care-tips/${post.slug}`} target="_blank" className="icon-btn" aria-label="Preview"><ArrowUpRight size={14} /></Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-foot">
          <span><FileText size={12} style={{ verticalAlign: "-2px" }} /> Article bodies use one section in this editor; the public page renders paragraphs and bullets as written.</span>
          <Link href="/pet-care-tips" className="link-arrow" target="_blank">Open the journal</Link>
        </div>
      </section>
    </>
  );
}
