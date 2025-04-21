import { userAdapter } from "../adapter/userAdapter";
import { GlobalStateSchema } from "@/app/lib/store";

// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
const getInitialState = userAdapter.getInitialState();

export const getUsersList = userAdapter.getSelectors<GlobalStateSchema>(
    (state) => state.usersListSchema ?? getInitialState,
);

export const getUsersListIsLoading = (state: GlobalStateSchema) => {
    return state.usersListSchema?.isLoading ?? false;
};

export const getUsersListError = (state: GlobalStateSchema) => {
    return state.usersListSchema?.error ?? "";
};

export const getUsersListIsInitialized = (state: GlobalStateSchema) => {
    return state.usersListSchema?._isInitialized ?? false;
};

export const getUsersListTake = (state: GlobalStateSchema) => {
    return state.usersListSchema?.take ?? 10;
};

export const getUsersListSkip = (state: GlobalStateSchema) => {
    return state.usersListSchema?.skip ?? 0;
};

export const getUsersListSearch = (state: GlobalStateSchema) => {
    return state.usersListSchema?.search ?? "";
};

export const getUsersListTotalCount = (state: GlobalStateSchema) => {
    return state.usersListSchema?.totalCount ?? 0;
};

export const getUsersListHasMore = (state: GlobalStateSchema) => {
    return state.usersListSchema?.hasMore ?? true;
};

export const getUsersListFilters = (state: GlobalStateSchema) => {
    return state.usersListSchema?.filters ?? undefined;
};
