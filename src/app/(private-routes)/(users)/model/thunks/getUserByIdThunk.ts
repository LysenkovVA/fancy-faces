"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { ThunkConfig } from "@/app/lib/store";
import { UserEntity } from "../types/UserEntity";

export interface GetUserByIdThunkProps {
    id: string;
}

export const getUserByIdThunk = createAsyncThunk<
    ResponseData<UserEntity | undefined>,
    GetUserByIdThunkProps,
    ThunkConfig<string>
>("getUserByIdThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/users/${props.id}`,
            { method: "GET" },
        );

        const data = (await response.json()) as ResponseData<
            UserEntity | undefined
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
