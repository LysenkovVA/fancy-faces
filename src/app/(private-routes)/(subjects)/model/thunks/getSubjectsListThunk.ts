"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubjectEntity } from "../types/SubjectEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetSubjectsListThunkProps {
    replaceData?: boolean;
}

export const getSubjectsListThunk = createAsyncThunk<
    ResponseData<SubjectEntity[] | undefined>,
    GetSubjectsListThunkProps,
    ThunkConfig<string>
>("getSubjectsListThunk", async (props, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
        // БРАТЬ ЗНАЧЕНИЯ ИЗ СТЕЙТА НУЖНО ТОЛЬКО ТАК
        // useSelector будет выдавать ошибку
        const state = getState();

        const take = state.subjectsListSchema?.take;
        const skip = state.subjectsListSchema?.skip;
        const search = state.subjectsListSchema?.search;
        const filters = state.subjectsListSchema?.filters;

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

        if (take === undefined) {
            return rejectWithValue(`Параметр take не определен`);
        }

        if (skip === undefined) {
            return rejectWithValue(`Параметр skip не определен`);
        }

        // Отправляем запрос
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/subjects?&skip=${skip}&take=${take}&search=${search}${filtersSearchParams.toString() !== "" ? `&${filtersSearchParams.toString()}` : ""}`,
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
