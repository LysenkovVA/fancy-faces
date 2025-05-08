"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubjectEntity } from "../../../(subjects)/model/types/SubjectEntity";
import { ThunkConfig } from "@/app/lib/store";
import { getSubjectByIdThunk } from "@/app/(private-routes)/(subjects)/model/thunks/getSubjectByIdThunk";

export interface InitCompareListThunkProps {}

export const initCompareListThunk = createAsyncThunk<
    SubjectEntity[] | undefined,
    InitCompareListThunkProps,
    ThunkConfig<string>
>("initCompareListThunk", async (props, thunkApi) => {
    const { rejectWithValue, dispatch } = thunkApi;

    try {
        const localStorageItem = localStorage.getItem("compareList");

        if (localStorageItem) {
            const listKeys = JSON.parse(localStorageItem) as string[];

            const compareListEntities: SubjectEntity[] = [];

            for (const id of listKeys) {
                // alert(`Fetching ${id}`);
                const data = await dispatch(
                    getSubjectByIdThunk({ formId: "", id: id }),
                ).unwrap();

                if (data.isOk) {
                    compareListEntities.push(data.data!);
                }
            }

            return compareListEntities;
        }

        return [];
    } catch (error) {
        // Неизвестная ошибка в thunk-е
        return rejectWithValue(ResponseData.Error(error).getAllErrors());
    }
});
