"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { GenderEntity } from "../types/GenderEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetGendersSimpleListThunkProps {
    replaceData?: boolean;
}

export const getGendersSimpleListThunk = createAsyncThunk<
    ResponseData<GenderEntity[] | undefined>,
    GetGendersSimpleListThunkProps,
    ThunkConfig<string>
>("getGendersSimpleListThunk", async (props, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
        // Отправляем запрос
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/genders`,
            { method: "GET" },
        );

        const data = (await response.json()) as ResponseData<
            GenderEntity[] | undefined
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
