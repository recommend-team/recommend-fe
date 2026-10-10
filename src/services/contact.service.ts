import { request } from "@/lib/api";

export interface ContactPayload {
  fullName: string;
  email: string;
  phoneNumber?: string;
  topic: string;
  orderReference?: string;
  message: string;
  /** The honeypot — always empty from a person. */
  website?: string;
}

/** Sends the contact form to the team inbox (`recommend-be` → `POST /contact`). */
export async function sendContactMessage(payload: ContactPayload): Promise<void> {
  await request<null>("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
