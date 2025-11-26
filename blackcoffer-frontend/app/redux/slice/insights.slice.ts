import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchInsights } from "../thunk/insightThunk";

export interface Insight {
  intensity: number;
  likelihood: number;
  relevance: number;
  end_year: string;
  topic: string;
  sector: string;
  region: string;
  pestle: string;
  source: string;
  swot: string;
  country: string;
  city: string;
}

export interface Filters {
  end_year?: string;
  topic?: string;
  sector?: string;
  region?: string;
  pestle?: string;
  source?: string;
  swot?: string;
  country?: string;
  city?: string;

  // Optional numeric filters
  likelihood_min?: number;
  intensity_min?: number;
  relevance_min?: number;
}

interface InsightsState {
  data: Insight[];
  loading: boolean;
  error: string | null;
  filters: Filters;
}

const initialState: InsightsState = {
  data: [],
  loading: false,
  error: null,
  filters: {},
};



const insightsSlice = createSlice({
  name: "insights",
  initialState,
  reducers: {
    // Update one filter
    setFilter(state, action: PayloadAction<{ key: keyof Filters; value: any }>) {
      state.filters[action.payload.key] = action.payload.value;
    },
    // Update all filters at once
    setFilters(state, action: PayloadAction<Filters>) {
      state.filters = action.payload;
    },
    // Reset filters
    resetFilters(state) {
      state.filters = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsights.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error fetching insights";
      });
  },
});

export const { setFilter, setFilters, resetFilters } = insightsSlice.actions;

export default insightsSlice.reducer;
