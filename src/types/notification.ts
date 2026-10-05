/**
 * One entry in an admin's notifications feed — an alert, kept.
 *
 * The server writes one per admin (`recommend-be` → `admin-alerts.service.ts`), so read
 * state is each admin's own. `data.alertId` is the id the live alert carried, which lets
 * a banner the admin clicked mark its feed entry read too.
 */
export interface AdminNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  data: {
    alertId?: string;
    kind?: string;
    url?: string;
  } | null;
  readAt: string | null;
  createdAt: string;
}

export interface AdminNotificationFeed {
  items: AdminNotification[];
  total: number;
  unread: number;
  page: number;
  limit: number;
}
