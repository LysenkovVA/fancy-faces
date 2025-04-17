"use client";

import React from "react";
import { FilterPanel } from "@/app/UI/FilterPanel";
import { useSubjectFilters } from "./hooks/useSubjectFilters";
import { CONTENT_HEIGHT } from "@/app/UI/AppLayout";
import { GenderFilter } from "@/app/(private-routes)/(genders)/ui/GenderFilter/ui/GenderFilter";
import { AntropologicalTypeFilter } from "@/app/(private-routes)/(antropological-types)/ui/AntropologicalTypesFilter";
import { InitiatorFilter } from "@/app/(private-routes)/(initiators)/ui/InitiatorFilter";
import { SubgroupFilter } from "@/app/(private-routes)/(subgroups)/ui/SubgroupFilter";
import { ViewTypeFilter } from "@/app/(private-routes)/(view-types)/ui/ViewTypeFilter";
import { Flex } from "antd";

export const SubjectsFilterPanel = () => {
    const {
        search,
        totalCount,
        onChangeSearch,
        filters,
        onChangeFilters,
        activeFiltersCount,
        isLoading,
    } = useSubjectFilters();

    return (
        <FilterPanel
            title={"Субъекты"}
            height={CONTENT_HEIGHT}
            searchValue={search}
            onSearchValueChanged={onChangeSearch}
            totalCount={totalCount}
            activeFiltersCount={activeFiltersCount}
            onClearFilters={() => onChangeFilters?.({})}
            isFiltering={isLoading}
        >
            <Flex
                align={"start"}
                justify={"start"}
                gap={8}
                vertical
                style={{
                    width: "100%",
                    height: `calc(${CONTENT_HEIGHT} - 220px)`,
                    overflowY: "auto",
                }}
            >
                <InitiatorFilter
                    checkedIds={filters?.["initiator"] ?? undefined}
                    onChangeChecked={(values) => {
                        onChangeFilters?.({ ...filters, initiator: values });
                    }}
                />
                <AntropologicalTypeFilter
                    checkedIds={filters?.["antropological-type"] ?? undefined}
                    onChangeChecked={(values) => {
                        onChangeFilters?.({
                            ...filters,
                            "antropological-type": values,
                        });
                    }}
                />
                <SubgroupFilter
                    checkedIds={filters?.["subgroup"] ?? undefined}
                    onChangeChecked={(values) => {
                        onChangeFilters?.({
                            ...filters,
                            subgroup: values,
                        });
                    }}
                />
                <GenderFilter
                    checkedIds={filters?.["gender"] ?? undefined}
                    onChangeChecked={(values) => {
                        onChangeFilters?.({ ...filters, gender: values });
                    }}
                />
                <ViewTypeFilter
                    checkedIds={filters?.["view-type"] ?? undefined}
                    onChangeChecked={(values) => {
                        onChangeFilters?.({
                            ...filters,
                            "view-type": values,
                        });
                    }}
                />
            </Flex>
        </FilterPanel>
    );
};
