"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface RegionAgg {
  _id: string;              // region name from backend
  avgLikelihood: number;    // aggregated avg likelihood
  count?: number;
}

interface Props {
  filters?: Record<string, string | number | undefined>; // optional filters passed from parent
  width?: number;
  height?: number;
}

export default function LikelihoodByRegionBar({
  filters = {},
  width = 700,
  height = 420,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [data, setData] = useState<RegionAgg[]>([]);
  const margin = { top: 20, right: 20, bottom: 60, left: 180 };

  // fetch aggregated data from backend
  useEffect(() => {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== "") query.append(k, String(v));
    });

    const url = `/api/insights/agg/likelihood-by-region${query.toString() ? `?${query}` : ""}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        return res.json();
      })
      .then((resp: Array<{ _id: string; avgLikelihood: number; count?: number }>) => {
        // normalize/convert types just in case
        const normalized: RegionAgg[] = resp.map((r) => ({
          _id: r._id || "Unknown",
          avgLikelihood: Number(r.avgLikelihood) || 0,
          count: r.count ?? 0,
        }));
        // sort by avgLikelihood descending
        normalized.sort((a, b) => b.avgLikelihood - a.avgLikelihood);
        setData(normalized);
      })
      .catch((err) => {
        console.error("Error loading likelihood-by-region:", err);
        setData([]);
      });
  }, [JSON.stringify(filters)]); // refetch when filters change

  // render with D3
  useEffect(() => {
    if (!data || data.length === 0) {
      // clear svg if no data
      const svgClear = d3.select(svgRef.current);
      svgClear.selectAll("*").remove();
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous drawings

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // create scales
    const y = d3
      .scaleBand<string>()
      .domain(data.map((d) => d._id))
      .range([0, innerHeight])
      .padding(0.2);

    const xMax = d3.max(data, (d) => d.avgLikelihood) ?? 0;
    const x = d3.scaleLinear().domain([0, xMax]).range([0, innerWidth]).nice();

    // create container
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // x axis
    const xAxis = d3.axisBottom(x).ticks(6);
    g.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis)
      .call((gAxis) => gAxis.selectAll("text").attr("font-size", "12px"));

    // y axis
    const yAxis = d3.axisLeft(y);
    g.append("g")
      .call(yAxis)
      .call((gAxis) => gAxis.selectAll("text").attr("font-size", "12px"));

    // grid lines (vertical)
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(6)
          .tickSize(-innerHeight)
          .tickFormat(() => "")
      )
      .attr("opacity", 0.08);

    // bars
    const bars = g
      .selectAll("rect.bar")
      .data(data, (d: any) => d._id)
      .join("rect")
      .attr("class", "bar")
      .attr("y", (d) => y(d._id)!)
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("width", (d) => x(d.avgLikelihood))
      .attr("fill", "#ef4444")
      .on("mouseenter", function (event, d) {
        // highlight
        d3.select(this).attr("fill", "#dc2626");
        // tooltip
        const [mx, my] = d3.pointer(event, svg.node());
        const tooltip = d3.select("#likelihood-tooltip");
        tooltip
          .style("left", `${mx + 10}px`)
          .style("top", `${my + 10}px`)
          .style("display", "block")
          .html(`<strong>${d._id}</strong><br/>Avg Likelihood: ${d.avgLikelihood.toFixed(2)}<br/>Count: ${d.count}`);
      })
      .on("mouseleave", function () {
        d3.select(this).attr("fill", "#ef4444");
        d3.select("#likelihood-tooltip").style("display", "none");
      });

    // value labels at end of bars
    g.selectAll("text.value")
      .data(data)
      .join("text")
      .attr("class", "value")
      .attr("x", (d) => x(d.avgLikelihood) + 6)
      .attr("y", (d) => (y(d._id) ?? 0) + y.bandwidth() / 2 + 4)
      .text((d) => d.avgLikelihood.toFixed(2))
      .attr("font-size", 12)
      .attr("fill", "#111");

    // responsive: if many regions, limit visible bands (optional)
    // (you can add scrolling in container via CSS)

    // cleanup on unmount
    return () => {
      svg.selectAll("*").remove();
    };
  }, [data, width, height]);

  return (
    <div className="bg-white rounded shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Avg Likelihood by Region</h3>

      {data.length === 0 ? (
        <div className="text-gray-500">No data available for selected filters.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <svg ref={svgRef} style={{ display: "block" }} />
        </div>
      )}

      {/* tooltip container (absolute positioned) */}
      <div
        id="likelihood-tooltip"
        style={{
          position: "absolute",
          display: "none",
          pointerEvents: "none",
          background: "rgba(0,0,0,0.75)",
          color: "white",
          padding: "6px 8px",
          borderRadius: 6,
          fontSize: 12,
          zIndex: 9999,
        }}
      />
    </div>
  );
}
