import { GlobalStateSchema } from "@/app/lib/store";
import { viewTypeAdapter } from "../adapter/viewTypeAdapter";

// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
const getInitialState = viewTypeAdapter.getInitialState();

export const getViewTypesSimpleList =
    viewTypeAdapter.getSelectors<GlobalStateSchema>(
        (state) => state.viewTypesSimpleListSchema ?? getInitialState,
    );

export const getViewTypesSimpleListIsLoading = (state: GlobalStateSchema) => {
    return state.viewTypesSimpleListSchema?.isLoading ?? false;
};

export const getViewTypesSimpleListError = (state: GlobalStateSchema) => {
    return state.viewTypesSimpleListSchema?.error ?? "";
};

export const getViewTypesSimpleListIsInitialized = (
    state: GlobalStateSchema,
) => {
    return state.viewTypesSimpleListSchema?._isInitialized ?? false;
};
