"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

interface Insight {
  sector: string;
  intensity: number;
}

export default function IntensityBySectorBar() {
  const ref = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<Insight[]>([]);

  // Fetch API
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("http://localhost:5000/api/insights/agg/intensity-by-sector");
        const json = await res.json();

        // Convert backend structure to chart-friendly structure
        const cleaned: Insight[] = json.map((d: any) => ({
          sector: d._id || "Unknown",
          intensity: Number(d.avgIntensity) || 0,
        }));

        setData(cleaned);
      } catch (err) {
        console.error("Failed to fetch intensity-by-sector:", err);
      }
    }
    loadData();
  }, []);

  // Render chart
  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    const width = 550;
    const height = 350;
    const margin = { top: 20, right: 20, bottom: 60, left: 8 };

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.sector))
      .range([margin.left, width - margin.right])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.intensity) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Bars
    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.sector)!)
      .attr("y", (d) => y(d.intensity))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - margin.bottom - y(d.intensity))
      .attr("fill", "#4F46E5");

    // X Axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-35)")
      .style("text-anchor", "end")
      .style("font-size", "12px");


    // Y Axis
    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y));
  }, [data]);

  return (
    <div className="bg-white shadow p-4 rounded">
      <h3 className="text-lg font-bold mb-3 text-black">Intensity by Sector (Avg)</h3>
      <svg ref={ref} width={570} height={400}></svg>
    </div>
  );
}
