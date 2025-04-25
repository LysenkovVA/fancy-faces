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
    const { rejectWithValue, getState } = thunkApi;

    try {
        // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
        // useSelector будет выдавать ошибку
        const state = getState();

        const search = state.viewTypesSimpleListSchema?.search;

        // Строка параметров фильтров
        const filtersSearchParams = new URLSearchParams();

        // Отправляем запрос
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/view-types?search=${search}${filtersSearchParams.toString() !== "" ? `&${filtersSearchParams.toString()}` : ""}`,
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
