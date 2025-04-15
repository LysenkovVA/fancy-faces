import { GlobalStateSchema } from "@/app/lib/store";
import { antropologicalTypeAdapter } from "../adapter/antropologicalTypeAdapter";

// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
const getInitialState = antropologicalTypeAdapter.getInitialState();

export const getAntropologicalTypesSimpleList =
    antropologicalTypeAdapter.getSelectors<GlobalStateSchema>(
        (state) => state.antropologicalTypesSimpleListSchema ?? getInitialState,
    );

export const getAntropologicalTypesSimpleListIsLoading = (
    state: GlobalStateSchema,
) => {
    return state.antropologicalTypesSimpleListSchema?.isLoading ?? false;
};

export const getAntropologicalTypesSimpleListError = (
    state: GlobalStateSchema,
) => {
    return state.antropologicalTypesSimpleListSchema?.error ?? "";
};

export const getAntropologicalTypesSimpleListIsInitialized = (
    state: GlobalStateSchema,
) => {
    return state.antropologicalTypesSimpleListSchema?._isInitialized ?? false;
};
