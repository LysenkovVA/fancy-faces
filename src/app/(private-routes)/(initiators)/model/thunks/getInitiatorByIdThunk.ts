"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { InitiatorEntity } from "../types/InitiatorEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetInitiatorByIdThunkProps {
    formId: string;
    id: string;
}

export const getInitiatorByIdThunk = createAsyncThunk<
    ResponseData<InitiatorEntity | undefined>,
    GetInitiatorByIdThunkProps,
    ThunkConfig<string>
>("getInitiatorByIdThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/initiators/${props.id}`,
            { method: "GET" },
        );

        const data = (await response.json()) as ResponseData<
            InitiatorEntity | undefined
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
