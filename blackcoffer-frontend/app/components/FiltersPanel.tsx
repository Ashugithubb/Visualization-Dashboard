"use client";

import React from "react";
import Select, { SingleValue } from "react-select";

export interface Option {
  label: string;
  value: string;
}

export interface FilterOptions {
  regions: Option[];
  sectors: Option[];
  topics: Option[];
  years: Option[];
  sources?: Option[];  // optional
  pestles: Option[];
}

export interface Filters {
  region: string;
  sector: string;
  topic: string;
  year: string;
  pestle: string;
}

interface FiltersPanelProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  options: FilterOptions;
}

export default function FiltersPanel({
  filters,
  setFilters,
  options,
}: FiltersPanelProps) {

  const handleSelectChange = (
    key: keyof Filters,
    value: SingleValue<Option>
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value ? value.value : "",
    }));
  };

  return (
    <div className="p-4 bg-white rounded shadow space-y-3">
      <h3 className="font-semibold">Filters</h3>

      <Select
        isClearable
        options={options.regions}
        placeholder="Region"
        onChange={(v) => handleSelectChange("region", v)}
      />

      <Select
        isClearable
        options={options.sectors}
        placeholder="Sector"
        onChange={(v) => handleSelectChange("sector", v)}
      />

      <Select
        isClearable
        options={options.topics}
        placeholder="Topic"
        onChange={(v) => handleSelectChange("topic", v)}
      />

      <Select
        isClearable
        options={options.years}
        placeholder="Year"
        onChange={(v) => handleSelectChange("year", v)}
      />

      <Select
        isClearable
        options={options.pestles}
        placeholder="PESTLE"
        onChange={(v) => handleSelectChange("pestle", v)}
      />
    </div>
  );
}
