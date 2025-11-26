"use client";

import React, { useMemo } from "react";
import { useAppSelector } from "../redux/hook/hook";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

const AvgRelevanceByRegionChart: React.FC = () => {
  const insights = useAppSelector((state) => state.insights.data);

  const chartData = useMemo(() => {
    const regionData: Record<string, { sum: number; count: number }> = {};

    insights.forEach((item: any) => {
      if (item.region && item.relevance) {
        if (!regionData[item.region]) {
          regionData[item.region] = { sum: 0, count: 0 };
        }
        regionData[item.region].sum += item.relevance;
        regionData[item.region].count += 1;
      }
    });

    const regions = Object.keys(regionData);
    const avgRelevance = regions.map(
      (r) => regionData[r].sum / regionData[r].count
    );

    return {
      labels: regions,
      datasets: [
        {
          label: "Average Relevance",
          data: avgRelevance,
          backgroundColor: "rgba(255, 159, 64, 0.7)",
        },
      ],
    };
  }, [insights]);

  const options = {
    responsive: true,
    indexAxis: "y" as const, // Horizontal bars
    plugins: {
      title: {
        display: true,
        text: "Average Relevance by Region",
        font: { size: 18 },
      },
      legend: { display: false },
    },
    scales: {
      x: { beginAtZero: true },
      y: { ticks: { autoSkip: false } },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default AvgRelevanceByRegionChart;
