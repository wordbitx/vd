import type { Metadata } from "next";
import { PostCard } from "@/components/cards";
import { catalogPosts } from "@/server/catalog";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Events & Tips — pet health advice from our vets",
  "Events, daily insights and pet health tips from the veterinary team at Jawad Veterinary Hospital — written or reviewed by our clinicians.",
  "/pet-care-tips",
  "/images/vaccination.jpg",
);

export default async function EventsPage() {
  const posts = await catalogPosts();

  return (
    <>
      <section className="r-pagehero">
        <div className="r-wrap">
          <div className="r-pagehero-inner r-pagehero-single">
            <div>
              <h1>Events &amp; Tips</h1>
              <p>Browse the latest events, daily insights and pet health tips from our veterinary experts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="r-section" style={{ paddingTop: 30 }}>
        <div className="r-wrap">
          {posts.length ? (
            <div className="r-posts r-posts-3">
              {posts.map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <div className="r-empty">Guides are being written — check back soon.</div>
          )}
        </div>
      </section>
    </>
  );
}
