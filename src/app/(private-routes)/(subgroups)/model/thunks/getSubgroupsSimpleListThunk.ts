"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubgroupEntity } from "../types/SubgroupEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetSubgroupsSimpleListThunkProps {
    replaceData?: boolean;
}

export const getSubgroupsSimpleListThunk = createAsyncThunk<
    ResponseData<SubgroupEntity[] | undefined>,
    GetSubgroupsSimpleListThunkProps,
    ThunkConfig<string>
>("getSubgroupsSimpleListThunk", async (props, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
        // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
        // useSelector будет выдавать ошибку
        const state = getState();

        const search = state.subgroupsSimpleListSchema?.search;
        const filters = state.subgroupsSimpleListSchema?.filters;

        // Строка параметров фильтров
        const filtersSearchParams = new URLSearchParams();

        // Добавление
        filters?.["antropological-type"]?.map((id) => {
            filtersSearchParams.append("antropological-type", id);
        });

        // Отправляем запрос
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/subgroups?search=${search}${filtersSearchParams.toString() !== "" ? `&${filtersSearchParams.toString()}` : ""}`,
            { method: "GET" },
        );

        const data = (await response.json()) as ResponseData<
            SubgroupEntity[] | undefined
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
