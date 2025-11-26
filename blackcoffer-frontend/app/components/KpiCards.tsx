"use client";

import { useEffect, useState } from "react";
import { BarChart3, Flame, TrendingUp, Globe } from "lucide-react";

interface StatsResponse {
  totalInsights: number;
  avgIntensity: number | string;
  avgLikelihood: number | string;
  totalCountries: number;
}

export default function KpiCards() {
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("http://localhost:5000/api/insights/stats");
        const data: StatsResponse = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    }

    loadStats();
  }, []);

  if (!stats)
    return <p className="text-gray-500">Loading summary...</p>;

  return (
  <div className="w-full   px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">

      {/* Total Insights */}
      
      <Card
        title="Total Insights"
        value={stats.totalInsights}
        color="from-indigo-500 to-purple-500"
        Icon={BarChart3}
      />

      {/* Avg Intensity */}
      <Card
        title="Avg Intensity"
        value={stats.avgIntensity}
        color="from-purple-500 to-pink-500"
        Icon={Flame}
      />

      {/* Avg Likelihood */}
      <Card
        title="Avg Likelihood"
        value={stats.avgLikelihood}
        color="from-emerald-500 to-cyan-500"
        Icon={TrendingUp}
      />

      {/* Total Countries */}
      <Card
        title="Total Countries"
        value={stats.totalCountries}
        color="from-orange-500 to-red-500"
        Icon={Globe}
      />

    </div>
    </div>
  );
}

/* -------------------- Card Component -------------------- */

function Card({
  title,
  value,
  color,
  Icon,
}: {
  title: string;
  value: number | string;
  color: string;
  Icon: any;
}) {
  return (
   <div className="bg-white shadow-lg rounded-2xl p-6 border border-black/20 hover:shadow-xl transition-all duration-300">


      {/* Icon Badge */}
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-md`}
      >
        <Icon size={22} />
      </div>

      {/* Title */}
      <p className="text-gray-600 text-sm font-medium mt-4">{title}</p>

      {/* Value */}
      <h2 className="text-4xl font-bold text-gray-900 mt-2">
        {value}
      </h2>
    </div>
  );
}
