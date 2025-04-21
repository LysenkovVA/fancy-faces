"use client";

import React from "react";
import { FilterPanel } from "@/app/UI/FilterPanel";
import { useUserFilters } from "./hooks/useUserFilters";
import { CONTENT_HEIGHT } from "@/app/UI/AppLayout";

export const UsersFilterPanel = () => {
    const {
        search,
        totalCount,
        onChangeSearch,
        filters,
        onChangeFilters,
        activeFiltersCount,
        isLoading,
    } = useUserFilters();

    return (
        <FilterPanel
            title={"Пользователи"}
            height={CONTENT_HEIGHT}
            searchValue={search}
            onSearchValueChanged={onChangeSearch}
            totalCount={totalCount}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={() => onChangeFilters?.({})}
            isFiltering={isLoading}
        />
    );
};
