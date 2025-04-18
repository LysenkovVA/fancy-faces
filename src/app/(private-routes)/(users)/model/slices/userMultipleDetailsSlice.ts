"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserEntity } from "../types/UserEntity";
import { MultipleDetailsReduxSchema } from "@/app/lib/types/MultipleDetailsReduxSchema";
import { getUserByIdThunk } from "../thunks/getUserByIdThunk";
import { upsertUserThunk } from "../thunks/upsertUserThunk";

const initialState: MultipleDetailsReduxSchema<UserEntity> = {
    details: {},
};

export const userMultipleDetailsSlice = createSlice({
    name: "userMultipleDetailsSlice",
    initialState,
    reducers: {
        init: (state, action: PayloadAction<{ formId: string }>) => {
            if (!state.details[action.payload.formId]) {
                state.details[action.payload.formId] = {
                    entityData: {
                        id: "",
                        name: "",
                        login: "",
                        hashedPassword: "",
                        surname: "",
                        patronymic: "",
                        userRole: { id: "", name: "" },
                    },
                    entityFormData: {
                        id: "",
                        name: "",
                        login: "",
                        hashedPassword: "",
                        surname: "",
                        patronymic: "",
                        userRole: { id: "", name: "" },
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
                data: UserEntity;
            }>,
        ) => {
            state.details[action.payload.formId].entityFormData =
                action.payload.data;
        },
    },
    extraReducers: (builder) => {
        builder
            // Получение по id
            .addCase(getUserByIdThunk.pending, (state, action) => {
                if (!state.details[action.meta.arg.formId]) {
                    state.details[action.meta.arg.formId] = {
                        entityData: {
                            id: "",
                            name: "",
                            login: "",
                            hashedPassword: "",
                            surname: "",
                            patronymic: "",
                            userRole: { id: "", name: "" },
                        },
                        entityFormData: {
                            id: "",
                            name: "",
                            login: "",
                            hashedPassword: "",
                            surname: "",
                            patronymic: "",
                            userRole: { id: "", name: "" },
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
                    login: "",
                    hashedPassword: "",
                    surname: "",
                    patronymic: "",
                    userRole: { id: "", name: "" },
                };
                state.details[action.meta.arg.formId].entityFormData = {
                    id: "",
                    name: "",
                    login: "",
                    hashedPassword: "",
                    surname: "",
                    patronymic: "",
                    userRole: { id: "", name: "" },
                };
                state.details[action.meta.arg.formId]._isInitialized = false;
            })
            .addCase(getUserByIdThunk.fulfilled, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = false;
                state.details[action.meta.arg.formId].error = undefined;
                state.details[action.meta.arg.formId].entityData =
                    action.payload.data!;
                state.details[action.meta.arg.formId].entityFormData =
                    action.payload.data!;
                state.details[action.meta.arg.formId]._isInitialized = true;
            })
            .addCase(getUserByIdThunk.rejected, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = false;
                state.details[action.meta.arg.formId].error = action.payload;
                state.details[action.meta.arg.formId].entityData = {
                    id: "",
                    name: "",
                    login: "",
                    hashedPassword: "",
                    surname: "",
                    patronymic: "",
                    userRole: { id: "", name: "" },
                };
                state.details[action.meta.arg.formId].entityFormData = {
                    id: "",
                    name: "",
                    login: "",
                    hashedPassword: "",
                    surname: "",
                    patronymic: "",
                    userRole: { id: "", name: "" },
                };
                state.details[action.meta.arg.formId]._isInitialized = true;
            })
            .addCase(upsertUserThunk.pending, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = true;
                state.details[action.meta.arg.formId].error = undefined;
            })
            .addCase(upsertUserThunk.fulfilled, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = false;
                state.details[action.meta.arg.formId].error = undefined;
                state.details[action.meta.arg.formId].entityData =
                    action.payload.data!;
                state.details[action.meta.arg.formId].entityFormData =
                    action.payload.data!;
            })
            .addCase(upsertUserThunk.rejected, (state, action) => {
                state.details[action.meta.arg.formId].isFetching = false;
                state.details[action.meta.arg.formId].isSaving = false;
                state.details[action.meta.arg.formId].error = action.payload;
            });
    },
});

export const {
    actions: userMultipleDetailsActions,
    reducer: userMultipleDetailsReducer,
} = userMultipleDetailsSlice;
