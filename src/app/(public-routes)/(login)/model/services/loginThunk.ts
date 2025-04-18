"use client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ThunkConfig } from "@/app/lib/store/model/store";
import { AuthEntity } from "@/app/(public-routes)/(login)";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { getSessionUser } from "@/app/(private-routes)/(users)/api/users/[id]/actions/getSessionUser";
import { UserEntity } from "@/app/(private-routes)/(users)";

export const loginThunk = createAsyncThunk<
    UserEntity,
    AuthEntity,
    ThunkConfig<string>
>("loginThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/login`,
            {
                method: "POST",
                body: JSON.stringify({ ...props }),
            },
        );

        if (!response.ok) {
            return rejectWithValue("Ошибка авторизации");
        }

        const user = await getSessionUser();

        if (!user) {
            return rejectWithValue("Пользователь сессии не определен");
        }

        return user;
    } catch (error) {
        // Неизвестная ошибка в thunk-е
        return rejectWithValue(ResponseData.Error(error).getAllErrors());
    }
});
