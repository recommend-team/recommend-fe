import { redirect } from "next/navigation";

/**
 * The old "Order Confirmed!" page, which promised WhatsApp updates that never came.
 * Paystack may still send buyers here from its dashboard callback; they go on to their
 * real order page, which checks the payment and shows what happens next.
 */
export default async function OldOrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const { reference, trxref } = await searchParams;
  const ref = reference ?? trxref;
  redirect(ref ? `/order/${encodeURIComponent(ref)}` : "/");
}
