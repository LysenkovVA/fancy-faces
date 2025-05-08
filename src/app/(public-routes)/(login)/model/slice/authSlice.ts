import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initAuthDataThunk } from "../services/initAuthDataThunk";
import { UserEntity } from "@/app/(private-routes)/(users)";
import { loginThunk } from "../services/loginThunk";
import { DetailsReduxSchema } from "@/app/lib/types/MultipleDetailsReduxSchema";
import { upsertUserThunk } from "@/app/(private-routes)/(users)/model/thunks/upsertUserThunk";

const initialState: DetailsReduxSchema<UserEntity> = {
    entityData: undefined,
    entityFormData: undefined,
    error: undefined,
    isFetching: false,
    isSaving: false,
    _isInitialized: false,
};

export const authSlice = createSlice({
    name: "authSlice",
    initialState,
    reducers: {
        setAuthData: (state, action: PayloadAction<UserEntity>) => {
            state.entityData = action.payload;
        },
        logout: (state) => {
            localStorage.removeItem("compareList");
            state.entityData = undefined;
            state._isInitialized = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initAuthDataThunk.pending, (state) => {
                state.entityData = undefined;
                state.entityFormData = undefined;
                state.error = undefined;
                state.isFetching = true;
                state.isSaving = false;
                state._isInitialized = false;
            })
            .addCase(initAuthDataThunk.fulfilled, (state, payload) => {
                state.entityData = payload.payload;
                state.error = undefined;
                state.isFetching = false;
                state.isSaving = false;
                state._isInitialized = true;
            })
            .addCase(initAuthDataThunk.rejected, (state, error) => {
                state.entityData = undefined;
                state.entityFormData = undefined;
                state.error = error.payload;
                state.isFetching = false;
                state.isSaving = false;
                state._isInitialized = false;
            })
            .addCase(loginThunk.pending, (state) => {
                state.entityData = undefined;
                state.entityFormData = undefined;
                state.error = undefined;
                state.isFetching = true;
                state.isSaving = false;
                state._isInitialized = false;
            })
            .addCase(loginThunk.fulfilled, (state, payload) => {
                state.entityData = payload.payload;
                state.entityFormData = payload.payload;
                state.error = undefined;
                state.isFetching = false;
                state.isSaving = false;
                state._isInitialized = true;
            })
            .addCase(loginThunk.rejected, (state, error) => {
                state.entityData = undefined;
                state.entityFormData = undefined;
                state.error = error.payload;
                state.isFetching = false;
                state.isSaving = false;
                state._isInitialized = false;
            })
            .addCase(upsertUserThunk.fulfilled, (state, payload) => {
                if (payload.payload.data?.id === state.entityData?.id) {
                    state.entityData = payload.payload.data;
                    state.entityFormData = payload.payload.data;
                }
            });
    },
});

export const { actions: authActions } = authSlice;
export const { reducer: authReducer } = authSlice;
