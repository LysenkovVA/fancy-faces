import { GlobalStateSchema } from "@/app/lib/store";
import { createSelector } from "@reduxjs/toolkit";
import { SubjectEntity } from "@/app/(private-routes)/(subjects)";

export const getCompareSubjectsList = (state: GlobalStateSchema) => {
    return state.compareSubjectsListSchema.entities ?? [];
};

export const getCompareSubjectsListIsLoading = (state: GlobalStateSchema) => {
    return state.compareSubjectsListSchema.isLoading ?? false;
};

export const getCompareSubjectsListError = (state: GlobalStateSchema) => {
    return state.compareSubjectsListSchema.error ?? "";
};

export const getCompareSubjectsListIsInitialized = (
    state: GlobalStateSchema,
) => {
    return state.compareSubjectsListSchema._isInitialized ?? false;
};

export const getCompareSubjectsListCount = createSelector(
    getCompareSubjectsList,
    (state: GlobalStateSchema) => {},
    (list) => list.length ?? 0,
);

export const getIsPresentAtCompareSubjectsList = createSelector(
    getCompareSubjectsList,
    (state: GlobalStateSchema, id?: string) => {
        return id;
    },
    (list, id) =>
        id ? list.some((item: SubjectEntity) => item.id === id) : false,
);
