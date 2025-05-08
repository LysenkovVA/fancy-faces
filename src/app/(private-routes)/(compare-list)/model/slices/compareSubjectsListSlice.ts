import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SubjectEntity } from "../../../(subjects)/model/types/SubjectEntity";
import { CompareSubjectsListSchema } from "@/app/(private-routes)/(subjects)/model/types/CompareSubjectsListSchema";
import { initCompareListThunk } from "@/app/(private-routes)/(compare-list)/model/thunks/initCompareListThunk";

const initialState: CompareSubjectsListSchema = {
    entities: [] as SubjectEntity[],
    isLoading: false,
    error: "",
    _isInitialized: false,
};

export const compareSubjectsListSlice = createSlice({
    name: "compareSubjectsListSlice",
    initialState,
    reducers: {
        addSubject: (state, action: PayloadAction<SubjectEntity>) => {
            if (state.entities === undefined) {
                state.entities = [];
            }
            if (
                !state.entities.some(
                    (entity) => entity.id === action.payload.id,
                )
            ) {
                state.entities?.push(action.payload);

                const listKeys = state.entities.map((entity) => entity.id);
                localStorage.setItem("compareList", JSON.stringify(listKeys));
            }
        },
        removeSubject: (state, action: PayloadAction<string>) => {
            state.entities = state.entities?.filter(
                (subject) => subject.id !== action.payload,
            );

            const listKeys = state.entities?.map((entity) => entity.id);
            localStorage.setItem("compareList", JSON.stringify(listKeys));
        },
        clearAll: (state) => {
            state.entities = [];
            localStorage.removeItem("compareList");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(initCompareListThunk.pending, (state, action) => {
                state.isLoading = true;
                state.error = "";
                state._isInitialized = false;
            })
            .addCase(initCompareListThunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = "";
                state.entities = action.payload;
                state._isInitialized = true;
            })
            .addCase(initCompareListThunk.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload!;
                state._isInitialized = true;
            });
    },
});

export const {
    actions: compareSubjectsListActions,
    reducer: compareSubjectsListReducer,
} = compareSubjectsListSlice;
