"use client"

import { useEffect, useState } from "react";
import KpiCards from "./components/KpiCards";
import FiltersPanel from "./components/FiltersPanel";
import IntensityBySectorBar from "./components/IntensityBySectorBar";

export default function Home() {
    const [stats,setStats] = useState();
    useEffect(() => {
    async function loadStats() {
      const res = await fetch("http://localhost:5000/api/insights");
      const data = await res.json();
      setStats(data);
    }
    loadStats();
  }, []);

  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold color-black">Insights Dashboard</h1>
        <KpiCards />
        {/* <FiltersPanel filters={data}/> */}
        <div style={{marginTop:"40px"}}><IntensityBySectorBar/></div>
      </div>
    </>
  );
}
