import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { userAdapter } from "../adapter/userAdapter";
import { getUsersListThunk } from "../thunks/getUsersListThunk";
import { ListReduxSchema } from "@/app/lib/types/ListReduxSchema";
import { UserEntity } from "../types/UserEntity";
import { deleteUserByIdThunk } from "../thunks/deleteUserByIdThunk";
import { UserFilterType } from "../types/UserFilterType";
import { upsertUserThunk } from "@/app/(private-routes)/(users)/model/thunks/upsertUserThunk";

const initialState: ListReduxSchema<UserEntity, UserFilterType> = {
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
    take: 9,
    skip: 0,
    search: "",
    filters: undefined,
    totalCount: 0,
    hasMore: true,
    _isInitialized: false,
};

export const usersListSlice = createSlice({
    name: "usersListSlice",
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string | undefined>) => {
            state.search = action.payload;
            state.skip = 0;
            state.totalCount = 0;
            state.hasMore = true;
            state._isInitialized = false;
        },
        setFilters: (
            state,
            action: PayloadAction<
                OptionalRecord<UserFilterType, string[] | undefined> | undefined
            >,
        ) => {
            state.filters = action.payload;
            state.skip = 0;
            state.totalCount = 0;
            state.hasMore = true;
            state._isInitialized = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsersListThunk.pending, (state, action) => {
                state.isLoading = true;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    userAdapter.removeAll(state);
                    state.skip = 0;
                    state.totalCount = 0;
                    state.hasMore = true;
                }

                state._isInitialized = true;
            })
            .addCase(getUsersListThunk.fulfilled, (state, action) => {
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

                state.totalCount = action.payload.pagination?.total ?? 0;
                state.hasMore = state.totalCount > state.skip + state.take;

                if (state.hasMore) {
                    state.skip = state.skip + state.take;
                } else {
                    state.skip = state.totalCount;
                }
            })
            .addCase(getUsersListThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    userAdapter.removeAll(state);
                    state.hasMore = false;
                    state.totalCount = 0;
                }
            })
            .addCase(deleteUserByIdThunk.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(deleteUserByIdThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;
                userAdapter.removeOne(state, action.payload.data!.id);
                state.totalCount = state.ids.length;
            })
            .addCase(deleteUserByIdThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(upsertUserThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;
                userAdapter.upsertOne(state, action.payload.data!);
                state.totalCount = state.ids.length;
            });
    },
});

export const { actions: usersListActions, reducer: usersListReducer } =
    usersListSlice;
