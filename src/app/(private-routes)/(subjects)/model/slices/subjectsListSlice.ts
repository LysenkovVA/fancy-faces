import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { subjectAdapter } from "../adapter/subjectAdapter";
import { getSubjectsListThunk } from "../thunks/getSubjectsListThunk";
import { ListReduxSchema } from "@/app/lib/types/ListReduxSchema";
import { SubjectEntity } from "../types/SubjectEntity";
import { deleteSubjectByIdThunk } from "../thunks/deleteSubjectByIdThunk";
import { SubjectFilterType } from "../types/SubjectFilterType";
import { upsertSubjectThunk } from "@/app/(private-routes)/(subjects)/model/thunks/upsertSubjectThunk";

const initialState: ListReduxSchema<SubjectEntity, SubjectFilterType> = {
    ids: [],
    entities: {},
    isLoading: false,
    error: undefined,
    take: 9,
    skip: 0,
    search: "",
    highlightedSearch: "",
    filters: undefined,
    totalCount: 0,
    hasMore: true,
    _isInitialized: false,
};

export const subjectsListSlice = createSlice({
    name: "subjectsListSlice",
    initialState,
    reducers: {
        setSearch: (state, action: PayloadAction<string | undefined>) => {
            state.search = action.payload;
            state.highlightedSearch = "";
            state.skip = 0;
            state.totalCount = 0;
            state.hasMore = true;
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
            state.skip = 0;
            state.totalCount = 0;
            state.hasMore = true;
            state._isInitialized = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSubjectsListThunk.pending, (state, action) => {
                state.isLoading = true;
                state.error = undefined;
                state.highlightedSearch = state.search;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    subjectAdapter.removeAll(state);
                    state.skip = 0;
                    state.totalCount = 0;
                    state.hasMore = true;
                }

                state._isInitialized = true;
            })
            .addCase(getSubjectsListThunk.fulfilled, (state, action) => {
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

                state.totalCount = action.payload.pagination?.total ?? 0;
                state.hasMore = state.totalCount > state.skip + state.take;

                if (state.hasMore) {
                    state.skip = state.skip + state.take;
                } else {
                    state.skip = state.totalCount;
                }
            })
            .addCase(getSubjectsListThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;

                // Если данные заменяются
                if (action.meta.arg.replaceData) {
                    // Очищаем старые
                    subjectAdapter.removeAll(state);
                    state.hasMore = false;
                    state.totalCount = 0;
                }
            })
            .addCase(deleteSubjectByIdThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;
                subjectAdapter.removeOne(state, action.payload.data!.id);
                state.totalCount = state.ids.length;
            })
            .addCase(deleteSubjectByIdThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(upsertSubjectThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = undefined;
                subjectAdapter.upsertOne(state, action.payload.data!);
                state.totalCount = state.ids.length;
            });
    },
});

export const { actions: subjectsListActions, reducer: subjectsListReducer } =
    subjectsListSlice;
