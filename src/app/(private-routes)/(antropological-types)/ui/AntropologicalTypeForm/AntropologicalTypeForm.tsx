"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { Form, FormInstance, Spin } from "antd";

import {
    DynamicModuleLoader,
    GlobalStateSchema,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import useNotification from "antd/es/notification/useNotification";
import { getAntropologicalTypeByIdThunk } from "../../model/thunks/getAntropologicalTypeByIdThunk";
import { upsertAntropologicalTypeThunk } from "../../model/thunks/upsertAntropologicalTypeThunk";
import {
    getAntropologicalTypeDetailsError,
    getAntropologicalTypeDetailsFormData,
    getAntropologicalTypeDetailsIsFetching,
    getAntropologicalTypeDetailsIsInitialized,
    getAntropologicalTypeDetailsIsSaving,
} from "../../model/selectors/antropologicalTypeDetailsSelectors";
import { AntropologicalTypeEntity } from "../../model/types/AntropologicalTypeEntity";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { formItemLayout } from "@/app/UI/AppLayout/config/formItemLayout";
import { FormItemInput } from "@/app/UI/FormItemInput";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import {
    antropologicalTypeMultipleDetailsActions,
    antropologicalTypeMultipleDetailsReducer,
} from "../../model/slices/antropologicalTypeMultipleDetailsSlice";
import { v4 as uuidv4 } from "uuid";

export interface AntropologicalTypeFormProps {
    form: FormInstance;
    entityId?: string;
    initialData?: AntropologicalTypeEntity;
    onSubmitted: (data: AntropologicalTypeEntity) => void;
}

export const AntropologicalTypeForm = memo(
    (props: AntropologicalTypeFormProps) => {
        const { form, entityId, onSubmitted, initialData } = props;

        // Идентификатор формы (используется в стейте, поскольку может возникнуть
        // ситуация, что где-то будет открываться эта форма еще раз и у нее
        // должен быть свой стейт)
        const [formId] = useState(uuidv4());

        const [notificationApi, notificationContext] = useNotification();

        const dispatch = useAppDispatch();

        const formData = useAppSelector((state: GlobalStateSchema) =>
            getAntropologicalTypeDetailsFormData(state, formId),
        );
        const error = useAppSelector((state: GlobalStateSchema) =>
            getAntropologicalTypeDetailsError(state, formId),
        );
        const isFetching = useAppSelector((state: GlobalStateSchema) =>
            getAntropologicalTypeDetailsIsFetching(state, formId),
        );
        const isSaving = useAppSelector((state: GlobalStateSchema) =>
            getAntropologicalTypeDetailsIsSaving(state, formId),
        );
        const isInitialized = useAppSelector((state: GlobalStateSchema) =>
            getAntropologicalTypeDetailsIsInitialized(state, formId),
        );

        useInitialEffect(
            () => {
                dispatch(
                    antropologicalTypeMultipleDetailsActions.init({
                        formId,
                    }),
                );

                if (initialData) {
                    dispatch(
                        antropologicalTypeMultipleDetailsActions.setFormData({
                            formId,
                            data: initialData,
                        }),
                    );
                } else {
                    if (entityId) {
                        dispatch(
                            getAntropologicalTypeByIdThunk({
                                formId,
                                id: entityId,
                            }),
                        );
                    }
                }

                dispatch(
                    antropologicalTypeMultipleDetailsActions.setInitialized({
                        formId,
                        isInitialized: true,
                    }),
                );
            },
            () => antropologicalTypeMultipleDetailsActions.unmount({ formId }),
        );

        // Загрузка данных формы
        useEffect(() => {
            if (isInitialized && !isFetching && !isSaving) {
                form?.setFieldsValue(formData);
            }
        }, [dispatch, form, formData, isInitialized, isFetching, isSaving]);

        // Ошибка
        useEffect(() => {
            if (!!error) {
                notificationApi.error({ message: error });
            }
        }, [error, notificationApi]);

        const onFinish = useCallback(async () => {
            dispatch(
                upsertAntropologicalTypeThunk({
                    formId,
                    entityId,
                    entityData: formData!,
                }),
            ).then((result) => {
                if (result.meta.requestStatus === "fulfilled") {
                    const data = result.payload as ResponseData<
                        AntropologicalTypeEntity | undefined
                    >;
                    onSubmitted(data.data!);
                }
            });
        }, [dispatch, entityId, formData, formId, onSubmitted]);

        return (
            <DynamicModuleLoader
                reducers={{
                    antropologicalTypeDetailsSchema:
                        antropologicalTypeMultipleDetailsReducer,
                }}
            >
                {notificationContext}
                <Spin spinning={isSaving} tip={"Сохранение..."} size={"large"}>
                    <Form
                        id={"specialityForm"}
                        form={form}
                        {...formItemLayout}
                        disabled={isFetching || isSaving}
                        onFinish={onFinish}
                        clearOnDestroy // Чтобы очищались данные формы
                        onValuesChange={(_, values) => {
                            dispatch(
                                antropologicalTypeMultipleDetailsActions.setFormData(
                                    {
                                        formId,
                                        data: {
                                            ...formData,
                                            ...values,
                                        },
                                    },
                                ),
                            );
                        }}
                    >
                        <FormItemInput
                            labelText={"Название"}
                            namePath={["name"]}
                            required={true}
                            requiredMessage={"Укажите название"}
                            placeholder={"Укажите название"}
                            isLoading={isFetching}
                        />
                    </Form>
                </Spin>
            </DynamicModuleLoader>
        );
    },
);
