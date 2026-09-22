"use client";

import { MoreVertical, ShieldAlert, CheckCircle2 } from "lucide-react";

export interface Incident {
  id: string;
  prefix: string;
  asPath: string;
  detectionType: string;
  status: "Mitigated" | "Investigating";
  timestamp: string;
}

export default function IncidentTable({ incidents = [] }: { incidents?: Incident[] }) {
  return (
    <div className="bg-(--surface) p-6 rounded-xl border border-[#2a2a2c] flex-1">
      <div className="flex justify-between items-center mb-5">
        <div>
          <h3 className="font-semibold text-(--text-main) text-base">Detected Hijacks & Anomalies</h3>
          <p className="text-xs text-(--text-muted)">Real-time verification flags from inference engine</p>
        </div>
        <button className="text-(--text-muted) hover:text-(--text-main)">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-(--text-muted) border-b border-[#2a2a2c]/60">
              <th className="pb-3 font-medium">TARGET PREFIX</th>
              <th className="pb-3 font-medium">ADVERTISED AS-PATH</th>
              <th className="pb-3 font-medium">DETECTION VECTOR</th>
              <th className="pb-3 font-medium">STATUS</th>
              <th className="pb-3 font-medium text-right">TIME</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2c]/40">
            {incidents.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-(--text-muted)">
                  No anomalies detected. Network secure.
                </td>
              </tr>
            ) : (
              incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-(--surface-hover)/40 transition-colors">
                  <td className="py-3.5 font-mono font-medium text-(--text-main)">
                    {incident.prefix}
                  </td>
                  <td className="py-3.5 font-mono text-(--text-muted)">
                    {incident.asPath}
                  </td>
                  <td className="py-3.5 text-(--text-muted)">
                    {incident.detectionType}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        incident.status === "Mitigated"
                          ? "bg-(--primary-neon)/15 text-(--primary-neon)"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {incident.status === "Mitigated" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <ShieldAlert size={12} />
                      )}
                      {incident.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right text-(--text-muted)">
                    {incident.timestamp}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}