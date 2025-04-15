import { createSlice } from "@reduxjs/toolkit";
import { getAntropologicalTypesSimpleListThunk } from "../thunks/getAntropologicalTypesSimpleListThunk";
import { upsertAntropologicalTypeThunk } from "../thunks/upsertAntropologicalTypeThunk";
import { deleteAntropologicalTypeByIdThunk } from "../thunks/deleteAntropologicalTypeByIdThunk";
import { SimpleListReduxSchema } from "@/app/lib/types/SimpleListReduxSchema";
import { AntropologicalTypeEntity } from "../types/AntropologicalTypeEntity";
import { antropologicalTypeAdapter } from "../adapter/antropologicalTypeAdapter";

const initialState: SimpleListReduxSchema<AntropologicalTypeEntity> = {
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
    _isInitialized: false,
};

export const antropologicalTypesSimpleListSlice = createSlice({
    name: "antropologicalTypesSimpleListSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(
                getAntropologicalTypesSimpleListThunk.pending,
                (state, action) => {
                    state.isLoading = true;
                    state.error = undefined;

                    // Если данные заменяются
                    if (action.meta.arg.replaceData) {
                        // Очищаем старые
                        antropologicalTypeAdapter.removeAll(state);
                    }

                    state._isInitialized = true;
                },
            )
            .addCase(
                getAntropologicalTypesSimpleListThunk.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.error = undefined;

                    // Если данные заменяются
                    if (action.meta.arg.replaceData) {
                        // Записываем новые данные
                        antropologicalTypeAdapter.setAll(
                            state,
                            action.payload.data!,
                        );
                    } else {
                        // Добавляем порцию данных
                        antropologicalTypeAdapter.addMany(
                            state,
                            action.payload.data!,
                        );
                    }
                },
            )
            .addCase(
                getAntropologicalTypesSimpleListThunk.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;

                    // Если данные заменяются
                    if (action.meta.arg.replaceData) {
                        // Очищаем старые
                        antropologicalTypeAdapter.removeAll(state);
                    }
                },
            )
            .addCase(upsertAntropologicalTypeThunk.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(
                upsertAntropologicalTypeThunk.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.error = undefined;
                    antropologicalTypeAdapter.upsertOne(
                        state,
                        action.payload.data!,
                    );
                },
            )
            .addCase(
                upsertAntropologicalTypeThunk.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                },
            )
            .addCase(deleteAntropologicalTypeByIdThunk.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(
                deleteAntropologicalTypeByIdThunk.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.error = undefined;
                    antropologicalTypeAdapter.removeOne(
                        state,
                        action.payload.data!.id,
                    );
                },
            )
            .addCase(
                deleteAntropologicalTypeByIdThunk.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload;
                },
            );
    },
});

export const {
    actions: antropologicalTypesSimpleListActions,
    reducer: antropologicalTypesSimpleListReducer,
} = antropologicalTypesSimpleListSlice;
