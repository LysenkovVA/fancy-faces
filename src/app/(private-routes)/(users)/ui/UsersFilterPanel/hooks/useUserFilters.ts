import { useAppDispatch, useAppSelector } from "@/app/lib/store";
import {
    getUsersListFilters,
    getUsersListHasMore,
    getUsersListHighlightedSearch,
    getUsersListIsLoading,
    getUsersListSearch,
    getUsersListSkip,
    getUsersListTake,
    getUsersListTotalCount,
} from "../../../model/selectors/usersListSelectors";
import { useCallback, useMemo } from "react";
import { getUsersListThunk } from "../../../model/thunks/getUsersListThunk";
import { useDebounce } from "@/app/lib/hooks/useDebounce";
import { usersListActions } from "../../../model/slices/usersListSlice";
import { UserFilterType } from "../../../model/types/UserFilterType";

export function useUserFilters() {
    const isLoading = useAppSelector(getUsersListIsLoading);
    const take = useAppSelector(getUsersListTake);
    const skip = useAppSelector(getUsersListSkip);
    const search = useAppSelector(getUsersListSearch);
    const highlightedSearch = useAppSelector(getUsersListHighlightedSearch);
    const totalCount = useAppSelector(getUsersListTotalCount);
    const hasMore = useAppSelector(getUsersListHasMore);
    const filters = useAppSelector(getUsersListFilters);

    const dispatch = useAppDispatch();

    const fetchData = useCallback(() => {
        dispatch(getUsersListThunk({ replaceData: true }));
    }, [dispatch]);

    const debouncedFetchData = useDebounce(fetchData, 1000);

    const onChangeSearch = useCallback(
        (search: string) => {
            dispatch(usersListActions.setSearch(search));
            debouncedFetchData();
        },
        [dispatch, debouncedFetchData],
    );

    const onChangeFilters = useCallback(
        (filters?: OptionalRecord<UserFilterType, string[] | undefined>) => {
            dispatch(usersListActions.setFilters(filters));
            debouncedFetchData();
        },
        [debouncedFetchData, dispatch],
    );

    const activeFiltersCount = useMemo(() => {
        if (!filters) {
            return 0;
        }

        return 0;
    }, [filters]);

    return {
        isLoading,
        take,
        skip,
        search,
        highlightedSearch,
        totalCount,
        hasMore,
        onChangeSearch,
        filters,
        onChangeFilters,
        activeFiltersCount,
    };
}
