"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { UserEntity } from "../types/UserEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface DeleteUserByIdThunkProps {
    id: string;
}

export const deleteUserByIdThunk = createAsyncThunk<
    ResponseData<UserEntity | undefined>,
    DeleteUserByIdThunkProps,
    ThunkConfig<string>
>("deleteUserByIdThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/users/${props.id}`,
            { method: "DELETE" },
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
