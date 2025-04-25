"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { InitiatorEntity } from "../types/InitiatorEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetInitiatorsSimpleListThunkProps {
    replaceData?: boolean;
}

export const getInitiatorsSimpleListThunk = createAsyncThunk<
    ResponseData<InitiatorEntity[] | undefined>,
    GetInitiatorsSimpleListThunkProps,
    ThunkConfig<string>
>("getInitiatorsSimpleListThunk", async (props, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
        // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
        // useSelector будет выдавать ошибку
        const state = getState();

        const search = state.initiatorsSimpleListSchema?.search;

        // Строка параметров фильтров
        const filtersSearchParams = new URLSearchParams();

        // Отправляем запрос
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/initiators?search=${search}${filtersSearchParams.toString() !== "" ? `&${filtersSearchParams.toString()}` : ""}`,
            { method: "GET" },
        );

        const data = (await response.json()) as ResponseData<
            InitiatorEntity[] | undefined
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
