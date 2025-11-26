"use client";

import React, { useMemo } from "react";
import { useAppSelector } from "../redux/hook/hook";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const SectorDistributionChart: React.FC = () => {
    const insights = useAppSelector((state) => state.insights.data);

    const chartData = useMemo(() => {
        const sectorCounts: Record<string, number> = {};

        insights.forEach((item: any) => {
            if (item.sector) {
                sectorCounts[item.sector] = (sectorCounts[item.sector] || 0) + 1;
            }
        });

        const sectors = Object.keys(sectorCounts);
        const counts = sectors.map((s) => sectorCounts[s]);

        return {
            labels: sectors,
            datasets: [
                {
                    label: "Sector Count",
                    data: counts,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.7)",
                        "rgba(54, 162, 235, 0.7)",
                        "rgba(255, 206, 86, 0.7)",
                        "rgba(75, 192, 192, 0.7)",
                        "rgba(153, 102, 255, 0.7)",
                        "rgba(255, 159, 64, 0.7)",
                    ],
                },
            ],
        };
    }, [insights]);

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Insights by Sector",
                font: { size: 18 },
            },
            legend: {
                position: "bottom" as const,
            },
        },
    };

    return <div className="w-[850px] h-[850px]">
        <Doughnut data={chartData} options={options} />
    </div>
        ;
};

export default SectorDistributionChart;
