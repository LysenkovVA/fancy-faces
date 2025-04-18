import { GlobalStateSchema } from "@/app/lib/store";
import { userAdapter } from "../adapter/userAdapter";

// Для избавления от Warning: An input selector returned a different result when passed same arguments
// необходимо создать стабильную ссылку на initial state
const getInitialState = userAdapter.getInitialState();

export const getUsersSimpleList = userAdapter.getSelectors<GlobalStateSchema>(
    (state) => state.usersSimpleListSchema ?? getInitialState,
);

export const getUsersSimpleListIsLoading = (state: GlobalStateSchema) => {
    return state.usersSimpleListSchema?.isLoading ?? false;
};

export const getUsersSimpleListError = (state: GlobalStateSchema) => {
    return state.usersSimpleListSchema?.error ?? "";
};

export const getUsersSimpleListIsInitialized = (state: GlobalStateSchema) => {
    return state.usersSimpleListSchema?._isInitialized ?? false;
};
