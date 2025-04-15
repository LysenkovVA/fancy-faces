import { GlobalStateSchema } from "@/app/lib/store";
import { subgroupAdapter } from "../adapter/subgroupAdapter";

// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
const getInitialState = subgroupAdapter.getInitialState();

export const getSubgroupsSimpleList =
    subgroupAdapter.getSelectors<GlobalStateSchema>(
        (state) => state.subgroupsSimpleListSchema ?? getInitialState,
    );

export const getSubgroupsSimpleListIsLoading = (state: GlobalStateSchema) => {
    return state.subgroupsSimpleListSchema?.isLoading ?? false;
};

export const getSubgroupsSimpleListError = (state: GlobalStateSchema) => {
    return state.subgroupsSimpleListSchema?.error ?? "";
};

export const getSubgroupsSimpleListIsInitialized = (
    state: GlobalStateSchema,
) => {
    return state.subgroupsSimpleListSchema?._isInitialized ?? false;
};
