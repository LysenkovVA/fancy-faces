import { GlobalStateSchema } from "@/app/lib/store";
import { initiatorAdapter } from "../adapter/initiatorAdapter";

// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
const getInitialState = initiatorAdapter.getInitialState();

export const getInitiatorsSimpleList =
    initiatorAdapter.getSelectors<GlobalStateSchema>(
        (state) => state.initiatorsSimpleListSchema ?? getInitialState,
    );

export const getInitiatorsSimpleListIsLoading = (state: GlobalStateSchema) => {
    return state.initiatorsSimpleListSchema?.isLoading ?? false;
};

export const getInitiatorsSimpleListError = (state: GlobalStateSchema) => {
    return state.initiatorsSimpleListSchema?.error ?? "";
};

export const getInitiatorsSimpleListIsInitialized = (
    state: GlobalStateSchema,
) => {
    return state.initiatorsSimpleListSchema?._isInitialized ?? false;
};

export const getInitiatorsSimpleListSearch = (state: GlobalStateSchema) => {
    return state.initiatorsSimpleListSchema?.search ?? "";
};

export const getInitiatorsSimpleListFilters = (state: GlobalStateSchema) => {
    return state.initiatorsSimpleListSchema?.filters ?? undefined;
};
