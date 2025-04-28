"use client";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseData } from "@/app/lib/responses/ResponseData";

import { ThunkConfig } from "@/app/lib/store";
import { SubjectEntity } from "../types/SubjectEntity";

export interface UpsertSubjectThunkProps {
    formId: string;
    entityId?: string;
    entityData: SubjectEntity;
}

export const upsertSubjectThunk = createAsyncThunk<
    ResponseData<SubjectEntity | undefined>,
    UpsertSubjectThunkProps,
    ThunkConfig<string>
>("upsertSubjectThunk", async (props, thunkApi) => {
    const { rejectWithValue, getState } = thunkApi;

    try {
        const state = getState();

        const removedImages = state.subjectDetailsSchema?.details[
            props.formId
        ].entityData?.photos?.filter(
            (entity) =>
                !props.entityData.photos?.some(
                    (sameEntity) => sameEntity.id === entity.id,
                ),
        );

        const removedImagesIds = removedImages?.map((img) => img.id);

        const formData = new FormData();

        // Идентификтор сущности
        if (props.entityId) {
            formData.append("entity-id", props.entityId);
        }
        // Данные сущности
        formData.append(
            "entity-data",
            JSON.stringify({
                ...props.entityData,
                photosIdsToDelete: removedImagesIds,
            }),
        );

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_PATH}/subjects/upsert`,
            {
                method: "POST",
                body: formData,
                headers: {
                    encoding: `multipart/form-data`,
                },
            },
        );

        const createdEntity = (await response.json()) as ResponseData<
            SubjectEntity | undefined
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
