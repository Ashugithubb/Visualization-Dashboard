"use client";

import React, { useMemo } from "react";
import { useAppSelector } from "../redux/hook/hook";
import { Bubble } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale, PointElement, Tooltip, Legend } from "chart.js";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const CountryBubbleChart: React.FC = () => {
  const insights = useAppSelector((state) => state.insights.data);

  const chartData = useMemo(() => {
    const countryData: Record<string, { likelihoodTotal: number; relevanceTotal: number; count: number }> = {};

    insights.forEach((item: any) => {
      const { country, likelihood, relevance } = item;
      if (country && likelihood !== undefined && relevance !== undefined) {
        if (!countryData[country]) countryData[country] = { likelihoodTotal: 0, relevanceTotal: 0, count: 0 };
        countryData[country].likelihoodTotal += likelihood;
        countryData[country].relevanceTotal += relevance;
        countryData[country].count += 1;
      }
    });

    const dataPoints = Object.entries(countryData).map(([country, d]) => ({
      x: d.likelihoodTotal / d.count,
      y: d.relevanceTotal / d.count,
      r: Math.sqrt(d.count) * 3, // bubble size proportional to number of insights
      country,
    }));

    return {
      datasets: [
        {
          label: "Country Insights",
          data: dataPoints,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    };
  }, [insights]);

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const data = context.raw;
            return `Country: ${data.country}, Avg Likelihood: ${data.x.toFixed(2)}, Avg Relevance: ${data.y.toFixed(2)}, Insights: ${Math.round(data.r ** 2 / 9)}`;
          },
        },
      },
      title: {
        display: true,
        text: "Country Likelihood vs Relevance Bubble Chart",
        font: { size: 18 },
      },
    },
    scales: {
      x: { title: { display: true, text: "Avg Likelihood" }, beginAtZero: true },
      y: { title: { display: true, text: "Avg Relevance" }, beginAtZero: true },
    },
  };

  return <Bubble data={chartData} options={options} />;
};

export default CountryBubbleChart;
