"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubjectEntity } from "../types/SubjectEntity";
import { MultipleDetailsReduxSchema } from "@/app/lib/types/MultipleDetailsReduxSchema";
import { getSubjectByIdThunk } from "../thunks/getSubjectByIdThunk";
import { upsertSubjectThunk } from "../thunks/upsertSubjectThunk";
import { deleteSubgroupByIdThunk } from "@/app/(private-routes)/(subgroups)/model/thunks/deleteSubgroupByIdThunk";
import { deleteInitiatorByIdThunk } from "@/app/(private-routes)/(initiators)/model/thunks/deleteInitiatorByIdThunk";
import { deleteAntropologicalTypeByIdThunk } from "@/app/(private-routes)/(antropological-types)/model/thunks/deleteAntropologicalTypeByIdThunk";

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
                    entityData: { id: "", name: "", date: new Date() },
                    entityFormData: { id: "", name: "", date: new Date() },
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
                        entityData: { id: "", name: "", date: new Date() },
                        entityFormData: { id: "", name: "", date: new Date() },
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
                    date: new Date(),
                };
                state.details[action.meta.arg.formId].entityFormData = {
                    id: "",
                    name: "",
                    date: new Date(),
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
                    date: new Date(),
                };
                state.details[action.meta.arg.formId].entityFormData = {
                    id: "",
                    name: "",
                    date: new Date(),
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
            })
            // Удаление инициатора
            .addCase(deleteInitiatorByIdThunk.fulfilled, (state, action) => {
                Object.values(state.details).map((details) => {
                    if (
                        details.entityFormData?.initiator?.id ===
                        action.payload.data?.id
                    ) {
                        details.entityFormData = {
                            ...details.entityFormData!,
                            initiator: undefined,
                        };
                    }
                });
            })
            // Удаление антропологического типа
            .addCase(
                deleteAntropologicalTypeByIdThunk.fulfilled,
                (state, action) => {
                    Object.values(state.details).map((details) => {
                        if (
                            details.entityFormData?.antropologicalType?.id ===
                            action.payload.data?.id
                        ) {
                            details.entityFormData = {
                                ...details.entityFormData!,
                                antropologicalType: undefined,
                            };
                        }
                    });
                },
            )
            // Удаление подгруппы
            .addCase(deleteSubgroupByIdThunk.fulfilled, (state, action) => {
                Object.values(state.details).map((details) => {
                    if (
                        details.entityFormData?.subgroup?.id ===
                        action.payload.data?.id
                    ) {
                        details.entityFormData = {
                            ...details.entityFormData!,
                            subgroup: undefined,
                        };
                    }
                });
            });
    },
});

export const {
    actions: subjectMultipleDetailsActions,
    reducer: subjectMultipleDetailsReducer,
} = subjectMultipleDetailsSlice;
