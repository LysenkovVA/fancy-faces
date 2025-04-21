"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { UserEntity } from "../types/UserEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetUsersListThunkProps {
    replaceData?: boolean;
}

export const getUsersListThunk = createAsyncThunk<
    ResponseData<UserEntity[] | undefined>,
    GetUsersListThunkProps,
    ThunkConfig<string>
>("getUsersListThunk", async (props, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
        // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
        // useSelector будет выдавать ошибку
        const state = getState();

        const take = state.usersListSchema?.take;
        const skip = state.usersListSchema?.skip;
        const search = state.usersListSchema?.search;
        const filters = state.usersListSchema?.filters;

        // Строка параметров фильтров
        const filtersSearchParams = new URLSearchParams();

        if (take === undefined) {
            return rejectWithValue(`Параметр take не определен`);
        }

        if (skip === undefined) {
            return rejectWithValue(`Параметр skip не определен`);
        }

        // Отправляем запрос
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/users?&skip=${skip}&take=${take}&search=${search}${filtersSearchParams.toString() !== "" ? `&${filtersSearchParams.toString()}` : ""}`,
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
