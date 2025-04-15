import { createSelector } from "@reduxjs/toolkit";
import { GlobalStateSchema } from "@/app/lib/store";

export const getFilterPanelCollapsed = (state: GlobalStateSchema) =>
    state.filterPanelSchema?.isCollapsed;
export const getFilterPanelCollapsedByPath = createSelector(
    getFilterPanelCollapsed,
    (state: GlobalStateSchema, path: string) => path,
    (filterPanel, path) => filterPanel?.[path] ?? true,
);
