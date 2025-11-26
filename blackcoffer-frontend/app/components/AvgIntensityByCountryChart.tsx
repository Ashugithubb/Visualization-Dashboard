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

const AvgIntensityByCountryChart: React.FC = () => {
  const insights = useAppSelector((state) => state.insights.data);

  const chartData = useMemo(() => {
    const countryData: Record<string, { total: number; count: number }> = {};

    insights.forEach((item: any) => {
      const { country, intensity } = item;
      if (country && intensity !== undefined) {
        if (!countryData[country]) countryData[country] = { total: 0, count: 0 };
        countryData[country].total += intensity;
        countryData[country].count += 1;
      }
    });

    const countries = Object.keys(countryData);
    const avgIntensity = countries.map(
      (c) => countryData[c].total / countryData[c].count
    );

    return {
      labels: countries,
      datasets: [
        {
          label: "Average Intensity",
          data: avgIntensity,
          backgroundColor: "rgba(255, 99, 132, 0.7)",
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
        text: "Average Intensity by Country",
        font: { size: 18 },
      },
      tooltip: {
        callbacks: {
          label: (context: any) =>
            `Country: ${context.label}, Avg Intensity: ${context.raw.toFixed(2)}`,
        },
      },
    },
    scales: {
      x: { beginAtZero: true, title: { display: true, text: "Average Intensity" } },
      y: { title: { display: true, text: "Country" } },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default AvgIntensityByCountryChart;
