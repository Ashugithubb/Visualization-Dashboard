"use client"

import { useEffect, useState } from "react";
import KpiCards from "./components/KpiCards";
import FiltersPanel from "./components/FiltersPanel";
import IntensityBySectorBar from "./components/IntensityBySectorBar";
import BubbleChart from "./components/LikelihoodByRegionBar";
import GroupedBarChart from "./components/Relevence";
import IntensityByRegionChart from "./components/IntensityByRegionChart";
import { useAppDispatch } from "./redux/hook/hook";
import { fetchFiltersList } from "./redux/thunk/insightThunk";
import LikelihoodTrendChart from "./components/LikelihoodTrendChart";
import TopicDistributionChart from "./components/TopicDistributionChart";
import AvgRelevanceByRegionChart from "./components/TopicDistributionChart";
import SectorDistributionChart from "./components/doughtNutChart";
import AvgIntensityBySectorChart from "./components/IntensityBySectorBar";
import Top10TopicsByRelevanceChart from "./components/Top10TopicsByRelevanceChart";
import LikelihoodBySectorTopicChart from "./components/LikelihoodBySectorYearChart";
import AvgIntensityByCountryChart from "./components/AvgIntensityByCountryChart";
import CountryBubbleChart from "./components/CountryBubbleChart";

export default function Home() {
  const dispatch = useAppDispatch();


  return (
    <>
      <div className="pl-6 pr-6  " >
        <h1 className="text-2xl font-bold text-black text-center">Insights Dashboard</h1>
        <FiltersPanel />
        <KpiCards />

        <div className="p-4">
          <SectorDistributionChart />
          <div className="mb-8">
            <IntensityByRegionChart />
          </div>
          <div className="mb-8">
            <AvgIntensityBySectorChart />
          </div>
          <div className="mb-8">
            <LikelihoodBySectorTopicChart /></div>
          <div className="mb-8">
            <LikelihoodTrendChart />
          </div>
          <AvgRelevanceByRegionChart />
          <div className="p-4">
            <Top10TopicsByRelevanceChart />
          </div>
<AvgIntensityByCountryChart/>
<CountryBubbleChart/>
        </div>


        {/* bcakend api */}
        {/* <div style={{ marginTop: "30px" }}><IntensityBySectorBar /></div>
        <BubbleChart />
        <GroupedBarChart /> */}
      </div>
    </>
  );
}
