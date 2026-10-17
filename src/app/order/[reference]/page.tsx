"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, Copy, MessageCircle, Phone, RefreshCw } from "lucide-react";
import { getOrderStatus, verifyOrder } from "@/services";
import { CUSTOMER_APP_URL } from "@/lib/links";
import { CONTACT_PHONE } from "@/components/templates/ContactContent";
import { formatNaira, clearStoredCart } from "@/lib/storefront-cart";
import { recallOrder, type LastOrder } from "@/lib/last-order";
import type { OrderStatusView } from "@/types";

/**
 * Where Paystack returns a storefront buyer: did it go through, what did they buy, and
 * what happens next. The follow-up itself is the chat — or a phone call to us.
 */

type View =
  | { state: "loading" }
  | { state: "paid"; order: OrderStatusView }
  | { state: "unpaid"; order: OrderStatusView }
  | { state: "called-off"; order: OrderStatusView }
  | { state: "missing" };

const PHONE_HREF = `tel:${CONTACT_PHONE.replace(/\s/g, "")}`;

function viewOf(order: OrderStatusView): View {
  if (order.status === "PENDING_PAYMENT") return { state: "unpaid", order };
  if (order.status === "CANCELLED" || order.status === "REFUNDED") {
    return { state: "called-off", order };
  }
  return { state: "paid", order };
}

