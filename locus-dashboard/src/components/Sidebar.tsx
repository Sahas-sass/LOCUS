"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShieldAlert, Activity, Network, Settings, Search } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", path: "/", icon: LayoutDashboard },
    { name: "Active Threats", path: "/active-threats", icon: ShieldAlert },
    { name: "Graph Topology", path: "/topology", icon: Network },
    { name: "Telemetry", path: "/telemetry", icon: Activity },
  ];

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
        
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                isActive ? "bg-(--primary-neon) text-black" : "text-(--text-muted) hover:text-(--text-main)"
              }`}
            >
              <Icon size={18} /> {item.name}
            </Link>
          );
        })}

        <p className="px-2 text-xs font-semibold text-(--text-muted) mb-3 mt-8 tracking-wider">SETTINGS</p>
        
        <Link 
          href="/settings" 
          className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
            pathname === "/settings" ? "bg-(--primary-neon) text-black" : "text-(--text-muted) hover:text-(--text-main)"
          }`}
        >
          <Settings size={18} /> Configuration
        </Link>
      </div>
    </aside>
  );
}