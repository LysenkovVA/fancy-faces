"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { AntropologicalTypeEntity } from "../types/AntropologicalTypeEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface DeleteAntropologicalTypeByIdThunkProps {
    id: string;
}

export const deleteAntropologicalTypeByIdThunk = createAsyncThunk<
    ResponseData<AntropologicalTypeEntity | undefined>,
    DeleteAntropologicalTypeByIdThunkProps,
    ThunkConfig<string>
>("deleteAntropologicalTypeByIdThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/antropological-types/${props.id}`,
            { method: "DELETE" },
        );

        const data = (await response.json()) as ResponseData<
            AntropologicalTypeEntity | undefined
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
