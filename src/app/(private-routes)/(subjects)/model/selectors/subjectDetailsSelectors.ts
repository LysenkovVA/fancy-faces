import { GlobalStateSchema } from "@/app/lib/store";
import { createSelector } from "@reduxjs/toolkit";

const getSubjectDetails = (state: GlobalStateSchema) => {
    return state.subjectDetailsSchema?.details ?? undefined;
};

export const getSubjectDetailsData = createSelector(
    getSubjectDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.entityData ?? undefined,
);

export const getSubjectDetailsFormData = createSelector(
    getSubjectDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.entityFormData ?? undefined,
);

export const getSubjectDetailsIsFetching = createSelector(
    getSubjectDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.isFetching ?? false,
);

export const getSubjectDetailsIsSaving = createSelector(
    getSubjectDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.isSaving ?? false,
);

export const getSubjectDetailsError = createSelector(
    getSubjectDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?.error ?? undefined,
);

export const getSubjectDetailsIsInitialized = createSelector(
    getSubjectDetails,
    (state: GlobalStateSchema, formId: string) => formId,
    (details, formId) => details?.[formId]?._isInitialized ?? false,
);
