"use client";

import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { SubgroupEntity } from "../types/SubgroupEntity";
import { ThunkConfig } from "@/app/lib/store";

export interface DeleteSubgroupByIdThunkProps {
    id: string;
}

export const deleteSubgroupByIdThunk = createAsyncThunk<
    ResponseData<SubgroupEntity | undefined>,
    DeleteSubgroupByIdThunkProps,
    ThunkConfig<string>
>("deleteSubgroupByIdThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/subgroups/${props.id}`,
            { method: "DELETE" },
        );

        const data = (await response.json()) as ResponseData<
            SubgroupEntity | undefined
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
