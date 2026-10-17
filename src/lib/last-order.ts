/**
 * The order this browser just paid for — so the page Paystack returns to can offer the
 * way back to the vendor's shop, and open the chat with the buyer's email filled in.
 * The order status endpoint deliberately carries no contact details.
 */
export interface LastOrder {
  reference: string;
  slug: string;
  email: string;
}

const KEY = "recommend:last-order";

export function rememberOrder(order: LastOrder): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(order));
  } catch {
    // Without it, the order page still works — just without the shortcuts.
  }
}

export function recallOrder(reference: string): LastOrder | null {
  try {
    const raw = localStorage.getItem(KEY);
    const order = raw ? (JSON.parse(raw) as LastOrder) : null;
    return order?.reference === reference ? order : null;
  } catch {
    return null;
  }
}
