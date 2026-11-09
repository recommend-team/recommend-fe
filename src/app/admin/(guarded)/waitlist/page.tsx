"use client";

import { useState } from "react";
import { Download, Mail, Phone } from "lucide-react";
import PageHeader from "@/components/atoms/admin/PageHeader";
import Paginator from "@/components/atoms/admin/Paginator";
import { useWaitlist } from "@/hooks";
import { downloadWaitlistCsv } from "@/services";
import { ApiError } from "@/lib/api";

const PER_PAGE = 50;

/**
 * Everyone who asked to be told when ordering opens — the phone numbers and emails buyers
 * left in the chat while it was paused (`CHAT_PAUSED`). Downloaded as CSV at launch, to
 * message them however suits: SMS, WhatsApp, email.
 */
export default function WaitlistPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useWaitlist(page);
  const [downloading, setDownloading] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const download = async () => {
    setDownloading(true);
    setFailure(null);
    try {
      await downloadWaitlistCsv();
    } catch (cause) {
      setFailure(
        cause instanceof ApiError ? cause.message : "Couldn't download it."
      );
    } finally {
      setDownloading(false);
    }
  };

  const items = data?.items ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Waitlist"
        description="People who left a phone number or email in the chat while ordering was paused, to hear when we launch."
        right={
          <button
            type="button"
            onClick={() => void download()}
            disabled={downloading || !data?.total}
            className="inline-flex items-center gap-1.5 rounded-full bg-recommend-green px-4 py-2 font-dm text-sm font-bold text-white hover:bg-recommend-green-hover disabled:opacity-40"
          >
            <Download size={15} />
            {downloading ? "Downloading…" : "Download CSV"}
          </button>
        }
      />

      {failure && (
        <p role="alert" className="font-dm text-sm text-red-600">
          {failure}
        </p>
      )}

      <section className="rounded-2xl border border-black/10 bg-white">
        <div className="border-b border-black/5 px-5 py-4">
          <p className="font-dm text-sm text-gray-600">
            {data ? (
              <>
                <b className="text-gray-900">{data.total}</b>{" "}
                {data.total === 1 ? "person is" : "people are"} waiting for
                launch
              </>
            ) : (
              " "
            )}
          </p>
        </div>

        {isLoading && (
          <p className="p-6 text-center font-dm text-sm text-gray-400">
            Loading…
          </p>
        )}
        {isError && (
          <p className="p-6 text-center font-dm text-sm text-red-600">
            Couldn&apos;t load the waitlist.
          </p>
        )}
        {data && items.length === 0 && (
          <p className="p-6 text-center font-dm text-sm text-gray-400">
            Nobody yet. When the chat is paused, buyers are asked for a phone
            number or email, and they appear here.
          </p>
        )}

        {items.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full font-dm text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500">
                  <th className="px-5 py-2.5 font-semibold">Contact</th>
                  <th className="px-5 py-2.5 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {items.map((signup) => (
                  <tr key={signup.id} className="border-t border-black/5">
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-2 text-gray-900">
                        {signup.kind === "PHONE" ? (
                          <Phone className="h-3.5 w-3.5 text-gray-400" />
                        ) : (
                          <Mail className="h-3.5 w-3.5 text-gray-400" />
                        )}
                        {signup.kind === "PHONE" ? (
                          <a
                            href={`tel:${signup.contact}`}
                            className="hover:text-recommend-green"
                          >
                            {signup.contact}
                          </a>
                        ) : (
                          <a
                            href={`mailto:${signup.contact}`}
                            className="break-all hover:text-recommend-green"
                          >
                            {signup.contact}
                          </a>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap text-gray-500">
                      {new Date(signup.createdAt).toLocaleString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.total > PER_PAGE && (
          <div className="border-t border-black/5 px-5 py-3">
            <Paginator
              page={page}
              total={data.total}
              pageSize={PER_PAGE}
              loadedOnThisPage={items.length}
              onChange={setPage}
              label="people"
            />
          </div>
        )}
      </section>
    </div>
  );
}
