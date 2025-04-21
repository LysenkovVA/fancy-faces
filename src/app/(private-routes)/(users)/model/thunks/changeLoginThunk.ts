"use client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";

import { ThunkConfig } from "@/app/lib/store";

export interface ChangeLoginThunkProps {
    userId: string;
    data: { newLogin: string };
}

export const changeLoginThunk = createAsyncThunk<
    ResponseData<boolean | undefined>,
    ChangeLoginThunkProps,
    ThunkConfig<string>
>("changeLoginThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const formData = new FormData();

        // Идентификтор сущности
        if (props.data) {
            formData.append("data", JSON.stringify(props.data));
        }
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/users/${props.userId}/change-login`,
            {
                method: "POST",
                body: formData,
            },
        );

        const result = (await response.json()) as ResponseData<
            boolean | undefined
        >;

        if (!result.isOk) {
            return rejectWithValue(ResponseData.getAllErrors(result));
        }

        return result;
    } catch (error) {
        // Неизвестная ошибка в thunk-е
        return rejectWithValue(ResponseData.Error(error).getAllErrors());
    }
});
