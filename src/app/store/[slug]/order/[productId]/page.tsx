import { redirect } from "next/navigation";

/**
 * The old one-product order page. Buying now happens in the shop's cart, so links already
 * shared to a single product open the shop instead of a form that no longer works.
 */
export default async function OldProductOrderPage({
  params,
}: {
  params: Promise<{ slug: string; productId: string }>;
}) {
  const { slug } = await params;
  redirect(`/store/${encodeURIComponent(slug)}`);
}
