"use client";

import { useEffect, useState } from "react";
import { Bell, Globe, ArrowUpRight, ShieldCheck, Database, Activity } from "lucide-react";
import RouteDistributionChart from "@/components/RouteDistributionChart";
import TelemetryVelocityChart from "@/components/TelemetryVelocityChart";
import IncidentTable, { Incident } from "@/components/IncidentTable";
import MitigationControlCard from "@/components/MitigationControlCard";

export default function Home() {
  const [stats, setStats] = useState({
    analyzed: 3131021,
    mitigated: 1511,
  });
  
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Establish WebSocket connection to FastAPI
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "route_verified") {
        setStats((prev) => ({ ...prev, analyzed: prev.analyzed + 1 }));
      } 
      else if (data.type === "hijack_alert") {
        setStats((prev) => ({
          analyzed: prev.analyzed + 1,
          mitigated: data.mitigated ? prev.mitigated + 1 : prev.mitigated,
        }));

        const newIncident: Incident = {
          id: `INC-${Math.floor(Math.random() * 10000)}`,
          prefix: data.prefix,
          asPath: data.as_path,
          detectionType: "Topology Violation",
          status: data.mitigated ? "Mitigated" : "Investigating",
          timestamp: data.timestamp,
        };

        // Prepend new incident and keep only the latest 6
        setIncidents((prev) => [newIncident, ...prev].slice(0, 6));
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-(--text-main)">Overview</h1>
          <p className="text-sm text-(--text-muted) mt-1">
            Real-time BGP telemetry, symbolic verification & automated mitigation
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${isConnected ? 'bg-(--primary-neon)/10 border-(--primary-neon)/20 text-(--primary-neon)' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-(--primary-neon) animate-pulse' : 'bg-red-500'}`}></span>
            {isConnected ? "Engine Connected" : "Disconnected"}
          </div>
          <button className="p-2 rounded-lg bg-(--surface) border border-[#2a2a2c] text-(--text-muted) hover:text-(--text-main) transition-colors">
            <Globe size={18} />
          </button>
          <button className="p-2 rounded-lg bg-(--surface) border border-[#2a2a2c] text-(--text-muted) hover:text-(--text-main) relative transition-colors">
            <Bell size={18} />
            {incidents.length > 0 && (
              <span className="absolute 1.5 top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-(--surface) p-5 rounded-xl border border-[#2a2a2c]">
          <p className="text-(--text-muted) text-sm mb-2">Routes Analyzed</p>
          <h2 className="text-3xl font-bold text-(--text-main) mb-2">
            {stats.analyzed.toLocaleString()}
          </h2>
          <div className="flex items-center text-(--primary-neon) text-xs font-medium">
            <ArrowUpRight size={14} className="mr-1" />
            <span>Live from Go Daemon</span>
          </div>
        </div>

        <div className="bg-(--surface) p-5 rounded-xl border border-[#2a2a2c]">
          <p className="text-(--text-muted) text-sm mb-2">Threats Mitigated</p>
          <h2 className="text-3xl font-bold text-(--text-main) mb-2">
            {stats.mitigated.toLocaleString()}
          </h2>
          <div className="flex items-center text-(--primary-neon) text-xs font-medium">
            <ShieldCheck size={14} className="mr-1" />
            <span>Automated block rate</span>
          </div>
        </div>

        <div className="bg-(--surface) p-5 rounded-xl border border-[#2a2a2c]">
          <p className="text-(--text-muted) text-sm mb-2">Graph Nodes (ASNs)</p>
          <h2 className="text-3xl font-bold text-(--text-main) mb-2">74,201</h2>
          <div className="flex items-center text-(--primary-neon) text-xs font-medium">
            <Database size={14} className="mr-1" />
            <span>Live Neo4j Sync</span>
          </div>
        </div>

        <div className="bg-(--surface) p-5 rounded-xl border border-[#2a2a2c]">
          <p className="text-(--text-muted) text-sm mb-2">Engine Uptime</p>
          <h2 className="text-3xl font-bold text-(--text-main) mb-2">99.9%</h2>
          <div className="flex items-center text-(--primary-neon) text-xs font-medium">
            <Activity size={14} className="mr-1" />
            <span>System Nominal</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RouteDistributionChart />
        <TelemetryVelocityChart />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <IncidentTable incidents={incidents} />
        <MitigationControlCard />
      </div>
    </div>
  );
}