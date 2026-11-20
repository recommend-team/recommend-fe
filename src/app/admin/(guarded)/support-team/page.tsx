"use client";

import { useState } from "react";
import { useSupportTeam } from "@/hooks";
import { durationText } from "@/components/organisms/ConversationHandlingStrip";
import { staffRoleLabel } from "@/lib/staff-access";
import type { SupportAgent } from "@/types";

const PERIODS = [
  { days: 1, label: "Today" },
  { days: 7, label: "7 days" },
  { days: 30, label: "30 days" },
];

/** A weighted average across agents, so a busy agent counts for more than a quiet one. */
function teamAverage(
  agents: SupportAgent[],
  pick: (agent: SupportAgent) => number | null
): number | null {
  let total = 0;
  let weight = 0;
  for (const agent of agents) {
    const value = pick(agent);
    if (value === null || agent.handled === 0) continue;
    total += value * agent.handled;
    weight += agent.handled;
  }
  return weight ? total / weight : null;
}

/**
 * How answering buyers is going, person by person — for admins. Who has chats right now,
 * how long buyers waited before someone picked them up, and how quickly each person
 * replied once they had.
 */
export default function SupportTeamPage() {
  const [days, setDays] = useState(7);
  const team = useSupportTeam(days);
  const agents = team.data?.agents ?? [];

  const openNow = agents.reduce((sum, agent) => sum + agent.openNow, 0);
  const handled = agents.reduce((sum, agent) => sum + agent.handled, 0);
  const pickup = teamAverage(agents, (agent) => agent.avgPickupSeconds);
  const firstReply = teamAverage(agents, (agent) => agent.avgFirstReplySeconds);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-dm text-2xl font-bold text-gray-900 md:text-3xl">
            Customer Service
          </h1>
          <p className="font-dm text-sm text-gray-500">
            Who is answering buyers, and how quickly.
          </p>
        </div>
        <div className="flex gap-1.5" role="group" aria-label="Period">
          {PERIODS.map((period) => (
            <button
              key={period.days}
              type="button"
              onClick={() => setDays(period.days)}
              aria-pressed={days === period.days}
              className={[
                "h-9 rounded-full px-4 font-dm text-sm font-semibold transition",
                days === period.days
                  ? "bg-recommend-green text-white"
                  : "bg-white text-gray-700 hover:bg-black/5",
              ].join(" ")}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Chats open now" value={String(openNow)} />
        <Stat label="Chats handled" value={String(handled)} />
        <Stat
          label="Average wait for a person"
          value={durationText(pickup)}
          hint="From asking for a person to someone taking the chat"
        />
        <Stat
          label="Average first reply"
          value={durationText(firstReply)}
          hint="From taking a chat to the first message"
        />
      </div>

      <div className="rounded-2xl border border-[#FFD91D] bg-white p-5 md:p-6">
        {team.isError && (
          <p className="mb-3 rounded-lg bg-red-50 p-3 font-dm text-sm text-red-600">
            Couldn&apos;t load the team. Refresh to try again.
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full font-dm text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs tracking-wide text-gray-500 uppercase">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Open now</th>
                <th className="py-3 pr-4">Handled</th>
                <th className="py-3 pr-4">Buyers waited</th>
                <th className="py-3 pr-4">First reply</th>
                <th className="py-3 pr-4">Went quiet</th>
              </tr>
            </thead>
            <tbody>
              {team.isLoading ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400">
                    Loading the team…
                  </td>
                </tr>
              ) : agents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400">
                    Nobody on the team yet. Add customer service under Admin Management.
                  </td>
                </tr>
              ) : (
                agents.map((agent) => (
                  <tr key={agent.adminId} className="border-b border-gray-100">
                    <td className="py-3 pr-4">
                      <span className="block font-bold text-gray-900">{agent.name}</span>
                      <span className="text-xs text-gray-500">
                        {agent.active ? staffRoleLabel(agent.role) : "No longer active"}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={
                          agent.openNow > 0 ? "font-bold text-recommend-green" : "text-gray-400"
                        }
                      >
                        {agent.openNow}
                      </span>
                    </td>
                    <td className="py-3 pr-4">{agent.handled}</td>
                    <td className="py-3 pr-4">{durationText(agent.avgPickupSeconds)}</td>
                    <td className="py-3 pr-4">{durationText(agent.avgFirstReplySeconds)}</td>
                    <td className="py-3 pr-4">
                      {agent.wentIdle > 0 ? (
                        <span
                          className="font-bold text-recommend-orange"
                          title="Handed back to the assistant after going quiet on a waiting buyer"
                        >
                          {agent.wentIdle}
                        </span>
                      ) : (
                        <span className="text-gray-400">0</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-dm text-xs text-gray-500">
          &quot;Buyers waited&quot; leaves out chats an admin passed to them. &quot;Went quiet&quot;
          counts chats handed back to the assistant because they stopped replying.
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-[#FFD91D] bg-white p-4" title={hint}>
      <p className="font-dm text-xs font-semibold text-gray-500">{label}</p>
      <p className="mt-1 font-dm text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
