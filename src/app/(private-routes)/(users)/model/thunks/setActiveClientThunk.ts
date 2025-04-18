"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { ThunkConfig } from "@/app/lib/store";
import { UserEntity } from "../types/UserEntity";

export interface SetActiveClientThunkProps {
    id: string;
    activeClientId: string;
}

export const setActiveClientThunk = createAsyncThunk<
    ResponseData<UserEntity | undefined>,
    SetActiveClientThunkProps,
    ThunkConfig<string>
>("setActiveClientThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/users/${props.id}?active-client-id=${props.activeClientId}`,
            { method: "POST" },
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
