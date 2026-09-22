"use client";

import { Server, Radio, ShieldCheck, Terminal } from "lucide-react";
import { useState } from "react";

export default function MitigationControlCard() {
  const [isAutomated, setIsAutomated] = useState(true);

  const handleToggle = async () => {
    const newState = !isAutomated;
    setIsAutomated(newState); // Optimistic UI update
    
    try {
      await fetch("http://localhost:8000/api/mitigation/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: newState })
      });
    } catch (error) {
      console.error("Failed to toggle engine state", error);
      setIsAutomated(!newState); // Revert if API fails
    }
  };

  return (
    <div className="bg-linear-to-b from-[#192415] to-(--surface) p-6 rounded-xl border border-(--primary-neon)/20 flex flex-col justify-between w-full lg:w-80 shrink-0">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isAutomated ? 'bg-(--primary-neon)/20 text-(--primary-neon)' : 'bg-amber-500/20 text-amber-500'}`}>
            <Radio size={12} className={isAutomated ? "animate-pulse" : ""} />
            Router Gateway
          </span>
          <span className="text-[11px] text-(--text-muted)">vtysh connected</span>
        </div>

        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-(--text-main)">AS 100</span>
            <span className="text-xs text-(--text-muted)">BGP Daemon</span>
          </div>
          <p className="text-xs text-(--text-muted) mt-1">
            FRRouting container <code className="text-(--primary-neon) font-mono">router-a</code> armed with dynamic /26 de-aggregation.
          </p>
        </div>

        <div className="space-y-2 py-3 border-y border-[#2a2a2c]/60 text-xs">
          <div className="flex justify-between">
            <span className="text-(--text-muted) flex items-center gap-1.5">
              <Server size={13} /> Target Container
            </span>
            <span className="font-mono text-(--text-main)">router-a (FRR)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-muted) flex items-center gap-1.5">
              <Terminal size={13} /> Active Mechanism
            </span>
            <span className="text-(--text-main)">Sub-prefix Override</span>
          </div>
          <div className="flex justify-between">
            <span className="text-(--text-muted) flex items-center gap-1.5">
              <ShieldCheck size={13} /> Automated Defense
            </span>
            <span className={`font-semibold ${isAutomated ? 'text-(--primary-neon)' : 'text-amber-500'}`}>
              {isAutomated ? "ENABLED" : "PAUSED"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <button
          onClick={handleToggle}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${
            isAutomated ? 'bg-(--primary-neon) text-black' : 'bg-amber-500 text-black'
          }`}
        >
          {isAutomated ? "Pause Auto-Mitigation" : "Arm Auto-Mitigation"}
        </button>
        <p className="text-[10px] text-center text-(--text-muted)">
          Executes docker vtysh blackhole injection automatically
        </p>
      </div>
    </div>
  );
}