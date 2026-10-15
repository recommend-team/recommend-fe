import { request } from "@/lib/api";
import type {
  AdminBuyerDetail,
  AdminBuyerSummary,
  AdminOrderSummary,
  AdminRider,
  AdminStatusEvent,
  AdminTransactionSummary,
  AdminUser,
  AdminVendorDetail,
  AdminVendorSummary,
  AdminWithdrawal,
  BuyerListFilters,
  CreateAdminPayload,
  CreateRiderPayload,
  OrderListFilters,
  PaginatedResult,
  PaginationParams,
  OrderStatus,
  PendingApproval,
  PlatformStats,
  RiderListFilters,
  TransactionListFilters,
  VendorListFilters,
  WalletEntry,
  WithdrawalListFilters,
  WithdrawalStatus,
} from "@/types";

function qs(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== ""
  );
  if (entries.length === 0) return "";
  const search = new URLSearchParams();
  for (const [key, value] of entries) {
    search.set(key, String(value));
  }
  return `?${search.toString()}`;
}

// Stats
export async function getPlatformStats(): Promise<PlatformStats> {
  return request<PlatformStats>("/super-admin/stats");
}

// Admins
export async function getAdmins(
  params: PaginationParams = {}
): Promise<PaginatedResult<AdminUser>> {
  return request<PaginatedResult<AdminUser>>(
    `/super-admin/admins${qs({ page: params.page, limit: params.limit })}`
  );
}

export async function createAdmin(
  payload: CreateAdminPayload
): Promise<AdminUser> {
  return request<AdminUser>("/super-admin/admins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function suspendAdmin(id: string): Promise<AdminUser> {
  return request<AdminUser>(`/super-admin/admins/${id}/suspend`, {
    method: "PATCH",
  });
}

// Pending approvals / KYC queue
export async function getPendingApprovals(
  params: PaginationParams = {}
): Promise<PaginatedResult<PendingApproval>> {
  return request<PaginatedResult<PendingApproval>>(
    `/admin/pending${qs({ page: params.page, limit: params.limit })}`
  );
}

export async function approvePending(id: string): Promise<unknown> {
  return request<unknown>(`/admin/pending/${id}/approve`, {
    method: "PATCH",
  });
}

export async function rejectPending(
  id: string,
  reason?: string
): Promise<unknown> {
  return request<unknown>(`/admin/pending/${id}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason: reason ?? "" }),
  });
}

// Vendors
export async function getVendors(
  params: VendorListFilters = {}
): Promise<PaginatedResult<AdminVendorSummary>> {
  return request<PaginatedResult<AdminVendorSummary>>(
    `/admin/vendors${qs({
      page: params.page,
      limit: params.limit,
      status: params.status,
      sort: params.sort,
    })}`
  );
}

export async function getVendorDetail(
  id: string
): Promise<AdminVendorDetail> {
  return request<AdminVendorDetail>(`/admin/vendors/${id}`);
}

// Any user by id (works for riders, buyers, vendors alike)
export async function getUserDetail(
  id: string
): Promise<import("@/types").AdminUserDetail> {
  return request<import("@/types").AdminUserDetail>(`/admin/users/${id}`);
}

// Generic user actions (vendors, riders, buyers share the same suspend/activate endpoints)
export async function suspendUser(id: string): Promise<unknown> {
  return request<unknown>(`/admin/users/${id}/suspend`, { method: "PATCH" });
}

export async function activateUser(id: string): Promise<unknown> {
  return request<unknown>(`/admin/users/${id}/activate`, { method: "PATCH" });
}

// Orders
export async function getAdminOrders(
  params: OrderListFilters = {}
): Promise<PaginatedResult<AdminOrderSummary>> {
  return request<PaginatedResult<AdminOrderSummary>>(
    `/admin/orders${qs({
      page: params.page,
      limit: params.limit,
      status: params.status,
      vendorId: params.vendorId,
    })}`
  );
}

// Buyers
export async function getBuyers(
  params: BuyerListFilters = {}
): Promise<PaginatedResult<AdminBuyerSummary>> {
  return request<PaginatedResult<AdminBuyerSummary>>(
    `/admin/buyers${qs({
      page: params.page,
      limit: params.limit,
      status: params.status,
    })}`
  );
}

export async function getBuyerDetail(id: string): Promise<AdminBuyerDetail> {
  return request<AdminBuyerDetail>(`/admin/buyers/${id}`);
}

// Transactions — one row per payment, unlike `/admin/orders` which is one per vendor.
export async function getAdminTransactions(
  params: TransactionListFilters = {}
): Promise<PaginatedResult<AdminTransactionSummary>> {
  return request<PaginatedResult<AdminTransactionSummary>>(
    `/admin/transactions${qs({
      page: params.page,
      limit: params.limit,
      status: params.status,
      search: params.search,
      riderId: params.riderId,
      needsRider: params.needsRider ? "true" : undefined,
    })}`
  );
}

/**
 * Ask Paystack about one transaction now, rather than waiting for the scheduled sweep.
 *
 * Settles it through the same path as the webhook, so a recovery here also confirms the
 * buyer in their chat and notifies the vendors.
 */
export async function verifyAdminTransaction(
  reference: string
): Promise<AdminTransactionSummary> {
  return request<AdminTransactionSummary>(
    `/admin/transactions/${encodeURIComponent(reference)}/verify`,
    { method: "POST" }
  );
}

// ─── Withdrawals ────────────────────────────────────────────────────────────

/** Every vendor's withdrawals, whatever happened to them — in-flight ones first. */
export async function getAdminWithdrawals(
  params: WithdrawalListFilters = {}
): Promise<PaginatedResult<AdminWithdrawal>> {
  return request<PaginatedResult<AdminWithdrawal>>(
    `/admin/withdrawals${qs({
      page: params.page,
      limit: params.limit,
      status: params.status,
      search: params.search,
    })}`
  );
}

/** A vendor's ledger, newest first — every credit and debit behind their balance. */
export async function getWalletStatement(
  userId: string,
  limit = 50
): Promise<WalletEntry[]> {
  return request<WalletEntry[]>(
    `/admin/wallet/${userId}/entries${qs({ limit })}`
  );
}

/**
 * Ask Paystack what happened and correct ours to match. One refunded by mistake but
 * paid by Paystack is settled, and the refund taken back. Never sends anything.
 */
export async function verifyWithdrawal(
  id: string
): Promise<{ status: WithdrawalStatus }> {
  return request(`/admin/withdrawals/${id}/verify`, { method: "POST" });
}

/** Look the reference up on Paystack, and send again only if Paystack has nothing. */
export async function retryWithdrawal(
  id: string
): Promise<{ status: WithdrawalStatus; attempts: number }> {
  return request(`/admin/withdrawals/${id}/retry`, { method: "POST" });
}

/** Give up and return the money to the vendor's balance. */
export async function failWithdrawal(input: {
  id: string;
  reason: string;
}): Promise<{ status: WithdrawalStatus }> {
  return request(`/admin/withdrawals/${input.id}/fail`, {
    method: "POST",
    body: JSON.stringify({ reason: input.reason }),
  });
}

// ─── Order lifecycle ────────────────────────────────────────────────────────

/** A rider has collected everything and left. Requires every vendor to be ready. */
export async function dispatchTransaction(
  reference: string
): Promise<AdminTransactionSummary> {
  return request<AdminTransactionSummary>(
    `/admin/transactions/${encodeURIComponent(reference)}/dispatch`,
    { method: "POST" }
  );
}

/** The buyer has their order. Normally theirs or the rider's to say; admin stands in. */
export async function completeTransaction(
  reference: string
): Promise<AdminTransactionSummary> {
  return request<AdminTransactionSummary>(
    `/admin/transactions/${encodeURIComponent(reference)}/complete`,
    { method: "POST" }
  );
}

/**
 * Force an order to any status.
 *
 * The escape hatch for orders the ordinary rules have stranded — a vendor who never
 * marked ready, a rider who never reported back, a decline handled over the phone. Every
 * use is audited, so `note` is worth filling in: on an override the reason is the point.
 */
export async function overrideTransactionStatus(input: {
  reference: string;
  status: OrderStatus;
  note?: string;
}): Promise<AdminTransactionSummary> {
  return request<AdminTransactionSummary>(
    `/admin/transactions/${encodeURIComponent(input.reference)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status: input.status, note: input.note }),
    }
  );
}

