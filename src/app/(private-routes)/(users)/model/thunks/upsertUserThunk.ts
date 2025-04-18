"use client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";

import { ThunkConfig } from "@/app/lib/store";
import { UserEntity } from "../types/UserEntity";

export interface UpsertUserThunkProps {
    formId: string;
    entityId?: string;
    entityData: UserEntity;
}

export const upsertUserThunk = createAsyncThunk<
    ResponseData<UserEntity | undefined>,
    UpsertUserThunkProps,
    ThunkConfig<string>
>("upsertUserThunk", async (props, thunkApi) => {
    const { rejectWithValue } = thunkApi;

    try {
        const formData = new FormData();

        // Идентификтор сущности
        if (props.entityId) {
            formData.append("entity-id", props.entityId);
        }
        // Данные сущности
        formData.append("entity-data", JSON.stringify(props.entityData));

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/users/upsert`,
            {
                method: "POST",
                body: formData,
            },
        );

        const createdEntity = (await response.json()) as ResponseData<
            UserEntity | undefined
        >;

        if (!createdEntity.isOk) {
            return rejectWithValue(ResponseData.getAllErrors(createdEntity));
        }

        return createdEntity;
    } catch (error) {
        // Неизвестная ошибка в thunk-е
        return rejectWithValue(ResponseData.Error(error).getAllErrors());
    }
});
