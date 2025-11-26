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

const IntensityByRegionChart: React.FC = () => {
  const insights = useAppSelector((state) => state.insights.data);

  // Transform data for Average Intensity by Region
  const chartData = useMemo(() => {
    const regionData: Record<string, { sum: number; count: number }> = {};

    insights.forEach((item: any) => {
      if (item.region && item.intensity) {
        if (!regionData[item.region]) {
          regionData[item.region] = { sum: 0, count: 0 };
        }
        regionData[item.region].sum += item.intensity;
        regionData[item.region].count += 1;
      }
    });

    const regions = Object.keys(regionData);
    const avgIntensity = regions.map(
      (region) => regionData[region].sum / regionData[region].count
    );

    return {
      labels: regions,
      datasets: [
        {
          label: "Avg Intensity by Region",
          data: avgIntensity,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  }, [insights]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Average Intensity by Region",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default IntensityByRegionChart;
