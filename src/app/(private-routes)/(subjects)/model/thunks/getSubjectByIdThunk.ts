"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubjectEntity } from "../types/SubjectEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetSubjectByIdThunkProps {
    formId: string;
    id: string;
}

export const getSubjectByIdThunk = createAsyncThunk<
    ResponseData<SubjectEntity | undefined>,
    GetSubjectByIdThunkProps,
    ThunkConfig<string>
>("getSubjectByIdThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/subjects/${props.id}`,
            { method: "GET" },
        );

        const data = (await response.json()) as ResponseData<
            SubjectEntity | undefined
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