export default function OrderPage() {
  const { reference } = useParams<{ reference: string }>();
  const [view, setView] = useState<View>({ state: "loading" });
  const [checking, setChecking] = useState(false);
  const [mine, setMine] = useState<LastOrder | null>(null);

  // The webhook can be a few seconds behind the buyer; if it has not landed yet, ask
  // Paystack directly — once now, and again whenever they tap "Check again".
  const load = async (askPaystack: boolean) => {
    setChecking(true);
    try {
      let order = await getOrderStatus(reference);
      if (order.status === "PENDING_PAYMENT" && askPaystack) {
        order = await verifyOrder(reference).catch(() => order);
      }
      setView(viewOf(order));
    } catch {
      setView({ state: "missing" });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    setMine(recallOrder(reference));
    void load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  // Paid: the cart that became this order is done with.
  useEffect(() => {
    if (view.state === "paid" && mine) clearStoredCart(mine.slug);
  }, [view.state, mine]);

  const appUrl = CUSTOMER_APP_URL.replace(/\/+$/, "");
  const followHref = mine
    ? `${appUrl}/?signin=${encodeURIComponent(mine.email)}`
    : appUrl;

  return (
    <div className="min-h-screen bg-white max-w-[480px] mx-auto px-5 py-10 font-dm">
      {view.state === "loading" && (
        <div className="animate-pulse space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-gray-200" />
          <div className="mx-auto h-6 w-2/3 rounded bg-gray-200" />
          <div className="h-40 rounded-xl bg-gray-200" />
        </div>
      )}

      {view.state === "missing" && (
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Order not found</h1>
          <p className="mt-2 text-sm text-gray-500">
            We couldn&apos;t find order {reference}. If you were charged, call us
            and we&apos;ll sort it out.
          </p>
          <SupportCard />
        </div>
      )}

      {view.state === "unpaid" && (
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Payment not completed</h1>
          <p className="mt-2 text-sm text-gray-500">
            We haven&apos;t received payment for order {reference} yet. If you just
            paid, give it a moment and check again.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => void load(true)}
              disabled={checking}
              className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 py-3 text-sm font-bold text-gray-800 hover:bg-gray-50 disabled:opacity-60"
            >
              <RefreshCw size={15} className={checking ? "animate-spin" : ""} />
              {checking ? "Checking…" : "Check again"}
            </button>
            {mine && (
              <Link
                href={`/store/${mine.slug}/checkout`}
                className="rounded-2xl bg-[#006837] py-3 text-sm font-bold text-white hover:bg-[#00552d]"
              >
                Try paying again
              </Link>
            )}
          </div>
          <SupportCard />
        </div>
      )}

      {view.state === "called-off" && (
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">
            This order was {view.order.status === "REFUNDED" ? "refunded" : "cancelled"}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Questions about order {reference}? Call us.
          </p>
          <SupportCard />
        </div>
      )}

      {view.state === "paid" && (
        <Paid order={view.order} followHref={followHref} hasEmail={!!mine} />
      )}
    </div>
  );
}

function Paid({
  order,
  followHref,
  hasEmail,
}: {
  order: OrderStatusView;
  followHref: string;
  hasEmail: boolean;
}) {
  const delivery = order.fulfillmentType === "DELIVERY";
  const items = order.vendors.flatMap((vendor) => vendor.items);
  const onItsWay = order.status === "DISPATCHED" && !!order.deliveryCode;
  const delivered = order.status === "COMPLETED";

  return (
    <>
      <div className="text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-green-100">
          <Check size={32} className="text-[#006837]" strokeWidth={2.6} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          {delivered ? "Delivered" : onItsWay ? "On its way" : "Payment received"}
        </h1>
        <p className="mt-1 text-sm text-gray-500">Order {order.reference}</p>
      </div>

      <ul className="mt-6 divide-y divide-gray-100 rounded-xl border border-gray-100">
        {items.map((item, index) => (
          <li key={`${item.name}-${index}`} className="flex justify-between gap-3 px-3 py-2.5 text-sm">
            <span className="text-gray-800">
              <span className="font-bold text-gray-400">{item.quantity}× </span>
              {item.name}
            </span>
            <span className="tabular-nums text-gray-700">
              {formatNaira(item.unitPrice * item.quantity)}
            </span>
          </li>
        ))}
        {order.deliveryFee > 0 && (
          <li className="flex justify-between px-3 py-2.5 text-sm text-gray-600">
            <span>Delivery</span>
            <span className="tabular-nums">{formatNaira(order.deliveryFee)}</span>
          </li>
        )}
        <li className="flex justify-between px-3 py-2.5 text-base font-bold text-gray-900">
          <span>Total paid</span>
          <span className="tabular-nums">{formatNaira(order.totalAmount)}</span>
        </li>
      </ul>

      {onItsWay ? (
        <CodeCard code={order.deliveryCode!} />
      ) : delivery && !delivered ? (
        <p className="mt-4 rounded-xl bg-[#FAF6E1] p-3 text-sm text-gray-800">
          Your delivery code will be emailed to you when your order is on its way.
          Read it to the rider when they arrive.
        </p>
      ) : null}

      <a
        href={followHref}
        className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-[#EC5B2C] py-3.5 text-base font-bold text-white hover:bg-[#d84d20]"
      >
        <MessageCircle size={18} aria-hidden />
        Follow your order on Recommend
      </a>
      <p className="mt-2 text-center text-xs text-gray-500">
        {hasEmail
          ? "Sign in with the email you paid with — your order is already there, with every update."
          : "Sign in with the email you paid with to see your order and every update."}
      </p>

      <SupportCard />
    </>
  );
}

/** The six letters the rider asks for, big and copyable. */
function CodeCard({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-4 rounded-2xl bg-[#FAF6E1] p-4 text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
        Your delivery code
      </p>
      <button
        type="button"
        onClick={() =>
          navigator.clipboard
            .writeText(code)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            })
            .catch(() => undefined)
        }
        className="mt-1 inline-flex items-center gap-2 font-mono text-3xl font-bold tracking-[0.25em] text-[#006837]"
        aria-label={`Copy delivery code ${code.split("").join(" ")}`}
      >
        {code}
        {copied ? <Check size={18} /> : <Copy size={18} className="opacity-60" />}
      </button>
      <p className="mt-1 text-sm text-gray-700">
        Read it to the rider when they arrive.
      </p>
    </div>
  );
}

/** Our number — for anyone who never opens the chat. */
function SupportCard() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="mt-6 rounded-2xl border border-gray-100 p-4 text-center">
      <p className="text-sm text-gray-600">Questions about your order?</p>
      <p className="mt-1 text-lg font-bold text-gray-900 tabular-nums">
        {CONTACT_PHONE}
      </p>
      <div className="mt-3 flex justify-center gap-2">
        <a
          href={PHONE_HREF}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#006837] px-4 py-2 text-sm font-bold text-white"
        >
          <Phone size={14} aria-hidden /> Call
        </a>
        <button
          type="button"
          onClick={() =>
            navigator.clipboard
              .writeText(CONTACT_PHONE)
              .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              })
              .catch(() => undefined)
          }
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-4 py-2 text-sm font-bold text-gray-800"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy number"}
        </button>
      </div>
    </div>
  );
}
