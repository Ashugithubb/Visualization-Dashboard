"use client";

import { useEffect, useState } from "react";

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

  const cardStyle =
    "bg-white shadow-md rounded-xl p-5 border border-gray-100 transition hover:shadow-lg";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      
      {/* Total Insights */}
      <div className={cardStyle}>
        <p className="text-gray-600 text-sm font-medium">Total Insights</p>
        <h2 className="text-3xl font-bold text-blue-600 mt-2">
          {stats.totalInsights}
        </h2>
      </div>

      {/* Avg Intensity */}
      <div className={cardStyle}>
        <p className="text-gray-600 text-sm font-medium">Avg Intensity</p>
        <h2 className="text-3xl font-bold text-purple-600 mt-2">
          {stats.avgIntensity}
        </h2>
      </div>

      {/* Avg Likelihood */}
      <div className={cardStyle}>
        <p className="text-gray-600 text-sm font-medium">Avg Likelihood</p>
        <h2 className="text-3xl font-bold text-green-600 mt-2">
          {stats.avgLikelihood}
        </h2>
      </div>

      {/* Total Countries */}
      <div className={cardStyle}>
        <p className="text-gray-600 text-sm font-medium">Total Countries</p>
        <h2 className="text-3xl font-bold text-orange-600 mt-2">
          {stats.totalCountries}
        </h2>
      </div>

    </div>
  );
}
