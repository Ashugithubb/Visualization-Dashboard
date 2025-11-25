"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

interface Insight {
  sector: string;
  intensity: number;
}

export default function IntensityBySector() {
  const [data, setData] = useState<Insight[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("http://localhost:5000/api/insights/agg/intensity-by-sector");
        const json = await res.json();

        const cleaned: Insight[] = json.map((d: any) => ({
          sector: d._id || "Unknown",
          intensity: Number(d.avgIntensity) || 0,
        }));

        setData(cleaned);
      } catch (err) {
        console.error("Failed to fetch:", err);
      }
    }

    loadData();
  }, []);

  return (
    <div className="w-full bg-white shadow-lg border border-gray-100 p-6 rounded-2xl">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">
        Intensity by Sector (Avg)
      </h3>

      <div className="w-full h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 75 }}
          >
            <defs>
              {/* Premium Gradient */}
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6D5DFB" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.8} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="transparent" />

            <XAxis
              dataKey="sector"
              angle={-55}
              textAnchor="end"
              tick={{ fontSize: 11, fill: "#6b7280" }} // Smaller premium
              interval={0}
              height={60}
            />

            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip contentStyle={{ background: "white", borderRadius: 8 }} cursor={{ fill: "transparent" }} />


            <Bar
              dataKey="intensity"
              fill="url(#barGradient)"
              radius={[10, 10, 0, 0]}
              barSize={28}
              activeBar={{
                fill: "#7B6DFF",
                stroke: "#4F46E5",
                strokeWidth: 2,
                radius: "10, 10, 0, 0",
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
