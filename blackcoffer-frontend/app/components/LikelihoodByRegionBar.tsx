"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  LinearScale,
  CategoryScale,
  BarElement,
} from "chart.js";

ChartJS.register(Tooltip, Legend, LinearScale, CategoryScale, BarElement);

type TopicData = {
  _id: string;
  avgLikelihood: number;
  count: number;
};

const BarChartTopic = () => {
  const [chartData, setChartData] = useState<TopicData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/insights/agg/likelihood-by-topic"
      );
      const data = await res.json();
      setChartData(data);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <p className="text-center">Loading chart...</p>;

  const labels = chartData.map((item) => item._id);
  const counts = chartData.map((item) => item.count);

  const data = {
    labels,
    datasets: [
      {
        label: "Count",
        data: counts,
        backgroundColor: (ctx: any) => {
          const chart = ctx.chart;
          const { ctx: canvas } = chart;

          const gradient = canvas.createLinearGradient(0, 0, 300, 0);
          gradient.addColorStop(0, "rgba(99, 102, 241, 0.9)");
          gradient.addColorStop(1, "rgba(79, 70, 229, 0.7)");

          return gradient;
        },
        borderRadius: 8,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const, // <-- Horizontal Bar Chart
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const topic = chartData[index];
            return `Count: ${topic.count} | Likelihood: ${topic.avgLikelihood}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Count" },
        beginAtZero: true,
      },
      y: {
        title: { display: true, text: "Topic" },
      },
    },
  };

  return (
    <div className="w-full mt-5 p-4 bg-white rounded-xl shadow border">
      <h2 className="text-xl font-semibold text-center mb-4">
        Topic Likelihood vs Count (Horizontal Bar)
      </h2>

      <div className="relative w-full h-[400px] md:h-[500px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default BarChartTopic;
