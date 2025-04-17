import { useAppDispatch, useAppSelector } from "@/app/lib/store";
import {
    getSubjectsListFilters,
    getSubjectsListHasMore,
    getSubjectsListIsLoading,
    getSubjectsListSearch,
    getSubjectsListSkip,
    getSubjectsListTake,
    getSubjectsListTotalCount,
} from "../../../model/selectors/subjectsListSelectors";
import { useCallback, useMemo } from "react";
import { getSubjectsListThunk } from "../../../model/thunks/getSubjectsListThunk";
import { useDebounce } from "@/app/lib/hooks/useDebounce";
import { subjectsListActions } from "../../../model/slices/subjectsListSlice";
import { SubjectFilterType } from "../../../model/types/SubjectFilterType";

export function useSubjectFilters() {
    const isLoading = useAppSelector(getSubjectsListIsLoading);
    const take = useAppSelector(getSubjectsListTake);
    const skip = useAppSelector(getSubjectsListSkip);
    const search = useAppSelector(getSubjectsListSearch);
    const totalCount = useAppSelector(getSubjectsListTotalCount);
    const hasMore = useAppSelector(getSubjectsListHasMore);
    const filters = useAppSelector(getSubjectsListFilters);

    const dispatch = useAppDispatch();

    const fetchData = useCallback(() => {
        console.log("Debounce fetch...");
        dispatch(getSubjectsListThunk({ replaceData: true }));
    }, [dispatch]);

    const debouncedFetchData = useDebounce(fetchData, 1000);

    const onChangeSearch = useCallback(
        (search: string) => {
            console.log("Change search");
            dispatch(subjectsListActions.setSearch(search));
            debouncedFetchData();
        },
        [dispatch, debouncedFetchData],
    );

    const onChangeFilters = useCallback(
        (filters?: OptionalRecord<SubjectFilterType, string[] | undefined>) => {
            dispatch(subjectsListActions.setFilters(filters));
            debouncedFetchData();
        },
        [debouncedFetchData, dispatch],
    );

    const activeFiltersCount = useMemo(() => {
        if (!filters) {
            return 0;
        }

        let count = 0;
        if (filters.initiator && filters.initiator?.length > 0)
            count += filters.initiator.length;
        if (filters.gender && filters.gender?.length > 0)
            count += filters.gender.length;
        if (
            filters["antropological-type"] &&
            filters["antropological-type"]?.length > 0
        )
            count += filters["antropological-type"].length;
        if (filters.subgroup && filters.subgroup?.length > 0)
            count += filters.subgroup.length;
        if (filters["view-type"] && filters["view-type"]?.length > 0)
            count += filters["view-type"].length;

        return count;
    }, [filters]);

    return {
        isLoading,
        take,
        skip,
        search,
        totalCount,
        hasMore,
        onChangeSearch,
        filters,
        onChangeFilters,
        activeFiltersCount,
    };
}