/** Who moved this order, from what to what, when, and why. */
export async function getTransactionHistory(
  reference: string
): Promise<AdminStatusEvent[]> {
  return request<AdminStatusEvent[]>(
    `/admin/transactions/${encodeURIComponent(reference)}/history`
  );
}

// ─── Riders ─────────────────────────────────────────────────────────────────
//
// Until riders have an app, admin runs delivery: adds riders, assigns one to each
// delivery, and reaches them by phone. A rider's deliveries are the transactions list
// filtered by `riderId`.

export async function getRiders(
  params: RiderListFilters = {}
): Promise<PaginatedResult<AdminRider>> {
  return request<PaginatedResult<AdminRider>>(
    `/admin/riders${qs({
      page: params.page,
      limit: params.limit,
      status: params.status,
      search: params.search,
    })}`
  );
}

export async function getRider(id: string): Promise<AdminRider> {
  return request<AdminRider>(`/admin/riders/${id}`);
}

export async function createRider(payload: CreateRiderPayload): Promise<AdminRider> {
  return request<AdminRider>("/admin/riders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Put a rider on a delivery, or replace the one on it. Required before dispatch. */
export async function assignRider(input: {
  reference: string;
  riderId: string;
}): Promise<AdminTransactionSummary> {
  return request<AdminTransactionSummary>(
    `/admin/transactions/${encodeURIComponent(input.reference)}/rider`,
    { method: "POST", body: JSON.stringify({ riderId: input.riderId }) }
  );
}
