"use client";

import React from "react";
import { FilterPanel } from "@/app/UI/FilterPanel";
import { useUserFilters } from "./hooks/useUserFilters";

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
            searchValue={search}
            onSearchValueChanged={onChangeSearch}
            totalCount={totalCount}
            activeFiltersCount={activeFiltersCount}
            // onClearFilters={() => onChangeFilters?.({})}
            isFiltering={isLoading}
        />
    );
};
