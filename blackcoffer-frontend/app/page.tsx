"use client"

import { useEffect, useState } from "react";
import KpiCards from "./components/KpiCards";
import FiltersPanel from "./components/FiltersPanel";
import IntensityBySectorBar from "./components/IntensityBySectorBar";
import BubbleChart from "./components/LikelihoodByRegionBar";
import GroupedBarChart from "./components/Relevence";

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
      <div className="pl-6 pr-6  " >
        <h1 className="text-2xl font-bold text-black text-center">Insights Dashboard</h1>
        <KpiCards />
        {/* <FiltersPanel filters={data}/> */}
         <div style={{marginTop:"30px"}}><IntensityBySectorBar/></div>
        <BubbleChart/>
       <GroupedBarChart/>
      </div>
    </>
  );
}
