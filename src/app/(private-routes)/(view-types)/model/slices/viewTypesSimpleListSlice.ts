import { createSlice } from "@reduxjs/toolkit";
import { getViewTypesSimpleListThunk } from "../thunks/getViewTypesSimpleListThunk";
import { SimpleListReduxSchema } from "@/app/lib/types/SimpleListReduxSchema";
import { ViewTypeEntity } from "../types/ViewTypeEntity";
import { viewTypeAdapter } from "../adapter/viewTypeAdapter";

const initialState: SimpleListReduxSchema<ViewTypeEntity> = {
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
    _isInitialized: false,
};

export const viewTypesSimpleListSlice = createSlice({
    name: "viewTypesSimpleListSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getViewTypesSimpleListThunk.pending, (state, action) => {
                state.isLoading = true;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    viewTypeAdapter.removeAll(state);
                }

                state._isInitialized = true;
            })
            .addCase(getViewTypesSimpleListThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Записываем новые данные
                    viewTypeAdapter.setAll(state, action.payload.data!);
                } else {
                    // Добавляем порцию данных
                    viewTypeAdapter.addMany(state, action.payload.data!);
                }
            })
            .addCase(getViewTypesSimpleListThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    viewTypeAdapter.removeAll(state);
                }
            });
    },
});

export const {
    actions: viewTypesSimpleListActions,
    reducer: viewTypesSimpleListReducer,
} = viewTypesSimpleListSlice;
