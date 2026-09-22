"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Zap } from "lucide-react";

const streamData = [
  { time: "00s", updates: 320 },
  { time: "10s", updates: 450 },
  { time: "20s", updates: 410 },
  { time: "30s", updates: 680 },
  { time: "40s", updates: 590 },
  { time: "50s", updates: 840 },
  { time: "60s", updates: 760 },
];

export default function TelemetryVelocityChart() {
  return (
    <div className="bg-(--surface) p-6 rounded-xl border border-[#2a2a2c] flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-(--text-main) text-base">Stream Ingestion Velocity</h3>
          <p className="text-xs text-(--text-muted)">Updates per second (RIPE RIS RRC21)</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-(--primary-neon)/10 text-(--primary-neon) text-xs font-medium">
          <Zap size={13} />
          <span>Live Stream</span>
        </div>
      </div>

      <div className="my-2">
        <span className="text-3xl font-bold text-(--text-main)">760</span>
        <span className="text-xs text-(--text-muted) ml-2">msg/s</span>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={streamData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="neonGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a3e635" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a3e635" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1c",
                borderColor: "#2a2a2c",
                borderRadius: "8px",
                color: "#f3f4f6",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="updates"
              stroke="#a3e635"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#neonGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}