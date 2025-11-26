"use client";

import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../redux/hook/hook";
import { setFilter, setFilters } from "../redux/slice/insights.slice";
import { fetchFiltersList, fetchInsights } from "../redux/thunk/insightThunk";
import { useEffect } from "react";

import React, { useState } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';


const Dropdown = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string | undefined;
  onChange: (value: string) => void;
  options: string[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value || "All"}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-20 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              <div
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors ${!value ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                  }`}
              >
                All
              </div>
              {options.map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    onChange(item);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2.5 cursor-pointer hover:bg-blue-50 transition-colors ${value === item ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
                    }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function Filters() {

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.insights.filters);
  useEffect(() => {
    dispatch(fetchFiltersList());
    dispatch(fetchInsights({}));
  }, [])
  const lists = useAppSelector((state) => state.filterList.filtersList);

  const handleChange = (key: string, value: string) => {
    dispatch(setFilter({ key, value }));
    dispatch(fetchInsights({ ...filters, [key]: value }));
  };
  const clearAllFilters = () => {
    setFilters({
      end_year: "",
      topic: "",
      sector: "",
      region: "",
      pestle: "",
      source: "",
      swot: "",
      country: "",
      city: "",
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-900">Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[150px]">
          <Dropdown
            label="End Year"
            value={filters.end_year}
            onChange={(v) => handleChange("end_year", v)}
            options={lists.end_years || []}

          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <Dropdown
            label="Topics"
            value={filters.topic}
            onChange={(v) => handleChange("topic", v)}
            options={lists.topics || []}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <Dropdown
            label="Sector"
            value={filters.sector}
            onChange={(v) => handleChange("sector", v)}
            options={lists.sectors || []}
          /></div>
        <div className="flex-1 min-w-[150px]">
          <Dropdown
            label="Region"
            value={filters.region}
            onChange={(v) => handleChange("region", v)}
            options={lists.regions || []}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <Dropdown
            label="PEST"
            value={filters.pestle}
            onChange={(v) => handleChange("pestle", v)}
            options={lists.pestles || []}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <Dropdown
            label="Source"
            value={filters.source}
            onChange={(v) => handleChange("source", v)}
            options={lists.sources || []}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <Dropdown
            label="SWOT"
            value={filters.swot}
            onChange={(v) => handleChange("swot", v)}
            options={lists.swots || []}
          /></div>

        <div className="flex-1 min-w-[150px]">
          <Dropdown
            label="Country"
            value={filters.country}
            onChange={(v) => handleChange("country", v)}
            options={lists.countries || []}
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <Dropdown
            label="City"
            value={filters.city}
            onChange={(v) => handleChange("city", v)}
            options={lists.cities || []}
          />
        </div>
      </div>

    </>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
      >
        <Filter className="w-5 h-5" />
        {activeFiltersCount > 0 && (
          <span className="bg-white text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200 p-6 h-screen overflow-y-auto sticky top-0">
        <Filter />
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 right-0 w-full sm:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <div className="p-6">
              <button
                onClick={() => setIsMobileOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
              <Filter />
            </div>
          </div>
        </>
      )}
    </>
  );
}
