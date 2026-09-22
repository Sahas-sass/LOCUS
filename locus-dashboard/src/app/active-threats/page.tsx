"use client";

import { useEffect, useState } from "react";
import { ShieldAlert, CheckCircle2, Search, Filter, Download, Shield } from "lucide-react";

interface Incident {
  id: string;
  prefix: string;
  asPath: string;
  detectionType: string;
  status: "Mitigated" | "Investigating";
  timestamp: string;
}

export default function ActiveThreats() {
  const [incidents, setIncidents] = useState<Incident[]>([
    // Pre-load a few historical mock threats so the page isn't empty on load
    { id: "INC-8099", prefix: "185.220.101.0/24", asPath: "[56987, 1299, 99201]", detectionType: "Unpeered AS Link", status: "Mitigated", timestamp: "12m ago" },
    { id: "INC-8098", prefix: "194.106.196.0/24", asPath: "[49028, 6453, 9012]", detectionType: "Sub-prefix Hijack", status: "Mitigated", timestamp: "46m ago" },
    { id: "INC-8097", prefix: "103.205.160.0/23", asPath: "[24482, 35598, 8888]", detectionType: "Bogus Transit AS", status: "Investigating", timestamp: "1h 15m ago" }
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "hijack_alert") {
        setIncidents(prev => [{
          id: `INC-${Math.floor(Math.random() * 10000)}`,
          prefix: data.prefix,
          asPath: data.as_path,
          detectionType: "Topology Violation",
          status: (data.mitigated ? "Mitigated" : "Investigating") as "Mitigated" | "Investigating",
          timestamp: data.timestamp,
        }, ...prev].slice(0, 50)); // Keep a larger history of 50 on this page
      }
    };

    return () => ws.close();
  }, []);

  const filteredIncidents = incidents.filter(inc => 
    inc.prefix.includes(searchTerm) || inc.asPath.includes(searchTerm) || inc.id.includes(searchTerm)
  );

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-(--primary-neon)/10 text-(--primary-neon) rounded-lg">
              <Shield size={24} />
            </div>
            <h1 className="text-2xl font-semibold text-(--text-main)">Active Threats Log</h1>
          </div>
          <p className="text-sm text-(--text-muted)">
            Comprehensive history of detected BGP anomalies and automated mitigation responses.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-(--surface) border border-[#2a2a2c] text-(--text-muted) hover:text-(--text-main) rounded-lg text-sm transition-colors">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-(--surface) border border-[#2a2a2c] text-(--text-muted) hover:text-(--text-main) rounded-lg text-sm transition-colors">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </header>

      {/* Controls Bar */}
      <div className="bg-(--surface) p-4 rounded-xl border border-[#2a2a2c] flex justify-between items-center">
        <div className="relative w-96">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search by prefix, ASN, or Incident ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-(--background) border border-[#2a2a2c] text-(--text-main) text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:border-(--primary-neon)/50 transition-colors"
          />
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${isConnected ? 'bg-(--primary-neon)/10 text-(--primary-neon)' : 'bg-red-500/10 text-red-500'}`}>
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-(--primary-neon) animate-pulse' : 'bg-red-500'}`}></span>
          {isConnected ? "Live Feed Active" : "Feed Offline"}
        </div>
      </div>

      {/* Full Data Grid */}
      <div className="bg-(--surface) rounded-xl border border-[#2a2a2c] flex-1 overflow-hidden flex flex-col">
        <div className="overflow-y-auto flex-1 p-0">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#1a1a1c] sticky top-0 z-10 shadow-md">
              <tr className="text-(--text-muted) border-b border-[#2a2a2c]">
                <th className="py-4 px-6 font-medium">INCIDENT ID</th>
                <th className="py-4 px-6 font-medium">TARGET PREFIX</th>
                <th className="py-4 px-6 font-medium">ADVERTISED AS-PATH</th>
                <th className="py-4 px-6 font-medium">DETECTION VECTOR</th>
                <th className="py-4 px-6 font-medium">STATUS</th>
                <th className="py-4 px-6 font-medium text-right">TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2c]/40">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-(--text-muted)">
                    No matching threats found.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-(--surface-hover)/60 transition-colors cursor-pointer">
                    <td className="py-4 px-6 font-mono text-(--primary-neon)">{incident.id}</td>
                    <td className="py-4 px-6 font-mono font-medium text-(--text-main)">{incident.prefix}</td>
                    <td className="py-4 px-6 font-mono text-(--text-muted)">{incident.asPath}</td>
                    <td className="py-4 px-6 text-(--text-muted)">{incident.detectionType}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        incident.status === "Mitigated"
                          ? "bg-(--primary-neon)/15 text-(--primary-neon)"
                          : "bg-amber-500/15 text-amber-500"
                      }`}>
                        {incident.status === "Mitigated" ? <CheckCircle2 size={14} /> : <ShieldAlert size={14} />}
                        {incident.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right text-(--text-muted)">{incident.timestamp}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}