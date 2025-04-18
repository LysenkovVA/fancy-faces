import { createSlice } from "@reduxjs/toolkit";
import { getUsersSimpleListThunk } from "../thunks/getUsersSimpleListThunk";
import { upsertUserThunk } from "../thunks/upsertUserThunk";
import { deleteUserByIdThunk } from "../thunks/deleteUserByIdThunk";
import { SimpleListReduxSchema } from "@/app/lib/types/SimpleListReduxSchema";
import { UserEntity } from "../types/UserEntity";
import { userAdapter } from "../adapter/userAdapter";

const initialState: SimpleListReduxSchema<UserEntity> = {
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
    _isInitialized: false,
};

export const usersSimpleListSlice = createSlice({
    name: "usersSimpleListSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsersSimpleListThunk.pending, (state, action) => {
                state.isLoading = true;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    userAdapter.removeAll(state);
                }

                state._isInitialized = true;
            })
            .addCase(getUsersSimpleListThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Записываем новые данные
                    userAdapter.setAll(state, action.payload.data!);
                } else {
                    // Добавляем порцию данных
                    userAdapter.addMany(state, action.payload.data!);
                }
            })
            .addCase(getUsersSimpleListThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    userAdapter.removeAll(state);
                }
            })
            .addCase(upsertUserThunk.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(upsertUserThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;
                userAdapter.upsertOne(state, action.payload.data!);
            })
            .addCase(upsertUserThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteUserByIdThunk.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(deleteUserByIdThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;
                userAdapter.removeOne(state, action.payload.data!.id);
            })
            .addCase(deleteUserByIdThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    actions: usersSimpleListActions,
    reducer: usersSimpleListReducer,
} = usersSimpleListSlice;
