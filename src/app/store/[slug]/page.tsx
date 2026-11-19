"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  CreditCard,
  Lock,
  MessageCircle,
  Phone,
  Search,
  Share2,
  ShieldCheck,
  X,
} from "lucide-react";
import { useStorefront } from "@/hooks";
import { RemoteImage } from "@/components/atoms/RemoteImage";
import { SUPPORT_PHONE, SUPPORT_PHONE_HREF } from "@/lib/support";
import { CartLineRow } from "@/components/storefront/CartLineRow";
import { ItemSheet } from "@/components/storefront/ItemSheet";
import {
  COMPACT_MENU_FROM,
  MenuCard,
  MenuRow,
} from "@/components/storefront/MenuItem";
import {
  formatNaira,
  isBuildable,
  useStorefrontCart,
  type CartLine,
} from "@/lib/storefront-cart";
import {
  displayPhone,
  memberSinceText,
  openUntilText,
  opensText,
  phoneHref,
  sellsFood,
  weekRows,
  whatsappHref,
} from "@/lib/storefront-profile";
import type { Product } from "@/types";

/**
 * A vendor's own shop — the link they share on Instagram, WhatsApp and TikTok.
 *
 * Built around the person behind the business (STOREFRONT design, option B): who runs
 * it, how to reach them, when they are open, then what they sell. A buyer who can see a
 * face and a WhatsApp button reaches out; a vendor who sees that page shares it.
 *
 * Extras aren't listed on their own: each dish offers its own, in the sheet that builds it.
 */

function StoreSkeleton() {
  return (
    <div className="mx-auto max-w-[1160px] animate-pulse px-5 pt-20 lg:px-6">
      <div className="flex flex-col gap-4 lg:w-1/2">
        <div className="h-14 w-14 rounded-2xl bg-gray-200" />
        <div className="h-12 w-3/4 rounded bg-gray-200" />
        <div className="h-5 w-full rounded bg-gray-200" />
        <div className="h-16 w-full rounded-2xl bg-gray-200" />
      </div>
      <div className="mt-10 h-28 rounded-[22px] bg-gray-200" />
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-[380px] rounded-[22px] bg-gray-200" />
        ))}
      </div>
    </div>
  );
}

