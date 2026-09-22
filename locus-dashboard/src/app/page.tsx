import { Bell, Globe, ArrowUpRight, ShieldCheck, Database, Activity } from "lucide-react";
import RouteDistributionChart from "@/components/RouteDistributionChart";
import TelemetryVelocityChart from "@/components/TelemetryVelocityChart";

export default function Home() {
  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-(--text-main)">Overview</h1>
          <p className="text-sm text-(--text-muted) mt-1">Real-time BGP telemetry and mitigation status</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="text-(--text-muted) hover:text-(--text-main)">
            <Globe size={20} />
          </button>
          <button className="text-(--text-muted) hover:text-(--text-main) relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-(--surface) p-5 rounded-xl border border-[#2a2a2c]">
          <p className="text-(--text-muted) text-sm mb-2">Routes Analyzed</p>
          <h2 className="text-3xl font-bold text-(--text-main) mb-2">3,131,021</h2>
          <div className="flex items-center text-(--primary-neon) text-xs font-medium">
            <ArrowUpRight size={14} className="mr-1" />
            <span>0.4% vs last hour</span>
          </div>
        </div>

        <div className="bg-(--surface) p-5 rounded-xl border border-[#2a2a2c]">
          <p className="text-(--text-muted) text-sm mb-2">Threats Mitigated</p>
          <h2 className="text-3xl font-bold text-(--text-main) mb-2">1,511</h2>
          <div className="flex items-center text-(--primary-neon) text-xs font-medium">
            <ShieldCheck size={14} className="mr-1" />
            <span>100% block rate</span>
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

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RouteDistributionChart />
        <TelemetryVelocityChart />
      </div>
    </div>
  );
}