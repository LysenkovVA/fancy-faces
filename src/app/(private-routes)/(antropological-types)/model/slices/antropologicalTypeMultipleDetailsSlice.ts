"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AntropologicalTypeEntity } from "../types/AntropologicalTypeEntity";
import { MultipleDetailsReduxSchema } from "@/app/lib/types/MultipleDetailsReduxSchema";
import { getAntropologicalTypeByIdThunk } from "../thunks/getAntropologicalTypeByIdThunk";
import { upsertAntropologicalTypeThunk } from "../thunks/upsertAntropologicalTypeThunk";

const initialState: MultipleDetailsReduxSchema<AntropologicalTypeEntity> = {
    details: {},
};

export const antropologicalTypeMultipleDetailsSlice = createSlice({
    name: "antropologicalTypeMultipleDetailsSlice",
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
                data: AntropologicalTypeEntity;
            }>,
        ) => {
            state.details[action.payload.formId].entityFormData =
                action.payload.data;
        },
    },
    extraReducers: (builder) => {
        builder
            // Получение по id
            .addCase(
                getAntropologicalTypeByIdThunk.pending,
                (state, action) => {
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
                    state.details[action.meta.arg.formId]._isInitialized =
                        false;
                },
            )
            .addCase(
                getAntropologicalTypeByIdThunk.fulfilled,
                (state, action) => {
                    state.details[action.meta.arg.formId].isFetching = false;
                    state.details[action.meta.arg.formId].isSaving = false;
                    state.details[action.meta.arg.formId].error = undefined;
                    state.details[action.meta.arg.formId].entityData =
                        action.payload.data!;
                    state.details[action.meta.arg.formId].entityFormData =
                        action.payload.data!;
                    state.details[action.meta.arg.formId]._isInitialized = true;
                },
            )
            .addCase(
                getAntropologicalTypeByIdThunk.rejected,
                (state, action) => {
                    state.details[action.meta.arg.formId].isFetching = false;
                    state.details[action.meta.arg.formId].isSaving = false;
                    state.details[action.meta.arg.formId].error =
                        action.payload;
                    state.details[action.meta.arg.formId].entityData = {
                        id: "",
                        name: "",
                    };
                    state.details[action.meta.arg.formId].entityFormData = {
                        id: "",
                        name: "",
                    };
                    state.details[action.meta.arg.formId]._isInitialized = true;
                },
            )
            .addCase(upsertAntropologicalTypeThunk.pending, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = true;
                state.details[action.meta.arg.formId].error = undefined;
            })
            .addCase(
                upsertAntropologicalTypeThunk.fulfilled,
                (state, action) => {
                    state.details[action.meta.arg.formId].isFetching = false;
                    state.details[action.meta.arg.formId].isSaving = false;
                    state.details[action.meta.arg.formId].error = undefined;
                    state.details[action.meta.arg.formId].entityData =
                        action.payload.data!;
                    state.details[action.meta.arg.formId].entityFormData =
                        action.payload.data!;
                },
            )
            .addCase(
                upsertAntropologicalTypeThunk.rejected,
                (state, action) => {
                    state.details[action.meta.arg.formId].isFetching = false;
                    state.details[action.meta.arg.formId].isSaving = false;
                    state.details[action.meta.arg.formId].error =
                        action.payload;
                },
            );
    },
});

export const {
    actions: antropologicalTypeMultipleDetailsActions,
    reducer: antropologicalTypeMultipleDetailsReducer,
} = antropologicalTypeMultipleDetailsSlice;
