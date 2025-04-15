import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FilterPanelSchema } from "../types/FilterPanelSchema";

const initialState: FilterPanelSchema = {
    isCollapsed: {},
};

export const filterPanelSlice = createSlice({
    name: "filterPanelSlice",
    initialState,
    reducers: {
        setCollapsed: (
            state,
            { payload }: PayloadAction<{ path: string; collapsed: boolean }>,
        ) => {
            state.isCollapsed[payload.path] = payload.collapsed;
        },
    },
});

export const { actions: FilterPanelActions } = filterPanelSlice;
export const { reducer: FilterPanelReducer } = filterPanelSlice;
