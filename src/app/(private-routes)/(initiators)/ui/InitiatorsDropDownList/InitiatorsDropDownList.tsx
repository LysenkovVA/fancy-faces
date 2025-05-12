"use client";

import React, { memo, useCallback, useMemo, useState } from "react";
import { InitiatorEntity } from "../../model/types/InitiatorEntity";
import {
    DynamicModuleLoader,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import {
    getInitiatorsSimpleList,
    getInitiatorsSimpleListError,
    getInitiatorsSimpleListIsInitialized,
    getInitiatorsSimpleListIsLoading,
} from "../../model/selectors/initiatorsSimpleListSelectors";
import { App, Flex, Form, Typography } from "antd";
import { getInitiatorsSimpleListThunk } from "../../model/thunks/getInitiatorsSimpleListThunk";
import { DropDownList, DropDownOption } from "@/app/UI/DropDownList";

import { InitiatorForm } from "../InitiatorForm/InitiatorForm";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import initiatorPng from "../../../../lib/assets/png/initiator.png";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import { initiatorsSimpleListReducer } from "../../model/slices/initiatorsSimpleListSlice";
import { Picture } from "@/app/UI/Picture";
import deletePng from "@/assets/delete.png";
import { deleteInitiatorByIdThunk } from "@/app/(private-routes)/(initiators)/model/thunks/deleteInitiatorByIdThunk";
import { ModalSaveCancelDelete } from "@/app/UI/ModalSaveCancelDelete";

export interface InitiatorsDropDownListProps {
    placeholder?: string;
    value?: InitiatorEntity | InitiatorEntity[];
    onChange?: (value?: InitiatorEntity | InitiatorEntity[]) => void;
    mode?: "single" | "multiple";
    initialNewEntityData?: InitiatorEntity;
}

export const InitiatorsDropDownList = memo(
    (props: InitiatorsDropDownListProps) => {
        const { placeholder, value, onChange, mode, initialNewEntityData } =
            props;

        const dispatch = useAppDispatch();
        const data = useAppSelector(getInitiatorsSimpleList.selectAll);
        const isLoading = useAppSelector(getInitiatorsSimpleListIsLoading);
        const error = useAppSelector(getInitiatorsSimpleListError);
        const isInitialized = useAppSelector(
            getInitiatorsSimpleListIsInitialized,
        );

        const { confirm } = App.useApp().modal;

        const [isModalOpen, setIsModalOpen] = useState(false);
        // Признак того, что модалка открывается для создания новой записи
        const [isModalCreate, setIsModalCreate] = useState(false);

        const [editableValue, setEditableValue] = useState<
            InitiatorEntity | undefined
        >(undefined);

        const [form] = Form.useForm();

        useInitialEffect(() => {
            if (!isInitialized) {
                dispatch(
                    getInitiatorsSimpleListThunk({
                        replaceData: true,
                    }),
                );
            }
        });

        // Список значений
        const options = useMemo(() => {
            return data.map((value: InitiatorEntity): DropDownOption => {
                return {
                    value: value.id,
                    label: value.name,
                };
            });
        }, [data]);

        // Выбранное значение
        const selectedValue = useMemo(() => {
            if (!value) return undefined;

            if (value instanceof Array) {
                return value?.map((val) => val?.id);
            } else {
                return value?.id;
            }
        }, [value]);

        const onChangeCallback = useCallback(
            (value?: string | string[]) => {
                if (!value) {
                    onChange?.(undefined);
                }

                if (value instanceof Array) {
                    const changedValues: Array<InitiatorEntity> = [];

                    value?.map((val) => {
                        changedValues.push(
                            data?.filter((entity) => entity.id === val)?.[0],
                        );
                    });

                    if (mode === "single") {
                        onChange?.(changedValues?.[0]);
                    } else {
                        onChange?.(changedValues);
                    }
                } else {
                    const val = data.filter(
                        (entity) => entity.id === value,
                    )?.[0];

                    if (mode === "single") {
                        onChange?.(val);
                    } else {
                        onChange?.([val]);
                    }
                }
            },
            [data, mode, onChange],
        );

        const onDeleteCallback = useCallback(
            (entityId?: string) => {
                if (entityId) {
                    confirm({
                        title: (
                            <Flex align={"center"} justify={"start"} gap={4}>
                                <Typography.Text>{"Удаление"}</Typography.Text>
                            </Flex>
                        ),
                        icon: (
                            <Picture
                                shape={"picture"}
                                pictureWidth={FORM_ICON_SIZE}
                                pictureHeight={FORM_ICON_SIZE}
                                borderWidth={0}
                                borderRadius={0}
                                value={deletePng.src}
                            />
                        ),
                        content: `Удалить запись из базы данных? Эта операция необратима. Вы уверены?`,
                        okText: "Да",
                        okType: "danger",
                        cancelText: "Нет",
                        onOk() {
                            dispatch(
                                deleteInitiatorByIdThunk({ id: entityId }),
                            );
                        },
                    });
                }
            },
            [confirm, dispatch],
        );

        return (
            <DynamicModuleLoader
                reducers={{
                    initiatorsSimpleListSchema: initiatorsSimpleListReducer,
                }}
                removeAfterUnmount={false}
            >
                <DropDownList
                    placeholder={placeholder}
                    isLoading={isLoading}
                    mode={mode}
                    options={options}
                    value={selectedValue}
                    onChange={onChangeCallback}
                    onAddClick={() => {
                        setIsModalCreate(true);
                        setIsModalOpen(true);
                    }}
                    onEditClick={(value) => {
                        setEditableValue(
                            data.filter((entity) => entity.id === value)?.[0],
                        );
                        setIsModalCreate(false);
                        setIsModalOpen(true);
                    }}
                />
                {error && (
                    <Typography.Text type={"danger"}>{error}</Typography.Text>
                )}
                <ModalSaveCancelDelete
                    isOpen={isModalOpen}
                    iconSrc={initiatorPng.src}
                    title={isModalCreate ? "Новый инициатор" : "Инициатор"}
                    onOk={() => form.submit()}
                    onCancel={() => setIsModalOpen(false)}
                    onClose={() => setIsModalOpen(false)}
                    onDelete={() => {
                        onDeleteCallback(editableValue?.id);
                        setEditableValue(undefined);
                        setIsModalOpen(false);
                    }}
                >
                    <InitiatorForm
                        form={form}
                        entityId={isModalCreate ? undefined : editableValue?.id}
                        initialData={initialNewEntityData}
                        onSubmitted={(data) => {
                            if (mode === "single") {
                                onChange?.(data);
                            } else {
                                if (value && value instanceof Array) {
                                    onChange?.([...value, data]);
                                } else {
                                    onChange?.([data]);
                                }
                            }
                            setIsModalOpen(false);
                        }}
                    />
                </ModalSaveCancelDelete>
            </DynamicModuleLoader>
        );
    },
);
