import { Star } from "lucide-react";
import { InlineButton } from "@/components/admin/inline-form";
import { publishReview } from "@/server/actions/admin";
import { rows } from "@/server/store";
import { dateLabel } from "@/lib/format";

export default async function AdminReviews() {
  const reviews = await rows("reviews");
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <>
      <div className="kpi-grid">
        {[
          { label: "Published reviews", value: String(reviews.filter((r) => r.status === "published").length), sub: `Average ${avg.toFixed(1)} / 5` },
          { label: "Awaiting moderation", value: String(reviews.filter((r) => r.status === "pending").length), sub: "Publish or leave hidden" },
          { label: "Five-star", value: String(reviews.filter((r) => r.rating === 5).length), sub: "Of all reviews" },
          { label: "Services mentioned", value: String(new Set(reviews.map((r) => r.service)).size), sub: "Useful for the home page" },
        ].map((card) => (
          <div key={card.label} className="kpi">
            <span className="kpi-label">{card.label}</span>
            <div className="kpi-value">{card.value}</div>
            <span className="tiny muted">{card.sub}</span>
          </div>
        ))}
      </div>

      <section className="app-card">
        <div className="app-card-head"><div><h2>Reviews</h2><p>Only published reviews appear on the website. Never edit a client’s words — reply beside them instead.</p></div></div>
        <div className="app-card-body grid" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(340px,1fr))" }}>
          {reviews.map((review) => (
            <article key={review.id} className="card card-pad col" style={{ gap: 10 }}>
              <div className="row-between" style={{ gap: 10 }}>
                <div>
                  <b style={{ fontSize: 14.5 }}>{review.author}</b>
                  <div className="tiny muted">{review.area} · {review.service} · {dateLabel(review.at)}</div>
                </div>
                <span className={`status status-${review.status === "published" ? "completed" : "draft"}`}>{review.status}</span>
              </div>
              <span className="stars">{[1, 2, 3, 4, 5].slice(0, review.rating).map((i) => <Star key={i} size={13} fill="currentColor" strokeWidth={0} />)}</span>
              <p className="small" style={{ margin: 0, color: "var(--ink-2)" }}>{review.text}</p>
              <div className="row" style={{ gap: 8, borderTop: "1px solid var(--line)", paddingTop: 10 }}>
                <InlineButton action={publishReview} payload={{ id: review.id, status: review.status === "published" ? "pending" : "published" }} className="button button-ghost button-xs">
                  {review.status === "published" ? "Unpublish" : "Publish"}
                </InlineButton>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
