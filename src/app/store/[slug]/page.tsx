"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  Minus,
  Phone,
  Plus,
  Search,
  Share2,
  Truck,
} from "lucide-react";
import { useStorefront } from "@/hooks";
import { RemoteImage } from "@/components/atoms/RemoteImage";
import { CONTACT_PHONE } from "@/components/templates/ContactContent";
import { ItemSheet } from "@/components/storefront/ItemSheet";
import { ProductPhoto } from "@/components/storefront/ProductPhoto";
import { formatNaira, useStorefrontCart } from "@/lib/storefront-cart";
import type { Product } from "@/types";

/**
 * A vendor's own shop — the link they share on Instagram, WhatsApp and TikTok. Build a
 * cart, check out, pay; the order then follows the buyer into the Recommend chat.
 *
 * One column on a phone with the cart pinned to the bottom; on a wide screen the menu
 * sits beside the order.
 */

const PHONE_HREF = `tel:${CONTACT_PHONE.replace(/\s/g, "")}`;
const EXTRAS_LOCKED = "Add something from the menu first — extras go with a meal.";

type Tab = "all" | "extras";

function StoreSkeleton() {
  return (
    <div className="mx-auto max-w-[1180px] animate-pulse">
      <div className="h-[150px] bg-gray-200 lg:h-[180px]" />
      <div className="space-y-3 px-5 pt-6">
        <div className="h-20 w-20 rounded-[22px] bg-gray-200" />
        <div className="h-7 w-2/3 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="grid grid-cols-2 gap-3 pt-6 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-[18px] bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function StorefrontPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useStorefront(slug);
  const cart = useStorefrontCart(slug, data?.products);
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Product | null>(null);
  const [shared, setShared] = useState(false);
  const closeSheet = useCallback(() => setOpen(null), []);

  const products = data?.products;
  const { mains, extras } = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = (p: Product) =>
      !term ||
      p.name.toLowerCase().includes(term) ||
      (p.description ?? "").toLowerCase().includes(term);
    const available = (products ?? []).filter((p) => p.isAvailable && matches(p));
    return {
      mains: available.filter((p) => !p.isAddOn),
      // Extras — drinks, extra protein — go with a meal from this store, never alone.
      extras: available.filter((p) => p.isAddOn),
    };
  }, [products, query]);

  if (isLoading) return <StoreSkeleton />;

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center font-dm">
        <p className="mb-2 text-lg font-bold text-gray-800">Store not found</p>
        <p className="text-sm text-gray-500">
          This vendor may no longer be available.
        </p>
      </div>
    );
  }

  const { vendor } = data;
  const storeName = vendor.businessName ?? "This store";
  const { priced } = cart;
  const deliveryFee = data.deliveryFee ?? 0;
  const eta = data.deliveryEtaMinutes ?? 30;
  const etaText = `${Math.max(5, eta - 10)}–${eta} min`;
  const hasExtras = (products ?? []).some((p) => p.isAvailable && p.isAddOn);
  const totalAvailable = (products ?? []).filter((p) => p.isAvailable).length;
  const showMains = tab === "all";
  const lockedFor = (p: Product) => (p.isAddOn && !priced.hasMain ? EXTRAS_LOCKED : null);

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

  const grid = (items: Product[]) => (
    <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:gap-5">
      {items.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          quantity={cart.quantityOf(product.id)}
          locked={lockedFor(product)}
          onOpen={() => setOpen(product)}
          onChange={(next) => cart.setQuantity(product.id, next)}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-dm text-[#15171C] lg:bg-[#FBFAF7]">
      {/* Banner */}
      <div className="relative h-[150px] overflow-hidden bg-[#0E3B26] lg:h-[180px]">
        {vendor.businessBannerUrl ? (
          <RemoteImage
            src={vendor.businessBannerUrl}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <span
            aria-hidden
            className="font-display absolute -right-4 -top-12 select-none text-[220px] font-bold leading-none text-[#15513A] lg:right-[6%] lg:-top-16 lg:text-[300px]"
          >
            {storeName.charAt(0).toLowerCase()}
          </span>
        )}
        <button
          type="button"
          onClick={share}
          aria-label="Share this shop"
          className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 lg:hidden"
        >
          {shared ? <Check size={20} /> : <Share2 size={20} />}
        </button>
      </div>

      <div className="mx-auto max-w-[1180px] lg:px-8">
        {/* Who they are */}
        <div className="relative -mt-10 flex flex-col gap-3 px-5 lg:-mt-14 lg:flex-row lg:flex-wrap lg:items-start lg:gap-x-6 lg:gap-y-4 lg:px-0">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[22px] border-4 border-white bg-[#FFF1EB] shadow-[0_6px_18px_rgba(21,23,28,0.12)] lg:h-28 lg:w-28 lg:rounded-[28px] lg:border-[5px] lg:border-[#FBFAF7]">
            {vendor.businessLogoUrl ? (
              <RemoteImage
                src={vendor.businessLogoUrl}
                alt={`${storeName} logo`}
                fill
                sizes="112px"
                className="object-cover"
              />
            ) : (
              <span className="font-display grid h-full w-full place-items-center text-[34px] font-bold text-[#B23A12] lg:text-[44px]">
                {storeName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1 lg:basis-[360px] lg:gap-2 lg:pt-[68px]">
            <h1 className="font-display break-words text-[28px] font-bold leading-[1.1] tracking-tight lg:text-[40px]">
              {storeName}
            </h1>
            {vendor.businessDescription && (
              <p className="text-[15px] text-[#5B6270]">{vendor.businessDescription}</p>
            )}
          </div>

          <button
            type="button"
            onClick={share}
            className="hidden h-11 items-center gap-2 rounded-full lg:mt-[72px] border border-[#DCDBD5] bg-white px-[18px] text-sm font-bold hover:bg-gray-50 lg:inline-flex"
          >
            {shared ? <Check size={16} /> : <Share2 size={16} />}
            {shared ? "Link copied" : "Share shop"}
          </button>

          <div className="flex flex-wrap items-center gap-2 lg:basis-full">
            {vendor.isOpen ? (
              <Tag tone="open">
                <span className="h-2 w-2 rounded-full bg-[#0A8A4A]" /> Open now
              </Tag>
            ) : (
              <Tag tone="closed">Closed</Tag>
            )}
            <Tag>
              <Clock size={14} aria-hidden /> {etaText}
            </Tag>
            {deliveryFee > 0 && (
              <Tag>
                <Truck size={14} aria-hidden /> {formatNaira(deliveryFee)} delivery
              </Tag>
            )}
          </div>

          {vendor.serviceAreas?.length > 0 && (
            <div className="flex flex-col gap-2 rounded-2xl bg-[#FAF6E1] px-3.5 py-3 lg:basis-full lg:flex-row lg:items-center lg:gap-3">
              <span className="text-xs font-bold uppercase tracking-[0.06em] text-[#6B5A12]">
                Delivers to
              </span>
              <div className="flex flex-wrap gap-1.5">
                {vendor.serviceAreas.map((area) => (
                  <span key={area.id} className="rounded-full bg-white px-2.5 py-1 text-[13px]">
                    {area.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!vendor.isOpen && (
            <p className="rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700 lg:basis-full">
              {storeName} is closed right now. You can look around and fill your
              cart — ordering opens when they do.
            </p>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-8 lg:mt-9 lg:flex-row lg:items-start">
          {/* The menu */}
          <div className="min-w-0 flex-1">
            <div className="sticky top-0 z-10 flex flex-col gap-2.5 border-y border-[#ECECE8] bg-white px-5 py-3 lg:static lg:flex-row lg:flex-wrap lg:items-center lg:gap-3 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
              <label className="flex h-[46px] shrink-0 items-center gap-2.5 rounded-[14px] bg-[#F4F3EF] px-3.5 text-[#5B6270] lg:h-12 lg:basis-[260px] lg:border lg:border-[#E4E2DB] lg:bg-white">
                <Search size={18} aria-hidden />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search this shop"
                  aria-label="Search this shop"
                  className="flex-1 bg-transparent text-[15px] text-[#15171C] outline-none"
                />
              </label>
              {hasExtras && (
                <div className="flex gap-2">
                  <TabButton active={tab === "all"} onClick={() => setTab("all")}>
                    All · {totalAvailable}
                  </TabButton>
                  <TabButton active={tab === "extras"} onClick={() => setTab("extras")}>
                    Extras
                  </TabButton>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-7 px-5 pt-4 lg:px-0 lg:pt-6">
              {showMains &&
                (mains.length > 0 ? (
                  <section className="flex flex-col gap-3.5">
                    {hasExtras && (
                      <h2 className="font-display hidden text-[22px] font-bold lg:block">Menu</h2>
                    )}
                    {grid(mains)}
                  </section>
                ) : (
                  <p className="py-10 text-center text-sm text-[#5B6270]">
                    {query ? "Nothing here matches your search." : "No products available right now."}
                  </p>
                ))}

              {extras.length > 0 && (
                <section className="flex flex-col gap-3.5">
                  <div>
                    <h2 className="font-display text-[22px] font-bold">Extras</h2>
                    <p className="mt-0.5 text-[13px] text-[#5B6270]">
                      {priced.hasMain ? "Add these to your order." : EXTRAS_LOCKED}
                    </p>
                  </div>
                  {grid(extras)}
                </section>
              )}

              {tab === "extras" && extras.length === 0 && (
                <p className="py-10 text-center text-sm text-[#5B6270]">
                  Nothing here matches your search.
                </p>
              )}
            </div>
          </div>

          {/* The order, beside the menu on a wide screen */}
          <aside className="hidden w-[340px] shrink-0 flex-col gap-4 rounded-3xl border border-[#ECEAE3] bg-white p-[22px] lg:flex">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-[22px] font-bold">Your order</h2>
              {priced.count > 0 && (
                <span className="text-sm text-[#5B6270]">
                  {priced.count} {priced.count === 1 ? "item" : "items"}
                </span>
              )}
            </div>
            {priced.count === 0 ? (
              <p className="text-sm text-[#5B6270]">
                Your cart is empty. Add something from the menu to get started.
              </p>
            ) : (
              <>
                <ul className="flex flex-col gap-3">
                  {priced.items.map(({ product, quantity, lineTotal }) => (
                    <li key={product.id} className="flex items-center gap-3">
                      <span className="flex-1 text-[15px]">{product.name}</span>
                      <MiniStepper
                        label={product.name}
                        quantity={quantity}
                        onChange={(next) => cart.setQuantity(product.id, next)}
                      />
                      <span className="w-[78px] text-right text-[15px] font-bold tabular-nums">
                        {formatNaira(lineTotal)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 border-t border-dashed border-[#DCDBD5] pt-3.5 text-[15px]">
                  <Row label="Items" value={formatNaira(priced.goodsTotal)} />
                  {deliveryFee > 0 && <Row label="Delivery" value={formatNaira(deliveryFee)} />}
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="tabular-nums">{formatNaira(priced.goodsTotal + deliveryFee)}</span>
                  </div>
                </div>
                <CheckoutLink slug={slug} isOpen={vendor.isOpen} className="h-[52px] justify-center rounded-2xl text-base" />
              </>
            )}
            <p className="text-[13px] leading-normal text-[#5B6270]">
              Pay securely with Paystack — your receipt and delivery code come by email.
            </p>
            <div className="flex flex-col gap-1 rounded-2xl bg-[#FAF6E1] p-3.5">
              <span className="text-sm font-bold">Questions about an order?</span>
              <a href={PHONE_HREF} className="text-sm font-bold text-[#00552D] hover:underline">
                Call Recommend · {CONTACT_PHONE}
              </a>
            </div>
          </aside>
        </div>

        {/* Support, on a phone (the order panel carries it on a wide screen) */}
        <div className="mx-5 mt-7 flex items-center gap-3.5 rounded-[18px] border border-[#ECECE8] p-4 lg:hidden">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#FFF1EB] text-[#C2410C]">
            <Phone size={20} aria-hidden />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm font-bold">Questions about an order?</span>
            <span className="text-[13px] text-[#5B6270]">Recommend · {CONTACT_PHONE}</span>
          </div>
          <a
            href={PHONE_HREF}
            className="flex h-11 items-center rounded-full bg-[#F4F3EF] px-4 text-sm font-bold text-[#15171C]"
          >
            Call
          </a>
        </div>

        <p className="flex flex-wrap items-center justify-center gap-1.5 px-5 pt-6 pb-32 text-[13px] text-[#5B6270] lg:pt-12 lg:pb-16">
          <span>Secure payment with Paystack</span>
          <span aria-hidden>·</span>
          <span>
            Powered by <b className="text-[#15171C]">Recommend</b>
          </span>
        </p>
      </div>

      {/* Cart bar, on a phone */}
      {cart.loaded && priced.count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 px-3 pb-4 lg:hidden">
          <div className="mx-auto flex max-w-[480px] items-center gap-3 rounded-[20px] bg-[#15171C] py-2 pr-2 pl-[18px] text-white shadow-[0_10px_30px_rgba(21,23,28,0.35)]">
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-xs text-[#C9CCD2]">
                {priced.count} {priced.count === 1 ? "item" : "items"}
                {deliveryFee > 0 ? " · plus delivery" : ""}
              </span>
              <span className="text-[17px] font-bold tabular-nums">
                {formatNaira(priced.goodsTotal)}
              </span>
            </div>
            <CheckoutLink slug={slug} isOpen={vendor.isOpen} className="h-12 rounded-[14px] px-5 text-[15px]" />
          </div>
        </div>
      )}

      {open && (
        <ItemSheet
          product={open}
          storeName={storeName}
          inCart={cart.quantityOf(open.id)}
          locked={lockedFor(open)}
          etaText={etaText}
          onSave={(quantity) => cart.setQuantity(open.id, quantity)}
          onClose={closeSheet}
        />
      )}
    </div>
  );
}

function Tag({
  tone = "plain",
  children,
}: {
  tone?: "plain" | "open" | "closed";
  children: React.ReactNode;
}) {
  const colours = {
    plain: "bg-[#F4F3EF] text-[#3B404A] font-medium",
    open: "bg-[#E6F4EC] text-[#00552D] font-bold",
    closed: "bg-red-50 text-red-700 font-bold",
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[13px] ${colours}`}>
      {children}
    </span>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`h-9 rounded-full px-3.5 text-sm lg:h-10 lg:px-4 ${
        active
          ? "bg-[#15171C] font-bold text-white"
          : "border border-[#DCDBD5] bg-white font-medium text-[#3B404A] hover:bg-gray-50"
      }`}
    >
      {children}
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-[#3B404A]">
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function CheckoutLink({
  slug,
  isOpen,
  className,
}: {
  slug: string;
  isOpen: boolean;
  className: string;
}) {
  return (
    <Link
      href={`/store/${slug}/checkout`}
      aria-disabled={!isOpen}
      onClick={(event) => {
        if (!isOpen) event.preventDefault();
      }}
      className={`flex items-center gap-2 font-bold text-white ${className} ${
        isOpen ? "bg-[#0A8A4A] hover:bg-[#006837]" : "cursor-not-allowed bg-gray-500"
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

/** A product as a card: tap it for the details, or add straight from the photo. */
function ProductCard({
  product,
  quantity,
  locked,
  onOpen,
  onChange,
}: {
  product: Product;
  quantity: number;
  locked: string | null;
  onOpen: () => void;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2 lg:overflow-hidden lg:rounded-[20px] lg:border lg:border-[#ECEAE3] lg:bg-white">
      <div className="relative aspect-square overflow-hidden rounded-[18px] lg:aspect-[4/3] lg:rounded-none">
        <button
          type="button"
          onClick={onOpen}
          aria-label={`See ${product.name}`}
          className="absolute inset-0"
        >
          <ProductPhoto product={product} sizes="(min-width: 1024px) 280px, 50vw" />
        </button>

        {quantity === 0 ? (
          <button
            type="button"
            onClick={() => onChange(1)}
            disabled={!!locked}
            title={locked ?? undefined}
            aria-label={`Add ${product.name}`}
            className="absolute right-2 bottom-2 grid h-11 w-11 place-items-center rounded-full bg-white text-[#006837] shadow-[0_4px_12px_rgba(21,23,28,0.18)] disabled:text-gray-300"
          >
            <Plus size={20} strokeWidth={2.4} />
          </button>
        ) : (
          <div className="absolute inset-x-2 bottom-2 flex h-11 items-center justify-between rounded-full bg-[#006837] text-white shadow-[0_4px_12px_rgba(0,104,55,0.3)]">
            <button
              type="button"
              onClick={() => onChange(quantity - 1)}
              aria-label={`One fewer ${product.name}`}
              className="grid h-11 w-11 place-items-center"
            >
              <Minus size={18} strokeWidth={2.4} />
            </button>
            <span className="text-base font-bold tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => onChange(quantity + 1)}
              aria-label={`One more ${product.name}`}
              className="grid h-11 w-11 place-items-center"
            >
              <Plus size={18} strokeWidth={2.4} />
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="flex flex-col gap-0.5 px-0.5 text-left lg:px-4 lg:pt-1 lg:pb-4"
      >
        <span className="line-clamp-2 text-[15px] font-bold leading-tight lg:text-base">
          {product.name}
        </span>
        {product.description && (
          <span className="line-clamp-2 text-[13px] leading-snug text-[#5B6270] lg:text-sm">
            {product.description}
          </span>
        )}
        <span className="mt-1 text-base font-bold text-[#006837] tabular-nums lg:text-[17px]">
          {formatNaira(product.price)}
        </span>
      </button>
    </div>
  );
}

/** − n + for a line in the order panel. */
function MiniStepper({
  label,
  quantity,
  onChange,
}: {
  label: string;
  quantity: number;
  onChange: (next: number) => void;
}) {
  return (
    <span className="inline-flex h-8 items-center rounded-full bg-[#F4F3EF] px-1 text-sm font-bold">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label={`One fewer ${label}`}
        className="grid h-7 w-7 place-items-center"
      >
        <Minus size={13} />
      </button>
      <span className="min-w-[1rem] text-center tabular-nums">{quantity}</span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        aria-label={`One more ${label}`}
        className="grid h-7 w-7 place-items-center"
      >
        <Plus size={13} />
      </button>
    </span>
  );
}
