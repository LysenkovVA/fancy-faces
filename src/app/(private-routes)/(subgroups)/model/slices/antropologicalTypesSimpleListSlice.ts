import { createSlice } from "@reduxjs/toolkit";
import { getSubgroupsSimpleListThunk } from "../thunks/getSubgroupsSimpleListThunk";
import { upsertSubgroupThunk } from "../thunks/upsertSubgroupThunk";
import { deleteSubgroupByIdThunk } from "../thunks/deleteSubgroupByIdThunk";
import { SimpleListReduxSchema } from "@/app/lib/types/SimpleListReduxSchema";
import { SubgroupEntity } from "../types/SubgroupEntity";
import { subgroupAdapter } from "../adapter/subgroupAdapter";

const initialState: SimpleListReduxSchema<SubgroupEntity> = {
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
    _isInitialized: false,
};

export const subgroupsSimpleListSlice = createSlice({
    name: "subgroupsSimpleListSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSubgroupsSimpleListThunk.pending, (state, action) => {
                state.isLoading = true;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    subgroupAdapter.removeAll(state);
                }

                state._isInitialized = true;
            })
            .addCase(getSubgroupsSimpleListThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Записываем новые данные
                    subgroupAdapter.setAll(state, action.payload.data!);
                } else {
                    // Добавляем порцию данных
                    subgroupAdapter.addMany(state, action.payload.data!);
                }
            })
            .addCase(getSubgroupsSimpleListThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    subgroupAdapter.removeAll(state);
                }
            })
            .addCase(upsertSubgroupThunk.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(upsertSubgroupThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;
                subgroupAdapter.upsertOne(state, action.payload.data!);
            })
            .addCase(upsertSubgroupThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteSubgroupByIdThunk.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(deleteSubgroupByIdThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;
                subgroupAdapter.removeOne(state, action.payload.data!.id);
            })
            .addCase(deleteSubgroupByIdThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    actions: subgroupsSimpleListActions,
    reducer: subgroupsSimpleListReducer,
} = subgroupsSimpleListSlice;
