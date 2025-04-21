"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { Divider, Flex, Form, FormInstance, Spin, Typography } from "antd";

import {
    DynamicModuleLoader,
    GlobalStateSchema,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import useNotification from "antd/es/notification/useNotification";
import { getUserByIdThunk } from "../../model/thunks/getUserByIdThunk";
import { upsertUserThunk } from "../../model/thunks/upsertUserThunk";
import {
    getUserDetailsError,
    getUserDetailsFormData,
    getUserDetailsIsFetching,
    getUserDetailsIsInitialized,
    getUserDetailsIsSaving,
} from "../../model/selectors/userDetailsSelectors";
import { UserEntity } from "../../model/types/UserEntity";
import { ResponseData } from "@/app/lib/responses/ResponseData";
import { formItemLayout } from "@/app/UI/AppLayout/config/formItemLayout";
import { FormItemInput } from "@/app/UI/FormItemInput";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import {
    userMultipleDetailsActions,
    userMultipleDetailsReducer,
} from "../../model/slices/userMultipleDetailsSlice";
import { v4 as uuidv4 } from "uuid";
import { Picture } from "@/app/UI/Picture";
import { getAuthUser } from "@/app/(public-routes)/(login)/model/selectors/authSelectors";
import { ChangePasswordButton } from "@/app/(private-routes)/(users)/ui/UserForm/ChangePasswordButton/ChangePasswordButton";
import { ChangeLoginButton } from "@/app/(private-routes)/(users)/ui/UserForm/ChangeLoginButton/ChangeLoginButton";

export interface UserFormProps {
    form: FormInstance;
    entityId?: string;
    initialData?: UserEntity;
    onSubmitted: (data: UserEntity) => void;
}

export const UserForm = memo((props: UserFormProps) => {
    const { form, entityId, onSubmitted, initialData } = props;

    const authUser = useAppSelector(getAuthUser);

    // Идентификатор формы (используется в стейте, поскольку может возникнуть
    // ситуация, что где-то будет открываться эта форма еще раз и у нее
    // должен быть свой стейт)
    const [formId] = useState(uuidv4());

    const [notificationApi, notificationContext] = useNotification();

    const dispatch = useAppDispatch();

    const formData = useAppSelector((state: GlobalStateSchema) =>
        getUserDetailsFormData(state, formId),
    );
    const error = useAppSelector((state: GlobalStateSchema) =>
        getUserDetailsError(state, formId),
    );
    const isFetching = useAppSelector((state: GlobalStateSchema) =>
        getUserDetailsIsFetching(state, formId),
    );
    const isSaving = useAppSelector((state: GlobalStateSchema) =>
        getUserDetailsIsSaving(state, formId),
    );
    const isInitialized = useAppSelector((state: GlobalStateSchema) =>
        getUserDetailsIsInitialized(state, formId),
    );

    useInitialEffect(
        () => {
            dispatch(
                userMultipleDetailsActions.init({
                    formId,
                }),
            );

            if (initialData) {
                dispatch(
                    userMultipleDetailsActions.setFormData({
                        formId,
                        data: initialData,
                    }),
                );
            } else {
                if (entityId) {
                    dispatch(
                        getUserByIdThunk({
                            formId,
                            id: entityId,
                        }),
                    );
                }
            }

            dispatch(
                userMultipleDetailsActions.setInitialized({
                    formId,
                    isInitialized: true,
                }),
            );
        },
        () => userMultipleDetailsActions.unmount({ formId }),
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
            upsertUserThunk({
                formId,
                entityId,
                entityData: formData!,
            }),
        ).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                const data = result.payload as ResponseData<
                    UserEntity | undefined
                >;
                onSubmitted(data.data!);
            }
        });
    }, [dispatch, entityId, formData, formId, onSubmitted]);

    return (
        <DynamicModuleLoader
            reducers={{
                userDetailsSchema: userMultipleDetailsReducer,
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
                            userMultipleDetailsActions.setFormData({
                                formId,
                                data: {
                                    ...formData,
                                    ...values,
                                },
                            }),
                        );
                    }}
                >
                    <Form.Item name={["avatar"]}>
                        <Picture
                            shape={"avatar"}
                            pictureWidth={150}
                            pictureHeight={150}
                            isEditable
                        />
                    </Form.Item>
                    {authUser?.userRole.name === "ADMIN" && (
                        <>
                            {/*<FormItemInput*/}
                            {/*    labelText={"Логин"}*/}
                            {/*    namePath={["login"]}*/}
                            {/*    required={true}*/}
                            {/*    requiredMessage={"Укажите логин"}*/}
                            {/*    placeholder={"Укажите логин"}*/}
                            {/*    isLoading={isFetching}*/}
                            {/*/>*/}
                            {formData?.id && (
                                <>
                                    <Form.Item label={"Логин"}>
                                        <Flex
                                            align={"center"}
                                            justify={"start"}
                                            gap={8}
                                        >
                                            <Typography.Text>
                                                {formData.login}
                                            </Typography.Text>
                                            <ChangeLoginButton
                                                userId={formData?.id}
                                            />
                                        </Flex>
                                    </Form.Item>
                                    <Form.Item label={" "}>
                                        <ChangePasswordButton
                                            userId={formData?.id}
                                        />
                                    </Form.Item>
                                </>
                            )}
                            <Divider />
                        </>
                    )}
                    <FormItemInput
                        labelText={"Фамилия"}
                        namePath={["surname"]}
                        required={true}
                        requiredMessage={"Укажите фамилию"}
                        placeholder={"Укажите фамилию"}
                        isLoading={isFetching}
                    />
                    <FormItemInput
                        labelText={"Имя"}
                        namePath={["name"]}
                        required={true}
                        requiredMessage={"Укажите имя"}
                        placeholder={"Укажите имя"}
                        isLoading={isFetching}
                    />
                    <FormItemInput
                        labelText={"Отчество"}
                        namePath={["patronymic"]}
                        required={true}
                        requiredMessage={"Укажите отчество"}
                        placeholder={"Укажите отчество"}
                        isLoading={isFetching}
                    />
                </Form>
            </Spin>
        </DynamicModuleLoader>
    );
});
