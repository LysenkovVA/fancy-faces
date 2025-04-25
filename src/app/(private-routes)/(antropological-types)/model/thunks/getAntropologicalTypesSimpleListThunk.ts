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
>("getAntropologicalTypesSimpleListThunk", async (_, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
        // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
        // useSelector будет выдавать ошибку
        const state = getState();

        const search = state.antropologicalTypesSimpleListSchema?.search;

        // Строка параметров фильтров
        const filtersSearchParams = new URLSearchParams();

        // Отправляем запрос
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/antropological-types?search=${search}${filtersSearchParams.toString() !== "" ? `&${filtersSearchParams.toString()}` : ""}`,
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
