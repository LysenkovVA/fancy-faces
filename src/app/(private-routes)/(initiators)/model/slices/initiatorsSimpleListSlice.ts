import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getInitiatorsSimpleListThunk } from "../thunks/getInitiatorsSimpleListThunk";
import { upsertInitiatorThunk } from "../thunks/upsertInitiatorThunk";
import { deleteInitiatorByIdThunk } from "../thunks/deleteInitiatorByIdThunk";
import { SimpleListReduxSchema } from "@/app/lib/types/SimpleListReduxSchema";
import { InitiatorEntity } from "../types/InitiatorEntity";
import { initiatorAdapter } from "../adapter/initiatorAdapter";
import { InitiatorFilterType } from "@/app/(private-routes)/(initiators)/model/types/InitiatorFilterType";

const initialState: SimpleListReduxSchema<
    InitiatorEntity,
    InitiatorFilterType
> = {
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
    search: "",
    filters: undefined,
    _isInitialized: false,
};

export const initiatorsSimpleListSlice = createSlice({
    name: "initiatorsSimpleListSlice",
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string | undefined>) => {
            state.search = action.payload;
            state._isInitialized = false;
        },
        setFilters: (
            state,
            action: PayloadAction<
                | OptionalRecord<InitiatorFilterType, string[] | undefined>
                | undefined
            >,
        ) => {
            state.filters = action.payload;
            state._isInitialized = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getInitiatorsSimpleListThunk.pending, (state, action) => {
                state.isLoading = true;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    initiatorAdapter.removeAll(state);
                }

                state._isInitialized = true;
            })
            .addCase(
                getInitiatorsSimpleListThunk.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.error = undefined;

                    // Если данные заменяются
                    if (action.meta.arg.replaceData) {
                        // Записываем новые данные
                        initiatorAdapter.setAll(state, action.payload.data!);
                    } else {
                        // Добавляем порцию данных
                        initiatorAdapter.addMany(state, action.payload.data!);
                    }
                },
            )
            .addCase(getInitiatorsSimpleListThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    initiatorAdapter.removeAll(state);
                }
            })
            .addCase(upsertInitiatorThunk.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(upsertInitiatorThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;
                initiatorAdapter.upsertOne(state, action.payload.data!);
            })
            .addCase(upsertInitiatorThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteInitiatorByIdThunk.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(deleteInitiatorByIdThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;
                initiatorAdapter.removeOne(state, action.payload.data!.id);
            })
            .addCase(deleteInitiatorByIdThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    actions: initiatorsSimpleListActions,
    reducer: initiatorsSimpleListReducer,
} = initiatorsSimpleListSlice;
