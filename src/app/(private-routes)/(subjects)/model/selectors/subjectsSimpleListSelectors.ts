import { GlobalStateSchema } from "@/app/lib/store";
import { subjectAdapter } from "../adapter/subjectAdapter";

// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
const getInitialState = subjectAdapter.getInitialState();

export const getSubjectsSimpleList =
    subjectAdapter.getSelectors<GlobalStateSchema>(
        (state) => state.subjectsSimpleListSchema ?? getInitialState,
    );

export const getSubjectsSimpleListIsLoading = (state: GlobalStateSchema) => {
    return state.subjectsSimpleListSchema?.isLoading ?? false;
};

export const getSubjectsSimpleListError = (state: GlobalStateSchema) => {
    return state.subjectsSimpleListSchema?.error ?? "";
};

export const getSubjectsSimpleListIsInitialized = (
    state: GlobalStateSchema,
) => {
    return state.subjectsSimpleListSchema?._isInitialized ?? false;
};

export const getSubjectsSimpleListSearch = (state: GlobalStateSchema) => {
    return state.subjectsSimpleListSchema?.search ?? "";
};

export const getSubjectsSimpleListFilters = (state: GlobalStateSchema) => {
    return state.subjectsSimpleListSchema?.filters ?? undefined;
};
