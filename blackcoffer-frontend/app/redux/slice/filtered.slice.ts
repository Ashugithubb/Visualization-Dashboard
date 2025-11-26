import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchInsights, fetchFiltersList } from "../thunk/insightThunk";

interface FiltersState {
    end_year?: string;
    topic?: string;
    sector?: string;
    region?: string;
    pestle?: string;
    source?: string;
    swot?: string;
    country?: string;
    city?: string;

    [key: string]: string | undefined;
}

interface FiltersListState {
    end_years: string[];
    topics: string[];
    sectors: string[];
    regions: string[];
    pestles: string[];
    sources: string[];
    swots: string[];
    countries: string[];
    cities: string[];
}

interface InsightState {
    loading: boolean;
    insights: any[];
    filters: FiltersState;
    filtersList: FiltersListState;
}

const initialState: InsightState = {
    loading: false,
    insights: [],
    filters: {},

    filtersList: {
        end_years: [],
        topics: [],
        sectors: [],
        regions: [],
        pestles: [],
        sources: [],
        swots: [],
        countries: [],
        cities: [],
    },
};

const insightSlice = createSlice({
    name: "insights",
    initialState,
    reducers: {
        setFilter: (
            state,
            action: PayloadAction<{ key: string; value: string }>
        ) => {
            state.filters[action.payload.key] = action.payload.value;

            // remove empty filter
            if (!action.payload.value) {
                delete state.filters[action.payload.key];
            }
        },

        clearFilters: (state) => {
            state.filters = {};
        },
    },

    extraReducers: (builder) => {
        // Fetch Insights
        builder.addCase(fetchInsights.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchInsights.fulfilled, (state, action) => {
            state.loading = false;
            state.insights = action.payload;
        });
        builder.addCase(fetchInsights.rejected, (state) => {
            state.loading = false;
        });

        // Fetch Filters List
        builder.addCase(fetchFiltersList.fulfilled, (state, action) => {
            state.filtersList = action.payload;
        });
    },
});

export const { setFilter, clearFilters } = insightSlice.actions;
export default insightSlice.reducer;
