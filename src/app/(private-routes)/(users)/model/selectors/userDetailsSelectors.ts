import { GlobalStateSchema } from "@/app/lib/store";
import { createSelector } from "@reduxjs/toolkit";

const getUserDetails = (state: GlobalStateSchema) => {
    return state.userDetailsSchema?.details ?? undefined;
};

export const getUserDetailsData = createSelector(
    getUserDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.entityData ?? undefined,
);

export const getUserDetailsFormData = createSelector(
    getUserDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.entityFormData ?? undefined,
);

export const getUserDetailsIsFetching = createSelector(
    getUserDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.isFetching ?? false,
);

export const getUserDetailsIsSaving = createSelector(
    getUserDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.isSaving ?? false,
);

export const getUserDetailsError = createSelector(
    getUserDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.error ?? undefined,
);

export const getUserDetailsIsInitialized = createSelector(
    getUserDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?._isInitialized ?? false,
);
