"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubgroupEntity } from "../types/SubgroupEntity";
import { MultipleDetailsReduxSchema } from "@/app/lib/types/MultipleDetailsReduxSchema";
import { getSubgroupByIdThunk } from "../thunks/getSubgroupByIdThunk";
import { upsertSubgroupThunk } from "../thunks/upsertSubgroupThunk";

const initialState: MultipleDetailsReduxSchema<SubgroupEntity> = {
    details: {},
};

export const subgroupMultipleDetailsSlice = createSlice({
    name: "subgroupMultipleDetailsSlice",
    initialState,
    reducers: {
        init: (state, action: PayloadAction<{ formId: string }>) => {
            if (!state.details[action.payload.formId]) {
                state.details[action.payload.formId] = {
                    entityData: {
                        id: "",
                        name: "",
                        antropologicalType: { id: "", name: "" },
                    },
                    entityFormData: {
                        id: "",
                        name: "",
                        antropologicalType: { id: "", name: "" },
                    },
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
                data: SubgroupEntity;
            }>,
        ) => {
            state.details[action.payload.formId].entityFormData =
                action.payload.data;
        },
    },
    extraReducers: (builder) => {
        builder
            // Получение по id
            .addCase(getSubgroupByIdThunk.pending, (state, action) => {
                if (!state.details[action.meta.arg.formId]) {
                    state.details[action.meta.arg.formId] = {
                        entityData: {
                            id: "",
                            name: "",
                            antropologicalType: { id: "", name: "" },
                        },
                        entityFormData: {
                            id: "",
                            name: "",
                            antropologicalType: { id: "", name: "" },
                        },
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
                    antropologicalType: { id: "", name: "" },
                };
                state.details[action.meta.arg.formId].entityFormData = {
                    id: "",
                    name: "",
                    antropologicalType: { id: "", name: "" },
                };
                state.details[action.meta.arg.formId]._isInitialized = false;
            })
            .addCase(getSubgroupByIdThunk.fulfilled, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = false;
                state.details[action.meta.arg.formId].error = undefined;
                state.details[action.meta.arg.formId].entityData =
                    action.payload.data!;
                state.details[action.meta.arg.formId].entityFormData =
                    action.payload.data!;
                state.details[action.meta.arg.formId]._isInitialized = true;
            })
            .addCase(getSubgroupByIdThunk.rejected, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = false;
                state.details[action.meta.arg.formId].error = action.payload;
                state.details[action.meta.arg.formId].entityData = {
                    id: "",
                    name: "",
                    antropologicalType: { id: "", name: "" },
                };
                state.details[action.meta.arg.formId].entityFormData = {
                    id: "",
                    name: "",
                    antropologicalType: { id: "", name: "" },
                };
                state.details[action.meta.arg.formId]._isInitialized = true;
            })
            .addCase(upsertSubgroupThunk.pending, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = true;
                state.details[action.meta.arg.formId].error = undefined;
            })
            .addCase(upsertSubgroupThunk.fulfilled, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = false;
                state.details[action.meta.arg.formId].error = undefined;
                state.details[action.meta.arg.formId].entityData =
                    action.payload.data!;
                state.details[action.meta.arg.formId].entityFormData =
                    action.payload.data!;
            })
            .addCase(upsertSubgroupThunk.rejected, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = false;
                state.details[action.meta.arg.formId].error = action.payload;
            });
    },
});

export const {
    actions: subgroupMultipleDetailsActions,
    reducer: subgroupMultipleDetailsReducer,
} = subgroupMultipleDetailsSlice;
