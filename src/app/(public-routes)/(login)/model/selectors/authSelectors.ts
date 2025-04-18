import { GlobalStateSchema } from "@/app/lib/store";

export const getAuthUser = (state: GlobalStateSchema) => {
    return state.authSchema?.entityData ?? undefined;
};

export const getUserAuthIsLoading = (state: GlobalStateSchema) => {
    return state.authSchema?.isFetching ?? undefined;
};

export const getUserAuthDataError = (state: GlobalStateSchema) => {
    return state.authSchema?.error ?? undefined;
};

export const getUserAuthDataIsInitialized = (state: GlobalStateSchema) => {
    return state.authSchema?._isInitialized ?? false;
};
