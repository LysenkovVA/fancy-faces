"use client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserEntity } from "@/app/(private-routes)/(users)";
import { ThunkConfig } from "@/app/lib/store/model/store";
import { getSessionUser } from "@/app/(private-routes)/(users)/api/users/[id]/actions/getSessionUser";
import { ResponseData } from "@/app/lib/responses/ResponseData";

export const initAuthDataThunk = createAsyncThunk<
    UserEntity | undefined,
    void,
    ThunkConfig<string>
>("initAuthDataThunk", async (_, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        return await getSessionUser();
    } catch (error) {
        // Неизвестная ошибка в thunk-е
        return rejectWithValue(ResponseData.Error(error).getAllErrors());
    }
});
