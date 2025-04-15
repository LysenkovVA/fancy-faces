"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { AntropologicalTypeEntity } from "../types/AntropologicalTypeEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetAntropologicalTypesSimpleListThunkProps {
    replaceData?: boolean;
}

export const getAntropologicalTypesSimpleListThunk = createAsyncThunk<
    ResponseData<AntropologicalTypeEntity[] | undefined>,
    GetAntropologicalTypesSimpleListThunkProps,
    ThunkConfig<string>
>("getAntropologicalTypesSimpleListThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        // Отправляем запрос
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/antropological-types`,
            { method: "GET" },
        );

        const data = (await response.json()) as ResponseData<
            AntropologicalTypeEntity[] | undefined
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
