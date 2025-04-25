"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { UserEntity } from "../types/UserEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetUsersSimpleListThunkProps {
    replaceData?: boolean;
}

export const getUsersSimpleListThunk = createAsyncThunk<
    ResponseData<UserEntity[] | undefined>,
    GetUsersSimpleListThunkProps,
    ThunkConfig<string>
>("getUsersSimpleListThunk", async (props, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
        // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
        // useSelector будет выдавать ошибку
        const state = getState();

        const search = state.usersSimpleListSchema?.search;

        // Строка параметров фильтров
        const filtersSearchParams = new URLSearchParams();

        // Отправляем запрос
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/users?search=${search}${filtersSearchParams.toString() !== "" ? `&${filtersSearchParams.toString()}` : ""}`,
            { method: "GET" },
        );

        const data = (await response.json()) as ResponseData<
            UserEntity[] | undefined
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
