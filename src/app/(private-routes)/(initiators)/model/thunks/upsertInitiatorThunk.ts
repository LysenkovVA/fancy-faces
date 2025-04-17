"use client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";

import { ThunkConfig } from "@/app/lib/store";
import { InitiatorEntity } from "../types/InitiatorEntity";

export interface UpsertInitiatorThunkProps {
    formId: string;
    entityId?: string;
    entityData: InitiatorEntity;
}

export const upsertInitiatorThunk = createAsyncThunk<
    ResponseData<InitiatorEntity | undefined>,
    UpsertInitiatorThunkProps,
    ThunkConfig<string>
>("upsertInitiatorThunk", async (props, thunkApi) => {
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
            `${process.env.NEXT_PUBLIC_API_PATH}/initiators/upsert`,
            {
                method: "POST",
                body: formData,
            },
        );

        const createdEntity = (await response.json()) as ResponseData<
            InitiatorEntity | undefined
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
