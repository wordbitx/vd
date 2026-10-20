import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ClipboardList, Printer, ShoppingBag, Truck } from "lucide-react";
import { DialogForm } from "@/components/forms";
import { Empty, Eyebrow } from "@/components/ui";
import { ReorderButton } from "@/components/portal/reorder-button";
import { requestOrderChange, uploadPaymentProof } from "@/server/actions/shop";
import { ordersForUser } from "@/server/queries";
import { requireUser } from "@/server/auth";
import { ago, money } from "@/lib/format";

const stageLabels: Record<string, string> = { pending: "Placed", packed: "Packed", dispatched: "On the way", delivered: "Delivered", cancelled: "Cancelled" };
const stageIndex: Record<string, number> = { pending: 0, packed: 1, dispatched: 2, delivered: 3 };

export default async function PortalOrders() {
  const user = await requireUser();
  const orders = await ordersForUser(user.id);

  return (
    <>
      <section className="app-card">
        <div className="app-card-head">
          <div><h2>Pet mall orders</h2><p>Same-day delivery inside Lahore for orders confirmed before 4 pm.</p></div>
          <span className="spacer" />
          <Link href="/shop" className="button button-primary button-sm"><ShoppingBag size={15} /> Shop again</Link>
        </div>
        <div className="app-card-body col" style={{ gap: 14 }}>
          {orders.length ? orders.map((order) => {
            const step = stageIndex[order.status] ?? -1;
            return (
              <article key={order.id} className="card" style={{ overflow: "hidden" }}>
                <div className="row-between" style={{ padding: "15px 18px", gap: 12, borderBottom: "1px solid var(--line)" }}>
                  <div className="row" style={{ gap: 12 }}>
                    <span className="table-ref">{order.ref}</span>
                    <span className={`status status-${order.status}`}>{stageLabels[order.status] ?? order.status}</span>
                    <span className="tiny muted">{ago(order.createdAt)}</span>
                  </div>
                  <div className="row" style={{ gap: 12 }}>
                    <span className="tiny muted">{order.payment.status === "paid" ? "Paid" : "Due on delivery"}</span>
                    <b style={{ fontFamily: "var(--serif)", fontSize: 19, fontWeight: 500, letterSpacing: "-0.03em" }}>{money(order.total)}</b>
                  </div>
                </div>

                <div className="card-pad" style={{ display: "grid", gap: 14 }}>
                  <div className="col" style={{ gap: 10 }}>
                    {order.items.map((item) => (
                      <div key={`${item.productId}-${item.size ?? ""}`} className="row" style={{ gap: 12 }}>
                        <span className="cart-thumb" style={{ width: 54, height: 46 }}>
                          <Image src={item.image} alt="" width={108} height={92} className="object-cover" unoptimized />
                        </span>
                        <div className="col" style={{ gap: 1, flex: 1 }}>
                          <b className="small">{item.name}</b>
                          <span className="tiny muted">{item.qty} × {money(item.price)}{item.size ? ` · ${item.size}` : ""}</span>
                        </div>
                        <b className="small tnum">{money(item.price * item.qty)}</b>
                      </div>
                    ))}
                  </div>

                  {order.status !== "cancelled" ? (
                    <div className="row" style={{ gap: 0, alignItems: "center" }}>
                      {["Placed", "Packed", "On the way", "Delivered"].map((label, i) => (
                        <div key={label} className="row" style={{ flex: 1, gap: 8 }}>
                          <span style={{ width: 18, height: 18, borderRadius: 99, display: "grid", placeItems: "center", background: i <= step ? "var(--brand)" : "#e9e4d8", color: i <= step ? "#fff" : "var(--muted)", fontSize: 9, fontWeight: 800 }}>{i + 1}</span>
                          <span className="tiny" style={{ fontWeight: 700, color: i <= step ? "var(--ink)" : "var(--muted-2)" }}>{label}</span>
                          {i < 3 ? <span style={{ flex: 1, height: 1, background: i < step ? "var(--brand)" : "var(--line-2)", marginRight: 8 }} /> : null}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="row" style={{ gap: 8, paddingTop: 10, borderTop: "1px dashed var(--line-2)" }}>
                    <span className="tiny muted" style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}><Truck size={12} style={{ verticalAlign: "-2px" }} /> {order.address}</span>
                    <span className="spacer" />
                    <Link href={`/slip/${order.ref}?kind=order`} className="button button-ghost button-xs"><Printer size={13} /> Invoice</Link>
                    <ReorderButton orderId={order.id} />
                    {order.payment.status === "unpaid" ? (
                      <DialogForm
                        action={uploadPaymentProof}
                        title="Add your payment reference"
                        trigger={<button type="button" className="button button-ghost button-xs">Payment ref</button>}
                        fields={[
                          { name: "kind", label: "kind", type: "hidden", defaultValue: "order" },
                          { name: "id", label: "id", type: "hidden", defaultValue: order.id },
                          { name: "reference", label: "Transfer reference / TID", required: true, placeholder: "e.g. 8842 1170 3391" },
                        ]}
                        submitLabel="Submit reference"
                      />
                    ) : null}
                    {["pending", "packed"].includes(order.status) ? (
                      <DialogForm
                        action={requestOrderChange}
                        title="Change or cancel this order"
                        description="The fulfilment desk reads this before the rider leaves."
                        trigger={<button type="button" className="button button-ghost button-xs">Change</button>}
                        fields={[
                          { name: "id", label: "id", type: "hidden", defaultValue: order.id },
                          { name: "action", label: "What do you need?", type: "select", options: [{ value: "cancel", label: "Cancel the order" }, { value: "address", label: "Change the address" }, { value: "time", label: "Change the delivery time" }], required: true },
                          { name: "reason", label: "Note for the team", type: "textarea", rows: 3, required: true },
                        ]}
                        submitLabel="Send request"
                      />
                    ) : null}
                  </div>
                </div>
              </article>
            );
          }) : (
            <Empty title="No orders yet" href="/shop" hrefLabel="Open the pet mall" icon={<ClipboardList size={24} />}>
              Food, grooming and pharmacy essentials delivered across Lahore — free above Rs. 5,000.
            </Empty>
          )}
        </div>
      </section>

      <section className="grid cols-2">
        <div className="app-card card-pad">
          <Eyebrow>Delivery</Eyebrow>
          <h3 style={{ margin: "10px 0 6px", fontSize: 20 }}>Where we deliver, and when</h3>
          <p className="small muted" style={{ margin: "0 0 12px" }}>
            Al Kabir Town, Raiwind Road, Johar Town, Bahria Town, DHA, Gulberg, Model Town, Askari 11, Valencia and Faisal Town.
            Orders confirmed before 4 pm arrive the same evening; later orders go out the next morning.
          </p>
          <Link href="/shop" className="button button-dark button-sm">Browse the pet mall <ArrowRight size={14} /></Link>
        </div>
        <div className="app-card card-pad">
          <Eyebrow>Returns</Eyebrow>
          <h3 style={{ margin: "10px 0 6px", fontSize: 20 }}>Unopened, in-date stock</h3>
          <p className="small muted" style={{ margin: 0 }}>
            Return within 7 days with the invoice for a refund or exchange. Medicines, opened food and prescription diets are excluded
            for safety — but message us and we will find a fair outcome.
          </p>
        </div>
      </section>
    </>
  );
}
