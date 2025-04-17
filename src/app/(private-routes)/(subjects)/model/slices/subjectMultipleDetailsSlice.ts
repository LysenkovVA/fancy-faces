"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubjectEntity } from "../types/SubjectEntity";
import { MultipleDetailsReduxSchema } from "@/app/lib/types/MultipleDetailsReduxSchema";
import { getSubjectByIdThunk } from "../thunks/getSubjectByIdThunk";
import { upsertSubjectThunk } from "../thunks/upsertSubjectThunk";

const initialState: MultipleDetailsReduxSchema<SubjectEntity> = {
    details: {},
};

export const subjectMultipleDetailsSlice = createSlice({
    name: "subjectMultipleDetailsSlice",
    initialState,
    reducers: {
        init: (state, action: PayloadAction<{ formId: string }>) => {
            if (!state.details[action.payload.formId]) {
                state.details[action.payload.formId] = {
                    entityData: { id: "", name: "" },
                    entityFormData: { id: "", name: "" },
                    isFetching: false,
                    isSaving: false,
                    error: undefined,
                    _isInitialized: false,
                };
            }
        },
        unmount: (state, action: PayloadAction<{ formId: string }>) => {
            if (state.details[action.payload.formId]) {
                const newDetails = { ...state.details };
                delete newDetails[action.payload.formId];
                state.details = newDetails;
            }
        },
        setInitialized: (
            state,
            action: PayloadAction<{ formId: string; isInitialized: boolean }>,
        ) => {
            state.details[action.payload.formId]._isInitialized =
                action.payload.isInitialized;
        },
        setFormData: (
            state,
            action: PayloadAction<{
                formId: string;
                data: SubjectEntity;
            }>,
        ) => {
            state.details[action.payload.formId].entityFormData =
                action.payload.data;
        },
    },
    extraReducers: (builder) => {
        builder
            // Получение по id
            .addCase(getSubjectByIdThunk.pending, (state, action) => {
                if (!state.details[action.meta.arg.formId]) {
                    state.details[action.meta.arg.formId] = {
                        entityData: { id: "", name: "" },
                        entityFormData: { id: "", name: "" },
                        isFetching: false,
                        isSaving: false,
                        error: undefined,
                        _isInitialized: false,
                    };
                }

                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isFetching = true;
                state.details[action.meta.arg.formId].isSaving = false;
                state.details[action.meta.arg.formId].error = undefined;
                state.details[action.meta.arg.formId].entityData = {
                    id: "",
                    name: "",
                };
                state.details[action.meta.arg.formId].entityFormData = {
                    id: "",
                    name: "",
                };
                state.details[action.meta.arg.formId]._isInitialized = false;
            })
            .addCase(getSubjectByIdThunk.fulfilled, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = false;
                state.details[action.meta.arg.formId].error = undefined;
                state.details[action.meta.arg.formId].entityData =
                    action.payload.data!;
                state.details[action.meta.arg.formId].entityFormData =
                    action.payload.data!;
                state.details[action.meta.arg.formId]._isInitialized = true;
            })
            .addCase(getSubjectByIdThunk.rejected, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = false;
                state.details[action.meta.arg.formId].error = action.payload;
                state.details[action.meta.arg.formId].entityData = {
                    id: "",
                    name: "",
                };
                state.details[action.meta.arg.formId].entityFormData = {
                    id: "",
                    name: "",
                };
                state.details[action.meta.arg.formId]._isInitialized = true;
            })
            .addCase(upsertSubjectThunk.pending, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = true;
                state.details[action.meta.arg.formId].error = undefined;
            })
            .addCase(upsertSubjectThunk.fulfilled, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = false;
                state.details[action.meta.arg.formId].error = undefined;
                state.details[action.meta.arg.formId].entityData =
                    action.payload.data!;
                state.details[action.meta.arg.formId].entityFormData =
                    action.payload.data!;
            })
            .addCase(upsertSubjectThunk.rejected, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = false;
                state.details[action.meta.arg.formId].error = action.payload;
            });
    },
});

export const {
    actions: subjectMultipleDetailsActions,
    reducer: subjectMultipleDetailsReducer,
} = subjectMultipleDetailsSlice;
