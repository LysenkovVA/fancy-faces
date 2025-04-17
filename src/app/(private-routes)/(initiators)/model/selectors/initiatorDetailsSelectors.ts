import { GlobalStateSchema } from "@/app/lib/store";
import { createSelector } from "@reduxjs/toolkit";

const getInitiatorDetails = (state: GlobalStateSchema) => {
    return state.initiatorDetailsSchema?.details ?? undefined;
};

export const getInitiatorDetailsData = createSelector(
    getInitiatorDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.entityData ?? undefined,
);

export const getInitiatorDetailsFormData = createSelector(
    getInitiatorDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.entityFormData ?? undefined,
);

export const getInitiatorDetailsIsFetching = createSelector(
    getInitiatorDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.isFetching ?? false,
);

export const getInitiatorDetailsIsSaving = createSelector(
    getInitiatorDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.isSaving ?? false,
);

export const getInitiatorDetailsError = createSelector(
    getInitiatorDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.error ?? undefined,
);

export const getInitiatorDetailsIsInitialized = createSelector(
    getInitiatorDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?._isInitialized ?? false,
);
