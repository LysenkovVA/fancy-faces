"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { ViewTypeEntity } from "../types/ViewTypeEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetViewTypesSimpleListThunkProps {
    replaceData?: boolean;
}

export const getViewTypesSimpleListThunk = createAsyncThunk<
    ResponseData<ViewTypeEntity[] | undefined>,
    GetViewTypesSimpleListThunkProps,
    ThunkConfig<string>
>("getViewTypesSimpleListThunk", async (_, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        // Отправляем запрос
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/view-types`,
            { method: "GET" },
        );

        const data = (await response.json()) as ResponseData<
            ViewTypeEntity[] | undefined
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
