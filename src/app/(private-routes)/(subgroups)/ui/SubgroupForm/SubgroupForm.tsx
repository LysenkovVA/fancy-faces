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
import { getSubgroupByIdThunk } from "../../model/thunks/getSubgroupByIdThunk";
import { upsertSubgroupThunk } from "../../model/thunks/upsertSubgroupThunk";
import {
    getSubgroupDetailsError,
    getSubgroupDetailsFormData,
    getSubgroupDetailsIsFetching,
    getSubgroupDetailsIsInitialized,
    getSubgroupDetailsIsSaving,
} from "../../model/selectors/subgroupDetailsSelectors";
import { SubgroupEntity } from "../../model/types/SubgroupEntity";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { formItemLayout } from "@/app/UI/AppLayout/config/formItemLayout";
import { FormItemInput } from "@/app/UI/FormItemInput";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import {
    subgroupMultipleDetailsActions,
    subgroupMultipleDetailsReducer,
} from "../../model/slices/subgroupMultipleDetailsSlice";
import { v4 as uuidv4 } from "uuid";

export interface SubgroupFormProps {
    form: FormInstance;
    entityId?: string;
    initialData?: SubgroupEntity;
    onSubmitted: (data: SubgroupEntity) => void;
}

export const SubgroupForm = memo((props: SubgroupFormProps) => {
    const { form, entityId, onSubmitted, initialData } = props;

    // Идентификатор формы (используется в стейте, поскольку может возникнуть
    // ситуация, что где-то будет открываться эта форма еще раз и у нее
    // должен быть свой стейт)
    const [formId] = useState(uuidv4());

    const [notificationApi, notificationContext] = useNotification();

    const dispatch = useAppDispatch();

    const formData = useAppSelector((state: GlobalStateSchema) =>
        getSubgroupDetailsFormData(state, formId),
    );
    const error = useAppSelector((state: GlobalStateSchema) =>
        getSubgroupDetailsError(state, formId),
    );
    const isFetching = useAppSelector((state: GlobalStateSchema) =>
        getSubgroupDetailsIsFetching(state, formId),
    );
    const isSaving = useAppSelector((state: GlobalStateSchema) =>
        getSubgroupDetailsIsSaving(state, formId),
    );
    const isInitialized = useAppSelector((state: GlobalStateSchema) =>
        getSubgroupDetailsIsInitialized(state, formId),
    );

    useInitialEffect(
        () => {
            dispatch(
                subgroupMultipleDetailsActions.init({
                    formId,
                }),
            );

            if (initialData) {
                dispatch(
                    subgroupMultipleDetailsActions.setFormData({
                        formId,
                        data: initialData,
                    }),
                );
            } else {
                if (entityId) {
                    dispatch(
                        getSubgroupByIdThunk({
                            formId,
                            id: entityId,
                        }),
                    );
                }
            }

            dispatch(
                subgroupMultipleDetailsActions.setInitialized({
                    formId,
                    isInitialized: true,
                }),
            );
        },
        () => subgroupMultipleDetailsActions.unmount({ formId }),
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
            upsertSubgroupThunk({
                formId,
                entityId,
                entityData: formData!,
            }),
        ).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                const data = result.payload as ResponseData<
                    SubgroupEntity | undefined
                >;
                onSubmitted(data.data!);
            }
        });
    }, [dispatch, entityId, formData, formId, onSubmitted]);

    return (
        <DynamicModuleLoader
            reducers={{
                subgroupDetailsSchema: subgroupMultipleDetailsReducer,
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
                            subgroupMultipleDetailsActions.setFormData({
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
