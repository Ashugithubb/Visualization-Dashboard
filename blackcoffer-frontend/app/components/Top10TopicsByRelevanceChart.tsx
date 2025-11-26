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

const Top10TopicsByRelevanceChart: React.FC = () => {
  const insights = useAppSelector((state) => state.insights.data);

  // Prepare data
  const chartData = useMemo(() => {
    const relevanceByTopic: Record<string, { total: number; count: number }> = {};

    insights.forEach((item: any) => {
      if (item.topic && item.relevance !== undefined) {
        if (!relevanceByTopic[item.topic]) {
          relevanceByTopic[item.topic] = { total: 0, count: 0 };
        }
        relevanceByTopic[item.topic].total += item.relevance;
        relevanceByTopic[item.topic].count += 1;
      }
    });

    // Calculate avg relevance
    const avgRelevance = Object.entries(relevanceByTopic)
      .map(([topic, data]) => ({
        topic,
        avg: data.total / data.count,
      }))
      .sort((a, b) => b.avg - a.avg) // highest first
      .slice(0, 10); // top 10

    return {
      labels: avgRelevance.map((t) => t.topic),
      datasets: [
        {
          label: "Avg Relevance",
          data: avgRelevance.map((t) => t.avg),
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        },
      ],
    };
  }, [insights]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Top 10 Topics by Average Relevance",
        font: { size: 18 },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default Top10TopicsByRelevanceChart;
