import { GlobalStateSchema } from "@/app/lib/store";
import { createSelector } from "@reduxjs/toolkit";

const getSubgroupDetails = (state: GlobalStateSchema) => {
    return state.subgroupDetailsSchema?.details ?? undefined;
};

export const getSubgroupDetailsData = createSelector(
    getSubgroupDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.entityData ?? undefined,
);

export const getSubgroupDetailsFormData = createSelector(
    getSubgroupDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.entityFormData ?? undefined,
);

export const getSubgroupDetailsIsFetching = createSelector(
    getSubgroupDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.isFetching ?? false,
);

export const getSubgroupDetailsIsSaving = createSelector(
    getSubgroupDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.isSaving ?? false,
);

export const getSubgroupDetailsError = createSelector(
    getSubgroupDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.error ?? undefined,
);

export const getSubgroupDetailsIsInitialized = createSelector(
    getSubgroupDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?._isInitialized ?? false,
);
