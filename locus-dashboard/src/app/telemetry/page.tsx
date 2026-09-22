"use client";

import { useEffect, useState, useRef } from "react";
import { Activity, Terminal, Wifi, Download, Play, Square } from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "alert" | "success";
}

export default function Telemetry() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws");
    
    ws.onopen = () => {
      setIsConnected(true);
      addLog("WebSocket connection established with LOCUS Inference Engine", "success");
    };
    ws.onclose = () => {
      setIsConnected(false);
      addLog("WebSocket connection lost. Reconnecting...", "alert");
    };

    ws.onmessage = (event) => {
      if (isPaused) return;
      const data = JSON.parse(event.data);
      
      if (data.type === "route_verified") {
        addLog(`[OK] Route Verified - Path: ${data.as_path}`, "info");
      } else if (data.type === "hijack_alert") {
        addLog(`[ALERT] Topologically Invalid Route! Prefix: ${data.prefix} | Path: ${data.as_path}`, "alert");
        if (data.mitigated) {
          addLog(`[MITIGATION SUCCESS] Counter-announcement deployed for ${data.prefix}`, "success");
        }
      }
    };

    return () => ws.close();
  }, [isPaused]);

  const addLog = (message: string, type: "info" | "alert" | "success") => {
    setLogs(prev => [...prev.slice(-99), {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString().split('T')[1].slice(0, -1),
      message,
      type
    }]);
  };

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="p-8 space-y-6 max-w-[1600px] mx-auto h-full flex flex-col">
      <header className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-(--primary-neon)/10 text-(--primary-neon) rounded-lg">
              <Activity size={24} />
            </div>
            <h1 className="text-2xl font-semibold text-(--text-main)">Live Telemetry Stream</h1>
          </div>
          <p className="text-sm text-(--text-muted)">
            Raw BGP daemon ingestion logs and engine inference output.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors border ${
              isPaused 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20' 
                : 'bg-(--surface) border-[#2a2a2c] text-(--text-muted) hover:text-(--text-main)'
            }`}
          >
            {isPaused ? <Play size={16} /> : <Square size={16} />}
            {isPaused ? "Resume Stream" : "Pause Stream"}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-(--surface) border border-[#2a2a2c] text-(--text-muted) hover:text-(--text-main) rounded-lg text-sm transition-colors">
            <Download size={16} /> Export Logs
          </button>
        </div>
      </header>

      <div className="bg-[#0a0a0c] rounded-xl border border-[#2a2a2c] flex-1 flex flex-col overflow-hidden font-mono text-sm relative">
        <div className="flex items-center justify-between px-4 py-2 bg-[#111113] border-b border-[#2a2a2c]">
          <div className="flex items-center gap-2 text-(--text-muted) text-xs">
            <Terminal size={14} />
            <span>locus-engine.log</span>
          </div>
          <div className={`flex items-center gap-2 text-xs font-medium ${isConnected ? 'text-(--primary-neon)' : 'text-red-500'}`}>
            <Wifi size={14} />
            {isConnected ? "WS Connected" : "WS Disconnected"}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {logs.map((log) => (
            <div key={log.id} className="flex gap-4">
              <span className="text-[#6b7280] shrink-0">[{log.timestamp}]</span>
              <span className={`break-all ${
                log.type === "alert" ? "text-red-400 font-medium" : 
                log.type === "success" ? "text-(--primary-neon)" : 
                "text-[#d1d5db]"
              }`}>
                {log.message}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}