export default function StorefrontPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useStorefront(slug);
  const cart = useStorefrontCart(slug, data?.products);
  const [query, setQuery] = useState("");
  /** The sheet: a product, and the pack being changed when opened from the cart. */
  const [open, setOpen] = useState<{ product: Product; editing: CartLine | null } | null>(
    null
  );
  const [orderOpen, setOrderOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const closeSheet = useCallback(() => setOpen(null), []);
  const [now] = useState(() => new Date());

  const products = data?.products;
  const forSale = useMemo(
    () => (products ?? []).filter((p) => p.isAvailable && !p.isAddOn),
    [products]
  );
  const menu = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return forSale;
    return forSale.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.description ?? "").toLowerCase().includes(term)
    );
  }, [forSale, query]);

  if (isLoading) return <StoreSkeleton />;

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center font-dm">
        <p className="mb-2 text-lg font-bold text-gray-800">Store not found</p>
        <p className="text-sm text-gray-500">This vendor may no longer be available.</p>
      </div>
    );
  }

  const { vendor } = data;
  const storeName = vendor.businessName ?? "This store";
  const owner = vendor.ownerFirstName?.trim() || null;
  /** Who a buyer talks to: Ngozi, or the shop when we don't have a name. */
  const contactName = owner ?? storeName;
  const since = memberSinceText(vendor.memberSince);
  const whatsapp = whatsappHref(vendor.whatsappNumber, storeName);
  const call = phoneHref(vendor.whatsappNumber);
  const phoneText = displayPhone(vendor.whatsappNumber);
  const food = sellsFood(vendor.businessCategory);
  const areas = vendor.serviceAreas ?? [];
  const areaNames = areas.map((area) => area.name);
  const hours = weekRows(vendor.operatingHours, now);
  const status = vendor.isOpen
    ? openUntilText(vendor.closesAt)
    : opensText(vendor.opensAt, now);

  const { priced } = cart;
  const deliveryFee = data.deliveryFee ?? 0;
  const eta = data.deliveryEtaMinutes ?? 30;
  const etaText = `${Math.max(5, eta - 10)}–${eta} min`;
  const compact = forSale.length >= COMPACT_MENU_FROM;

  /** The banner first, then dishes with a photo: the shop as it looks. */
  const photos = [
    ...(vendor.businessBannerUrl ? [{ src: vendor.businessBannerUrl, label: storeName }] : []),
    ...forSale
      .filter((p) => p.imageUrl)
      .map((p) => ({ src: p.imageUrl as string, label: p.name })),
  ].slice(0, 3);

  const share = async () => {
    const url = window.location.href.split("?")[0];
    try {
      if (navigator.share) {
        await navigator.share({ title: storeName, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // Dismissed the share sheet, or no clipboard: nothing to do.
    }
  };

  const itemProps = (product: Product) => ({
    product,
    quantity: cart.quantityOf(product.id),
    buildable: isBuildable(product),
    onOpen: () => setOpen({ product, editing: null }),
    onChange: (next: number) => cart.setQuantity(product.id, next),
  });

  return (
    <div className="min-h-screen bg-[#FAF7F0] font-dm text-[#1A1A17]">
      {/* Top bar */}
      <header className="border-b border-[#E7E2D6]">
        <div className="mx-auto flex max-w-[1160px] items-center justify-between gap-3 px-5 py-3 lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-[#C2410C]">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#C2410C] text-base text-white">
              R
            </span>
            Recommend
          </Link>
          <button
            type="button"
            onClick={share}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-[#D9D3C4] bg-white px-4 text-sm font-semibold hover:bg-[#F4F1EA]"
          >
            {shared ? <Check size={16} aria-hidden /> : <Share2 size={16} aria-hidden />}
            {shared ? "Link copied" : "Share shop"}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-[1160px] px-5 lg:px-6">
        {/* Who they are */}
        <section className="flex flex-wrap items-center gap-10 pt-10 pb-10 lg:pt-12">
          <div className="flex min-w-0 flex-[999_1_480px] flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-[#FFF1EB]">
                {vendor.businessLogoUrl ? (
                  <RemoteImage
                    src={vendor.businessLogoUrl}
                    alt={`${storeName} logo`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <span className="font-display grid h-full w-full place-items-center text-2xl font-bold text-[#B23A12]">
                    {storeName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#4A4A44]">
                {[vendor.businessCategory, areaNames.slice(0, 2).join(", ")]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>

            <h1 className="font-display break-words text-[40px] font-bold leading-none tracking-tight sm:text-[52px] lg:text-[60px]">
              {storeName}
            </h1>
            {vendor.businessDescription && (
              <p className="max-w-[560px] text-[17px] leading-relaxed text-[#3A3A35] lg:text-[19px]">
                {vendor.businessDescription}
              </p>
            )}

            {(owner || since) && (
              <div className="flex max-w-[520px] items-center gap-3 rounded-2xl border border-[#E7E2D6] bg-white px-4 py-3.5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#E9DCC8] text-lg font-bold text-[#3A2A14]">
                  {(owner ?? storeName).charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold">
                    {owner ? `Run by ${owner}` : storeName}
                  </p>
                  <p className="text-[13px] text-[#5B5B55]">
                    {[since && `Selling on Recommend since ${since}`, whatsapp && "Replies on WhatsApp"]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <a
                href="#menu"
                className="inline-flex h-[52px] items-center justify-center rounded-[14px] bg-[#C2410C] px-7 text-base font-bold text-white hover:bg-[#A8380A]"
              >
                {food ? "See the menu" : "Shop now"}
              </a>
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[52px] items-center justify-center gap-2.5 rounded-[14px] border-2 border-[#0E3B26] bg-white px-6 text-base font-bold text-[#0E3B26] hover:bg-[#E6F0EA]"
                >
                  <MessageCircle size={18} aria-hidden />
                  Message {contactName}
                </a>
              )}
            </div>

            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] font-semibold text-[#3A3A35]">
              <li className="inline-flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#0E3B26]" aria-hidden /> Verified by Recommend
              </li>
              <li className="inline-flex items-center gap-1.5">
                <CreditCard size={16} className="text-[#0E3B26]" aria-hidden /> Pay safely with Paystack
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Lock size={16} className="text-[#0E3B26]" aria-hidden /> A code protects your order
              </li>
            </ul>
          </div>

          {photos.length > 0 && (
            <div
              className={`grid flex-[1_1_360px] gap-3 ${
                photos.length === 1 ? "grid-cols-1" : "grid-cols-2"
              }`}
            >
              {photos.map((photo, index) => (
                <div
                  key={photo.src}
                  className={`relative overflow-hidden rounded-[22px] bg-[#E9DCC8] ${tileShape(
                    photos.length,
                    index
                  )}`}
                >
                  <RemoteImage
                    src={photo.src}
                    alt={photo.label}
                    fill
                    sizes="(min-width: 1024px) 300px, 50vw"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right now */}
        <section
          aria-label="Opening and delivery"
          className="grid grid-cols-1 gap-5 rounded-[22px] bg-[#0E3B26] px-6 py-6 text-white sm:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-[#A9C9B5] uppercase">Right now</p>
            <p className="mt-1 flex items-center gap-2 text-lg font-bold">
              <span
                aria-hidden
                className={`h-2.5 w-2.5 rounded-full ${vendor.isOpen ? "bg-[#4ADE80]" : "bg-[#F28B82]"}`}
              />
              {vendor.isOpen ? status : `Closed · ${status.replace(/^Opens/, "opens")}`}
            </p>
            <p className="mt-0.5 text-sm text-[#D6E6DC]">
              {vendor.isOpen
                ? "Taking orders now."
                : "You can fill your cart now and pay once they open."}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-[#A9C9B5] uppercase">Delivery</p>
            <p className="mt-1 text-lg font-bold">
              {deliveryFee > 0 ? `${formatNaira(deliveryFee)} · ` : ""}
              {etaText}
            </p>
            <p className="mt-0.5 text-sm text-[#D6E6DC]">
              {areaNames.length > 0 ? `Across ${areaNames.join(", ")}` : "Ask the vendor where they deliver"}
            </p>
          </div>
          {data.pickupEnabled && (
            <div>
              <p className="text-xs font-bold tracking-[0.08em] text-[#A9C9B5] uppercase">Pickup</p>
              <p className="mt-1 text-lg font-bold">No delivery fee</p>
              <p className="mt-0.5 text-sm text-[#D6E6DC]">Collect it from the vendor yourself</p>
            </div>
          )}
        </section>

        {/* What they sell */}
        <section id="menu" className="flex scroll-mt-6 flex-col gap-5 pt-14">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-[30px] font-bold tracking-tight lg:text-[36px]">
                {food ? "From the kitchen" : "In the shop"}
              </h2>
              <p className="mt-1 text-[15px] text-[#4A4A44]">
                {forSale.length} {forSale.length === 1 ? "item" : "items"}
                {forSale.some(isBuildable) ? " · tap one to choose your options and extras" : ""}
              </p>
            </div>
            <label className="flex h-12 flex-[0_1_300px] items-center gap-2.5 rounded-full border border-[#D9D3C4] bg-white px-4 text-[#5B5B55]">
              <Search size={18} aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={food ? "Search the menu" : "Search this shop"}
                aria-label={food ? "Search the menu" : "Search this shop"}
                className="min-w-0 flex-1 bg-transparent text-[15px] text-[#1A1A17] outline-none"
              />
            </label>
          </div>

          {menu.length === 0 ? (
            <p className="rounded-[22px] border border-[#E7E2D6] bg-white py-12 text-center text-sm text-[#5B5B55]">
              {query ? "Nothing here matches your search." : "Nothing available right now."}
            </p>
          ) : compact ? (
            <ul className="overflow-hidden rounded-[22px] border border-[#E7E2D6] bg-white">
              {menu.map((product) => (
                <MenuRow key={product.id} {...itemProps(product)} />
              ))}
            </ul>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {menu.map((product) => (
                <MenuCard key={product.id} {...itemProps(product)} />
              ))}
            </div>
          )}
        </section>

        {/* How it works */}
        <section className="pt-16">
          <h2 className="font-display mb-5 text-[28px] font-bold tracking-tight">How ordering works</h2>
          <ol className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              [
                "Add what you want",
                data.pickupEnabled
                  ? "Pick your items and any options, then choose delivery or pickup."
                  : "Pick your items and any options.",
              ],
              ["Pay with Paystack", "Card, transfer or USSD. Your receipt comes by email."],
              [
                "Give your code on arrival",
                "Your order is only handed over when you give your code — so it reaches you, not someone else.",
              ],
            ].map(([title, body], index) => (
              <li key={title} className="rounded-[18px] border border-[#E7E2D6] bg-white p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#FFF1E8] font-bold text-[#C2410C]">
                  {index + 1}
                </span>
                <p className="mt-3 text-[17px] font-bold">{title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[#4A4A44]">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Reach them */}
        <section className="flex flex-wrap items-stretch gap-5 pt-16">
          <div className="flex min-w-0 flex-[999_1_460px] flex-col gap-4 rounded-[22px] border border-[#E7E2D6] bg-white p-6 lg:p-7">
            <h2 className="font-display text-[28px] font-bold tracking-tight">Talk to {contactName}</h2>
            <p className="text-[15px] leading-relaxed text-[#4A4A44]">
              {food
                ? "Planning a big order, want it less spicy, or checking what's ready today? Ask before you order."
                : "Checking a size, a colour or whether something is in stock? Ask before you order."}
            </p>
            {whatsapp || call ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[52px] items-center justify-center gap-2.5 rounded-[14px] bg-[#0E3B26] text-[15px] font-bold text-white hover:bg-[#0A2A1B]"
                  >
                    <MessageCircle size={18} aria-hidden /> WhatsApp
                  </a>
                )}
                {call && (
                  <a
                    href={call}
                    className="flex h-[52px] items-center justify-center gap-2.5 rounded-[14px] border-2 border-[#0E3B26] text-[15px] font-bold text-[#0E3B26] hover:bg-[#E6F0EA]"
                  >
                    <Phone size={18} aria-hidden /> {phoneText}
                  </a>
                )}
              </div>
            ) : (
              <a
                href={SUPPORT_PHONE_HREF}
                className="flex h-[52px] items-center justify-center gap-2.5 rounded-[14px] border-2 border-[#0E3B26] text-[15px] font-bold text-[#0E3B26] hover:bg-[#E6F0EA]"
              >
                <Phone size={18} aria-hidden /> Ask Recommend · {SUPPORT_PHONE}
              </a>
            )}
            {areaNames.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-[#E7E2D6] pt-4">
                <p className="text-xs font-bold tracking-[0.08em] text-[#5B5B55] uppercase">Delivers to</p>
                <div className="flex flex-wrap gap-2">
                  {areas.map((area) => (
                    <span
                      key={area.id}
                      className="rounded-full bg-[#E6F0EA] px-3 py-1.5 text-sm font-semibold text-[#0E3B26]"
                    >
                      {area.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {hours && (
            <div className="flex-[1_1_320px] rounded-[22px] border border-[#E7E2D6] bg-white p-6 lg:p-7">
              <h3 className="font-display mb-3 flex items-center gap-2 text-[22px] font-bold">
                <Clock size={20} className="text-[#0E3B26]" aria-hidden /> Opening hours
              </h3>
              <dl>
                {hours.map((row) => (
                  <div
                    key={row.day}
                    className={`flex justify-between border-b border-[#F1ECE0] py-2 text-[15px] last:border-b-0 ${
                      row.today ? "font-bold" : ""
                    }`}
                  >
                    <dt>
                      {row.day}
                      {row.today && <span className="font-medium text-[#5B5B55]"> (today)</span>}
                    </dt>
                    <dd className={row.closed ? "text-[#9F1D12]" : ""}>{row.text}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </section>

        <p className="flex flex-wrap items-center justify-center gap-1.5 pt-12 pb-36 text-center text-[13px] text-[#5B5B55]">
          <span>
            Problem with an order? Call Recommend on{" "}
            <a href={SUPPORT_PHONE_HREF} className="font-semibold text-[#0E3B26] hover:underline">
              {SUPPORT_PHONE}
            </a>
          </span>
          <span aria-hidden>·</span>
          <span>
            Powered by <b className="text-[#1A1A17]">Recommend</b>
          </span>
        </p>
      </main>

      {/* The order, pinned to the bottom */}
      {cart.loaded && priced.count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20">
          {orderOpen && (
            <div className="mx-auto max-w-[1160px] px-3 lg:px-6">
              <div className="ml-auto max-h-[60vh] overflow-y-auto rounded-t-3xl border border-b-0 border-[#E7E2D6] bg-white p-5 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] lg:w-[420px]">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-[22px] font-bold">Your order</h2>
                  <button
                    type="button"
                    onClick={() => setOrderOpen(false)}
                    aria-label="Close your order"
                    className="grid h-11 w-11 place-items-center rounded-full hover:bg-[#F4F1EA]"
                  >
                    <X size={20} />
                  </button>
                </div>
                <ul className="flex flex-col gap-3.5">
                  {priced.items.map((item) => (
                    <CartLineRow
                      key={item.key}
                      item={item}
                      onEdit={() => setOpen({ product: item.product, editing: item.line })}
                      onChange={(next) =>
                        item.isPack
                          ? cart.setPacks(item.key, next)
                          : cart.setQuantity(item.product.id, next)
                      }
                    />
                  ))}
                </ul>
                <div className="mt-4 flex flex-col gap-2 border-t border-dashed border-[#D9D3C4] pt-3.5 text-[15px]">
                  <Row label="Items" value={formatNaira(priced.goodsTotal)} />
                  {deliveryFee > 0 && <Row label="Delivery" value={formatNaira(deliveryFee)} />}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="tabular-nums">{formatNaira(priced.goodsTotal + deliveryFee)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="border-t border-[#E7E2D6] bg-white shadow-[0_-6px_20px_rgba(0,0,0,0.06)]">
            <div className="mx-auto flex max-w-[1160px] items-center gap-3 px-4 py-3 lg:px-6">
              <button
                type="button"
                onClick={() => setOrderOpen((was) => !was)}
                aria-expanded={orderOpen}
                className="flex min-w-0 flex-1 items-center gap-2 text-left"
              >
                <span className="flex min-w-0 flex-col">
                  <span className="text-[13px] text-[#5B5B55]">
                    {priced.count} {priced.count === 1 ? "item" : "items"}
                    {deliveryFee > 0 ? ` · plus ${formatNaira(deliveryFee)} delivery` : ""}
                  </span>
                  <span className="text-[18px] font-bold tabular-nums">{formatNaira(priced.goodsTotal)}</span>
                </span>
                <ChevronDown
                  size={18}
                  aria-hidden
                  className={`shrink-0 text-[#5B5B55] transition-transform ${orderOpen ? "" : "rotate-180"}`}
                />
                <span className="sr-only">{orderOpen ? "Hide your order" : "See your order"}</span>
              </button>
              <CheckoutLink slug={slug} isOpen={vendor.isOpen} />
            </div>
          </div>
        </div>
      )}

      {open && (
        <ItemSheet
          product={open.product}
          products={products ?? []}
          storeName={storeName}
          inCart={cart.quantityOf(open.product.id)}
          editing={open.editing}
          locked={null}
          etaText={etaText}
          onSave={(quantity) => cart.setQuantity(open.product.id, quantity)}
          onSavePack={(draft) =>
            open.editing ? cart.replacePack(open.editing.key, draft) : cart.addPack(draft)
          }
          onRemove={() => open.editing && cart.removeLine(open.editing.key)}
          onClose={closeSheet}
        />
      )}
    </div>
  );
}

/** One photo wide; two side by side; three as one tall beside two stacked. */
function tileShape(count: number, index: number): string {
  if (count === 1) return "aspect-[4/3]";
  if (count === 2) return "aspect-[3/4]";
  return index === 0 ? "row-span-2" : "aspect-[5/4]";
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[#3B404A]">
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function CheckoutLink({ slug, isOpen }: { slug: string; isOpen: boolean }) {
  return (
    <Link
      href={`/store/${slug}/checkout`}
      aria-disabled={!isOpen}
      onClick={(event) => {
        if (!isOpen) event.preventDefault();
      }}
      className={`flex h-12 shrink-0 items-center gap-2 rounded-[14px] px-6 text-[15px] font-bold text-white ${
        isOpen ? "bg-[#C2410C] hover:bg-[#A8380A]" : "cursor-not-allowed bg-gray-500"
      }`}
    >
      {isOpen ? (
        <>
          Checkout <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
        </>
      ) : (
        "Closed now"
      )}
    </Link>
  );
}
