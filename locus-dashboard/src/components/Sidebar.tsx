import { LayoutDashboard, ShieldAlert, Activity, Network, Settings, Search } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-(--surface) h-screen border-r border-[#2a2a2c] flex flex-col shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-(--primary-neon) flex items-center justify-center text-black font-bold">
          L
        </div>
        <span className="font-semibold text-sm">LOCUS Admin</span>
      </div>

      <div className="px-6 mb-6">
        <div className="bg-(--background) rounded-md flex items-center px-3 py-2 text-sm text-(--text-muted) border border-[#2a2a2c]">
          <Search size={16} className="mr-2" />
          <input type="text" placeholder="Search..." className="bg-transparent outline-none w-full" />
        </div>
      </div>

      <div className="flex-1 px-4 space-y-1">
        <p className="px-2 text-xs font-semibold text-(--text-muted) mb-3 mt-2 tracking-wider">DASHBOARDS</p>
        
        <a href="#" className="flex items-center gap-3 px-3 py-2 bg-(--primary-neon) text-black rounded-lg font-medium text-sm">
          <LayoutDashboard size={18} /> Overview
        </a>
        
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-(--text-muted) hover:text-(--text-main) rounded-lg font-medium text-sm transition-colors">
          <ShieldAlert size={18} /> Active Threats
        </a>
        
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-(--text-muted) hover:text-(--text-main) rounded-lg font-medium text-sm transition-colors">
          <Network size={18} /> Graph Topology
        </a>
        
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-(--text-muted) hover:text-(--text-main) rounded-lg font-medium text-sm transition-colors">
          <Activity size={18} /> Telemetry
        </a>

        <p className="px-2 text-xs font-semibold text-(--text-muted) mb-3 mt-8 tracking-wider">SETTINGS</p>
        
        <a href="#" className="flex items-center gap-3 px-3 py-2 text-(--text-muted) hover:text-(--text-main) rounded-lg font-medium text-sm transition-colors">
          <Settings size={18} /> Configuration
        </a>
      </div>
    </aside>
  );
}