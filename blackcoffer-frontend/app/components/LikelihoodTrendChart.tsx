"use client";

import React, { useMemo } from "react";
import { useAppSelector } from "../redux/hook/hook";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LikelihoodTrendChart: React.FC = () => {
  const insights = useAppSelector((state) => state.insights.data);

  const chartData = useMemo(() => {
    const yearSum: Record<string, number> = {};
    const yearCount: Record<string, number> = {};

    insights.forEach((item: any) => {
      if (item.end_year && !isNaN(Number(item.end_year))) {
        yearSum[item.end_year] = (yearSum[item.end_year] || 0) + item.likelihood;
        yearCount[item.end_year] = (yearCount[item.end_year] || 0) + 1;
      }
    });

    // Avg likelihood per year
    const yearAvg: Record<string, number> = {};
    Object.keys(yearSum).forEach((year) => {
      yearAvg[year] = yearSum[year] / yearCount[year];
    });

    const sortedYears = Object.keys(yearAvg).sort((a, b) => Number(a) - Number(b));

    return {
      labels: sortedYears,
      datasets: [
        {
          label: "Avg Likelihood Over Years",
          data: sortedYears.map((year) => yearAvg[year]),
          borderColor: "rgba(54, 162, 235, 0.9)",
          backgroundColor: "rgba(54, 162, 235, 0.4)",
          tension: 0.3,
          borderWidth: 2,
        },
      ],
    };
  }, [insights]);

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Likelihood Trend by Year",
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default LikelihoodTrendChart;
