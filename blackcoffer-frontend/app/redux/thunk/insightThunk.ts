
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Filters } from "../slice/insights.slice";
export const fetchInsights = createAsyncThunk(
    "insights/fetchInsights",
    async (filters: Filters) => {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== "") {
                params.append(key, String(value));
            }
        });

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/insights?${params.toString()}`);
        return await res.json();
    }
);
export const fetchFiltersList = createAsyncThunk(
    "insights/fetchFiltersList",
    async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/insights/filters`);
        return res.json();
    }
);

