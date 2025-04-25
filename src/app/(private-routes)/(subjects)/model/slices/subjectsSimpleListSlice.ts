import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getSubjectsSimpleListThunk } from "../thunks/getSubjectsSimpleListThunk";
import { upsertSubjectThunk } from "../thunks/upsertSubjectThunk";
import { deleteSubjectByIdThunk } from "../thunks/deleteSubjectByIdThunk";
import { SimpleListReduxSchema } from "@/app/lib/types/SimpleListReduxSchema";
import { SubjectEntity } from "../types/SubjectEntity";
import { subjectAdapter } from "../adapter/subjectAdapter";
import { SubjectFilterType } from "@/app/(private-routes)/(subjects)/model/types/SubjectFilterType";

const initialState: SimpleListReduxSchema<SubjectEntity, SubjectFilterType> = {
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
    search: "",
    filters: undefined,
    _isInitialized: false,
};

export const subjectsSimpleListSlice = createSlice({
    name: "subjectsSimpleListSlice",
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string | undefined>) => {
            state.search = action.payload;
            state._isInitialized = false;
        },
        setFilters: (
            state,
            action: PayloadAction<
                | OptionalRecord<SubjectFilterType, string[] | undefined>
                | undefined
            >,
        ) => {
            state.filters = action.payload;
            state._isInitialized = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSubjectsSimpleListThunk.pending, (state, action) => {
                state.isLoading = true;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    subjectAdapter.removeAll(state);
                }

                state._isInitialized = true;
            })
            .addCase(getSubjectsSimpleListThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Записываем новые данные
                    subjectAdapter.setAll(state, action.payload.data!);
                } else {
                    // Добавляем порцию данных
                    subjectAdapter.addMany(state, action.payload.data!);
                }
            })
            .addCase(getSubjectsSimpleListThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    subjectAdapter.removeAll(state);
                }
            })
            .addCase(upsertSubjectThunk.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(upsertSubjectThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;
                subjectAdapter.upsertOne(state, action.payload.data!);
            })
            .addCase(upsertSubjectThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(deleteSubjectByIdThunk.pending, (state) => {
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(deleteSubjectByIdThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;
                subjectAdapter.removeOne(state, action.payload.data!.id);
            })
            .addCase(deleteSubjectByIdThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {
    actions: subjectsSimpleListActions,
    reducer: subjectsSimpleListReducer,
} = subjectsSimpleListSlice;
