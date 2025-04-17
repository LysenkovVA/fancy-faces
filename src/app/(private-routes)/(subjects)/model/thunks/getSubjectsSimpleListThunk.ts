"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubjectEntity } from "../types/SubjectEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetSubjectsSimpleListThunkProps {
    replaceData?: boolean;
}

export const getSubjectsSimpleListThunk = createAsyncThunk<
    ResponseData<SubjectEntity[] | undefined>,
    GetSubjectsSimpleListThunkProps,
    ThunkConfig<string>
>("getSubjectsSimpleListThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        // Отправляем запрос
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/subjects`,
            { method: "GET" },
        );

        const data = (await response.json()) as ResponseData<
            SubjectEntity[] | undefined
        >;

        if (!data.isOk) {
            return rejectWithValue(ResponseData.getAllErrors(data));
        }

        return data;
    } catch (error) {
        // Неизвестная ошибка в thunk-е
        return rejectWithValue(ResponseData.Error(error).getAllErrors());
    }
});
