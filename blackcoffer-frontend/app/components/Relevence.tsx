"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Define your data type
type RegionData = {
  _id: string;
  totalRelevance: number;
  count: number;
};

const GroupedBarChart: React.FC = () => {
  const [data, setData] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/insights/agg/relevance-by-region"); // Change to your API URL
        const jsonData: RegionData[] = await res.json();
        setData(jsonData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p>Loading chart...</p>;

  // Prepare chart.js data
  const chartData = {
    labels: data.map((d) => d._id),
    datasets: [
      {
        label: "Total Relevance",
        data: data.map((d) => d.totalRelevance),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Count",
        data: data.map((d) => d.count),
        backgroundColor: "rgba(153, 102, 255, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: { enabled: true },
    },
    scales: {
      x: { stacked: false },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-center text-xl font-semibold mb-4">
        Region Total Relevance and Count
      </h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default GroupedBarChart;
