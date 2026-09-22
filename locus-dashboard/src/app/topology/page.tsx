"use client";

import { Network, Database, RefreshCw, ZoomIn, ZoomOut, Maximize, AlertTriangle } from "lucide-react";

export default function Topology() {
  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-(--primary-neon)/10 text-(--primary-neon) rounded-lg">
              <Network size={24} />
            </div>
            <h1 className="text-2xl font-semibold text-(--text-main)">Graph Topology</h1>
          </div>
          <p className="text-sm text-(--text-muted)">
            Live Neo4j structural representation of global Autonomous Systems and peering links.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-(--primary-neon) text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <RefreshCw size={16} /> Force Sync DB
          </button>
        </div>
      </header>

      {/* Neo4j Database Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-(--surface) p-4 rounded-xl border border-[#2a2a2c] flex items-center justify-between">
          <div>
            <p className="text-(--text-muted) text-xs mb-1">Total ASNs (Nodes)</p>
            <h2 className="text-2xl font-bold text-(--text-main)">74,201</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#2a2a2c] flex items-center justify-center text-(--text-muted)">
            <Database size={18} />
          </div>
        </div>
        <div className="bg-(--surface) p-4 rounded-xl border border-[#2a2a2c] flex items-center justify-between">
          <div>
            <p className="text-(--text-muted) text-xs mb-1">Peering Links (Edges)</p>
            <h2 className="text-2xl font-bold text-(--text-main)">412,893</h2>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#2a2a2c] flex items-center justify-center text-(--text-muted)">
            <Network size={18} />
          </div>
        </div>
        <div className="bg-(--surface) p-4 rounded-xl border border-[#2a2a2c] flex items-center justify-between">
          <div>
            <p className="text-(--text-muted) text-xs mb-1">Symbolic Inference Engine</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-(--primary-neon) animate-pulse"></span>
              <span className="text-sm font-semibold text-(--text-main)">ONLINE</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-(--primary-neon)/10 flex items-center justify-center text-(--primary-neon)">
            <RefreshCw size={18} />
          </div>
        </div>
      </div>

      {/* Interactive Graph Viewer Mock */}
      <div className="bg-(--surface) rounded-xl border border-[#2a2a2c] flex-1 flex flex-col overflow-hidden min-h-125">
        {/* Viewer Toolbar */}
        <div className="flex justify-between items-center p-4 border-b border-[#2a2a2c]">
          <h3 className="font-medium text-sm text-(--text-main)">Visual Explorer</h3>
          <div className="flex bg-[#111113] rounded-lg border border-[#2a2a2c] overflow-hidden">
            <button className="p-2 text-(--text-muted) hover:text-(--text-main) hover:bg-[#2a2a2c] transition-colors"><ZoomIn size={16} /></button>
            <div className="w-px bg-[#2a2a2c]"></div>
            <button className="p-2 text-(--text-muted) hover:text-(--text-main) hover:bg-[#2a2a2c] transition-colors"><ZoomOut size={16} /></button>
            <div className="w-px bg-[#2a2a2c]"></div>
            <button className="p-2 text-(--text-muted) hover:text-(--text-main) hover:bg-[#2a2a2c] transition-colors"><Maximize size={16} /></button>
          </div>
        </div>
        
        {/* Graph Canvas */}
        <div className="flex-1 bg-[#0a0a0c] relative overflow-hidden flex items-center justify-center" style={{ backgroundImage: 'radial-gradient(#2a2a2c 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          
          {/* Simulated SVG Graph Network */}
          <svg className="w-full h-full max-w-2xl max-h-96" viewBox="0 0 800 500">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Edges */}
            <path d="M 400 250 L 250 150" stroke="#2a2a2c" strokeWidth="2" />
            <path d="M 400 250 L 550 150" stroke="#2a2a2c" strokeWidth="2" />
            <path d="M 400 250 L 250 350" stroke="#2a2a2c" strokeWidth="2" />
            <path d="M 400 250 L 550 350" stroke="#2a2a2c" strokeWidth="2" />
            <path d="M 250 150 L 150 100" stroke="#2a2a2c" strokeWidth="2" />
            <path d="M 250 150 L 100 200" stroke="#2a2a2c" strokeWidth="2" />
            <path d="M 550 350 L 650 400" stroke="#2a2a2c" strokeWidth="2" />
            
            {/* Malicious Route Injection Path */}
            <path d="M 550 150 L 700 200" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5" className="animate-pulse" />
            <path d="M 700 200 L 750 100" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5" className="animate-pulse" />

            {/* Nodes */}
            <circle cx="150" cy="100" r="12" fill="#1a1a1c" stroke="#a3e635" strokeWidth="2" filter="url(#glow)" />
            <circle cx="100" cy="200" r="12" fill="#1a1a1c" stroke="#a3e635" strokeWidth="2" filter="url(#glow)" />
            <circle cx="250" cy="150" r="20" fill="#1a1a1c" stroke="#a3e635" strokeWidth="3" filter="url(#glow)" />
            <text x="250" y="145" fill="#f3f4f6" fontSize="12" textAnchor="middle" dy="25">AS 6453</text>

            <circle cx="250" cy="350" r="18" fill="#1a1a1c" stroke="#a3e635" strokeWidth="3" filter="url(#glow)" />
            <text x="250" y="345" fill="#f3f4f6" fontSize="12" textAnchor="middle" dy="25">AS 9012</text>

            <circle cx="550" cy="350" r="18" fill="#1a1a1c" stroke="#a3e635" strokeWidth="3" filter="url(#glow)" />
            <circle cx="650" cy="400" r="12" fill="#1a1a1c" stroke="#a3e635" strokeWidth="2" filter="url(#glow)" />

            {/* Core Node */}
            <circle cx="400" cy="250" r="30" fill="#a3e635" filter="url(#glow)" />
            <text x="400" y="245" fill="#111113" fontSize="16" fontWeight="bold" textAnchor="middle" dy="10">AS 701</text>

            {/* Hijacked Target */}
            <circle cx="550" cy="150" r="20" fill="#1a1a1c" stroke="#a3e635" strokeWidth="3" filter="url(#glow)" />
            <text x="550" y="145" fill="#f3f4f6" fontSize="12" textAnchor="middle" dy="25">Target: AS 1299</text>

            {/* Malicious Nodes */}
            <circle cx="700" cy="200" r="18" fill="#1a1a1c" stroke="#ef4444" strokeWidth="3" filter="url(#glow-red)" />
            <text x="700" y="195" fill="#ef4444" fontSize="12" textAnchor="middle" dy="25">AS 66666</text>
            <circle cx="750" cy="100" r="15" fill="#1a1a1c" stroke="#ef4444" strokeWidth="3" filter="url(#glow-red)" />
            <text x="750" y="95" fill="#ef4444" fontSize="12" textAnchor="middle" dy="25">AS 99999</text>
          </svg>

          {/* Legend overlay */}
          <div className="absolute bottom-6 right-6 bg-[#1a1a1c]/80 backdrop-blur-md p-4 rounded-lg border border-[#2a2a2c] text-xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-(--primary-neon) shadow-[0_0_8px_var(--primary-neon)]"></div>
              <span className="text-(--text-main)">Tier 1 Provider</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-(--primary-neon) shadow-[0_0_8px_var(--primary-neon)]"></div>
              <span className="text-(--text-main)">Verified ASN</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-red-500 shadow-[0_0_8px_#ef4444]"></div>
              <span className="text-(--text-main)">Malicious/Unverified</span>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-[#2a2a2c]">
              <AlertTriangle size={14} className="text-amber-500" />
              <span className="text-(--text-muted)">Synthetic Route Detected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}