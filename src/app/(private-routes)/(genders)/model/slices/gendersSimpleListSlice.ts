import { createSlice } from "@reduxjs/toolkit";
import { getGendersSimpleListThunk } from "../thunks/getGendersSimpleListThunk";
import { SimpleListReduxSchema } from "@/app/lib/types/SimpleListReduxSchema";
import { GenderEntity } from "../types/GenderEntity";
import { genderAdapter } from "../adapter/genderAdapter";

const initialState: SimpleListReduxSchema<GenderEntity> = {
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
    _isInitialized: false,
};

export const gendersSimpleListSlice = createSlice({
    name: "gendersSimpleListSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getGendersSimpleListThunk.pending, (state, action) => {
                state.isLoading = true;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    genderAdapter.removeAll(state);
                }

                state._isInitialized = true;
            })
            .addCase(getGendersSimpleListThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Записываем новые данные
                    genderAdapter.setAll(state, action.payload.data!);
                } else {
                    // Добавляем порцию данных
                    genderAdapter.addMany(state, action.payload.data!);
                }
            })
            .addCase(getGendersSimpleListThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    genderAdapter.removeAll(state);
                }
            });
    },
});

export const {
    actions: gendersSimpleListActions,
    reducer: gendersSimpleListReducer,
} = gendersSimpleListSlice;
