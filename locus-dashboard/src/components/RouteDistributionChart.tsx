"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MoreVertical } from "lucide-react";

const data = [
  { name: "Verified BGP Paths", value: 78, color: "#a3e635" },
  { name: "AS-Prepending", value: 16, color: "#4ade80" },
  { name: "Flagged Hijacks", value: 6, color: "#ef4444" },
];

export default function RouteDistributionChart() {
  return (
    <div className="bg-(--surface) p-6 rounded-xl border border-[#2a2a2c] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="font-semibold text-(--text-main) text-base">Route Verification</h3>
          <p className="text-xs text-(--text-muted)">Topological Path Integrity</p>
        </div>
        <button className="text-(--text-muted) hover:text-(--text-main)">
          <MoreVertical size={16} />
        </button>
      </div>

      <div className="relative h-48 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1c",
                borderColor: "#2a2a2c",
                borderRadius: "8px",
                color: "#f3f4f6",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#a3e635" }}
            />
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Indicator */}
        <div className="absolute flex flex-col items-center pointer-events-none">
          <span className="text-2xl font-bold text-(--text-main)">94%</span>
          <span className="text-[11px] text-(--text-muted)">Valid Paths</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#2a2a2c]/60 text-xs">
        {data.map((item) => (
          <div key={item.name} className="flex flex-col">
            <span className="flex items-center gap-1 text-(--text-muted) text-[11px]">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: item.color }}
              />
              {item.name}
            </span>
            <span className="font-semibold text-(--text-main) mt-0.5">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}