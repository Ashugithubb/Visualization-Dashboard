"use client";

import React, { useMemo } from "react";
import { useAppSelector } from "../redux/hook/hook";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LikelihoodBySectorChart: React.FC = () => {
  const insights = useAppSelector((state) => state.insights.data);

  const chartData = useMemo(() => {
    const sectorData: Record<string, { total: number; count: number }> = {};

    insights.forEach((item: any) => {
      const { sector, likelihood } = item;
      if (sector && likelihood !== undefined) {
        if (!sectorData[sector]) sectorData[sector] = { total: 0, count: 0 };
        sectorData[sector].total += likelihood;
        sectorData[sector].count += 1;
      }
    });

    const sectors = Object.keys(sectorData);
    const avgLikelihood = sectors.map(
      (s) => sectorData[s].total / sectorData[s].count
    );

    return {
      labels: sectors,
      datasets: [
        {
          label: "Average Likelihood",
          data: avgLikelihood,
          backgroundColor: "rgba(54, 162, 235, 0.7)",
        },
      ],
    };
  }, [insights]);

  const options = {
    indexAxis: "y" as const, // horizontal bars
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Average Likelihood by Sector",
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `Sector: ${context.label}, Likelihood: ${context.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: { beginAtZero: true, title: { display: true, text: "Average Likelihood" } },
      y: { title: { display: true, text: "Sector" } },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default LikelihoodBySectorChart;
