import { GlobalStateSchema } from "@/app/lib/store";
import { createSelector } from "@reduxjs/toolkit";

const getAntropologicalTypeDetails = (state: GlobalStateSchema) => {
    return state.antropologicalTypeDetailsSchema?.details ?? undefined;
};

export const getAntropologicalTypeDetailsData = createSelector(
    getAntropologicalTypeDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.entityData ?? undefined,
);

export const getAntropologicalTypeDetailsFormData = createSelector(
    getAntropologicalTypeDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.entityFormData ?? undefined,
);

export const getAntropologicalTypeDetailsIsFetching = createSelector(
    getAntropologicalTypeDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.isFetching ?? false,
);

export const getAntropologicalTypeDetailsIsSaving = createSelector(
    getAntropologicalTypeDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.isSaving ?? false,
);

export const getAntropologicalTypeDetailsError = createSelector(
    getAntropologicalTypeDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.error ?? undefined,
);

export const getAntropologicalTypeDetailsIsInitialized = createSelector(
    getAntropologicalTypeDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?._isInitialized ?? false,
);
