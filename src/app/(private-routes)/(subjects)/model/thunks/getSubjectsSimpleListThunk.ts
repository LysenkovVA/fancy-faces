"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubjectEntity } from "../types/SubjectEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetSubjectsSimpleListThunkProps {
    replaceData?: boolean;
}

export const getSubjectsSimpleListThunk = createAsyncThunk<
    ResponseData<SubjectEntity[] | undefined>,
    GetSubjectsSimpleListThunkProps,
    ThunkConfig<string>
>("getSubjectsSimpleListThunk", async (props, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
        // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
        // useSelector будет выдавать ошибку
        const state = getState();

        const search = state.subjectsSimpleListSchema?.search;
        const filters = state.subjectsSimpleListSchema?.filters;

        // Строка параметров фильтров
        const filtersSearchParams = new URLSearchParams();

        // Добавление
        filters?.["initiator"]?.map((id) => {
            filtersSearchParams.append("initiator", id);
        });
        filters?.["gender"]?.map((id) => {
            filtersSearchParams.append("gender", id);
        });
        filters?.["antropological-type"]?.map((id) => {
            filtersSearchParams.append("antropological-type", id);
        });
        filters?.["subgroup"]?.map((id) => {
            filtersSearchParams.append("subgroup", id);
        });
        filters?.["view-type"]?.map((id) => {
            filtersSearchParams.append("view-type", id);
        });

        // Отправляем запрос
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/subjects?search=${search}${filtersSearchParams.toString() !== "" ? `&${filtersSearchParams.toString()}` : ""}`,
            { method: "GET" },
        );

        const data = (await response.json()) as ResponseData<
            SubjectEntity[] | undefined
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
