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
import { getInitiatorByIdThunk } from "../../model/thunks/getInitiatorByIdThunk";
import { upsertInitiatorThunk } from "../../model/thunks/upsertInitiatorThunk";
import {
    getInitiatorDetailsError,
    getInitiatorDetailsFormData,
    getInitiatorDetailsIsFetching,
    getInitiatorDetailsIsInitialized,
    getInitiatorDetailsIsSaving,
} from "../../model/selectors/initiatorDetailsSelectors";
import { InitiatorEntity } from "../../model/types/InitiatorEntity";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { formItemLayout } from "@/app/UI/AppLayout/config/formItemLayout";
import { FormItemInput } from "@/app/UI/FormItemInput";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import {
    initiatorMultipleDetailsActions,
    initiatorMultipleDetailsReducer,
} from "../../model/slices/initiatorMultipleDetailsSlice";
import { v4 as uuidv4 } from "uuid";

export interface InitiatorFormProps {
    form: FormInstance;
    entityId?: string;
    initialData?: InitiatorEntity;
    onSubmitted: (data: InitiatorEntity) => void;
}

export const InitiatorForm = memo((props: InitiatorFormProps) => {
    const { form, entityId, onSubmitted, initialData } = props;

    // Идентификатор формы (используется в стейте, поскольку может возникнуть
    // ситуация, что где-то будет открываться эта форма еще раз и у нее
    // должен быть свой стейт)
    const [formId] = useState(uuidv4());

    const [notificationApi, notificationContext] = useNotification();

    const dispatch = useAppDispatch();

    const formData = useAppSelector((state: GlobalStateSchema) =>
        getInitiatorDetailsFormData(state, formId),
    );
    const error = useAppSelector((state: GlobalStateSchema) =>
        getInitiatorDetailsError(state, formId),
    );
    const isFetching = useAppSelector((state: GlobalStateSchema) =>
        getInitiatorDetailsIsFetching(state, formId),
    );
    const isSaving = useAppSelector((state: GlobalStateSchema) =>
        getInitiatorDetailsIsSaving(state, formId),
    );
    const isInitialized = useAppSelector((state: GlobalStateSchema) =>
        getInitiatorDetailsIsInitialized(state, formId),
    );

    useInitialEffect(
        () => {
            dispatch(
                initiatorMultipleDetailsActions.init({
                    formId,
                }),
            );

            if (initialData) {
                dispatch(
                    initiatorMultipleDetailsActions.setFormData({
                        formId,
                        data: initialData,
                    }),
                );
            } else {
                if (entityId) {
                    dispatch(
                        getInitiatorByIdThunk({
                            formId,
                            id: entityId,
                        }),
                    );
                }
            }

            dispatch(
                initiatorMultipleDetailsActions.setInitialized({
                    formId,
                    isInitialized: true,
                }),
            );
        },
        () => initiatorMultipleDetailsActions.unmount({ formId }),
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
            upsertInitiatorThunk({
                formId,
                entityId,
                entityData: formData!,
            }),
        ).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                const data = result.payload as ResponseData<
                    InitiatorEntity | undefined
                >;
                onSubmitted(data.data!);
            }
        });
    }, [dispatch, entityId, formData, formId, onSubmitted]);

    return (
        <DynamicModuleLoader
            reducers={{
                initiatorDetailsSchema: initiatorMultipleDetailsReducer,
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
                            initiatorMultipleDetailsActions.setFormData({
                                formId,
                                data: {
                                    ...formData,
                                    ...values,
                                },
                            }),
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
});
