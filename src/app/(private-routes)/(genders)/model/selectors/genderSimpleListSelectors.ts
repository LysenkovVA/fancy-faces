import { GlobalStateSchema } from "@/app/lib/store";
import { genderAdapter } from "../adapter/genderAdapter";

// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
const getInitialState = genderAdapter.getInitialState();

export const getGendersSimpleList =
    genderAdapter.getSelectors<GlobalStateSchema>(
        (state) => state.gendersSimpleListSchema ?? getInitialState,
    );

export const getGendersSimpleListIsLoading = (state: GlobalStateSchema) => {
    return state.gendersSimpleListSchema?.isLoading ?? false;
};

export const getGendersSimpleListError = (state: GlobalStateSchema) => {
    return state.gendersSimpleListSchema?.error ?? "";
};

export const getGendersSimpleListIsInitialized = (state: GlobalStateSchema) => {
    return state.gendersSimpleListSchema?._isInitialized ?? false;
};
