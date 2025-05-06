import { subjectAdapter } from "../adapter/subjectAdapter";
import { GlobalStateSchema } from "@/app/lib/store";

// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
const getInitialState = subjectAdapter.getInitialState();

export const getSubjectsList = subjectAdapter.getSelectors<GlobalStateSchema>(
    (state) => state.subjectsListSchema ?? getInitialState,
);

export const getSubjectsListIsLoading = (state: GlobalStateSchema) => {
    return state.subjectsListSchema?.isLoading ?? false;
};

export const getSubjectsListError = (state: GlobalStateSchema) => {
    return state.subjectsListSchema?.error ?? "";
};

export const getSubjectsListIsInitialized = (state: GlobalStateSchema) => {
    return state.subjectsListSchema?._isInitialized ?? false;
};

export const getSubjectsListTake = (state: GlobalStateSchema) => {
    return state.subjectsListSchema?.take ?? 10;
};

export const getSubjectsListSkip = (state: GlobalStateSchema) => {
    return state.subjectsListSchema?.skip ?? 0;
};

export const getSubjectsListSearch = (state: GlobalStateSchema) => {
    return state.subjectsListSchema?.search ?? "";
};

export const getSubjectsListHighlightedSearch = (state: GlobalStateSchema) => {
    return state.subjectsListSchema?.highlightedSearch ?? "";
};

export const getSubjectsListTotalCount = (state: GlobalStateSchema) => {
    return state.subjectsListSchema?.totalCount ?? 0;
};

export const getSubjectsListHasMore = (state: GlobalStateSchema) => {
    return state.subjectsListSchema?.hasMore ?? true;
};

export const getSubjectsListFilters = (state: GlobalStateSchema) => {
    return state.subjectsListSchema?.filters ?? undefined;
};
