"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { PhotoEntity } from "../types/PhotoEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface GetPhotoByIdThunkProps {
    id: string;
}

export const getPhotoByIdThunk = createAsyncThunk<
    ResponseData<PhotoEntity | undefined>,
    GetPhotoByIdThunkProps,
    ThunkConfig<string>
>("getPhotoByIdThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/photos/${props.id}`,
            { method: "GET" },
        );

        const data = (await response.json()) as ResponseData<
            PhotoEntity | undefined
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
