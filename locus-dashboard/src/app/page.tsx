"use client";
import { useEffect, useState, useRef } from "react";
import { Bell, Globe, ArrowUpRight, ShieldCheck, Database, Activity } from "lucide-react";
import RouteDistributionChart from "@/components/RouteDistributionChart";
import TelemetryVelocityChart from "@/components/TelemetryVelocityChart";
import IncidentTable, { Incident } from "@/components/IncidentTable";
import MitigationControlCard from "@/components/MitigationControlCard";

export default function Home() {
  // Global State for the Dashboard Top Cards
  const [stats, setStats] = useState({
    analyzed: 3131021,
    mitigated: 1511,
    prepended: 420100 // baseline static for donut visualization
  });
  
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  
  // Rolling buffer for the Area Chart
  const updatesInCurrentInterval = useRef(0);
  const [currentRate, setCurrentRate] = useState(0);
  const [velocityData, setVelocityData] = useState(
    Array.from({ length: 7 }, (_, i) => ({ time: `-${14 - (i*2)}s`, updates: 0 }))
  );

  useEffect(() => {
    // Establish WebSocket Connection
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      updatesInCurrentInterval.current += 1;
      const data = JSON.parse(event.data);

      if (data.type === "route_verified") {
        setStats(prev => ({ ...prev, analyzed: prev.analyzed + 1 }));
      } 
      else if (data.type === "hijack_alert") {
        setStats(prev => ({
          ...prev,
          analyzed: prev.analyzed + 1,
          mitigated: data.mitigated ? prev.mitigated + 1 : prev.mitigated,
        }));

        setIncidents(prev => [{
          id: `INC-${Math.floor(Math.random() * 10000)}`,
          prefix: data.prefix,
          asPath: data.as_path,
          detectionType: "Topology Violation",
          status: (data.mitigated ? "Mitigated" : "Investigating") as "Mitigated" | "Investigating",
          timestamp: data.timestamp,
        }, ...prev].slice(0, 6));
      }
    };

    // Calculate messages/sec every 2 seconds and shift the graph
    const interval = setInterval(() => {
      const msgs = updatesInCurrentInterval.current;
      setCurrentRate(Math.round(msgs / 2));
      
      setVelocityData(prev => {
        const timeLabel = new Date().getSeconds() + "s";
        return [...prev.slice(1), { time: timeLabel, updates: msgs }];
      });
      
      updatesInCurrentInterval.current = 0;
    }, 2000);

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
      
      {/* Header with Live Connection Status */}
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

      {/* Row 1: Key Metrics (Wired to Live State) */}
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

      {/* Row 2: Charts (Wired to Live State) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RouteDistributionChart 
          stats={{ 
            verified: stats.analyzed - stats.mitigated - stats.prepended, 
            hijacked: stats.mitigated, 
            prepended: stats.prepended 
          }} 
        />
        <TelemetryVelocityChart data={velocityData} currentRate={currentRate} />
      </div>

      {/* Row 3: Incidents & Router Mitigation Control */}
      <div className="flex flex-col lg:flex-row gap-6">
        <IncidentTable incidents={incidents} />
        <MitigationControlCard />
      </div>
      
    </div>
  );
}