"use client";

import React, { memo, useCallback, useMemo, useState } from "react";
import { AntropologicalTypeEntity } from "../../model/types/AntropologicalTypeEntity";
import {
    DynamicModuleLoader,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import {
    getAntropologicalTypesSimpleList,
    getAntropologicalTypesSimpleListError,
    getAntropologicalTypesSimpleListIsInitialized,
    getAntropologicalTypesSimpleListIsLoading,
} from "../../model/selectors/antropologicalTypesSimpleListSelectors";
import { App, Flex, Form, Typography } from "antd";
import { getAntropologicalTypesSimpleListThunk } from "../../model/thunks/getAntropologicalTypesSimpleListThunk";
import { DropDownList, DropDownOption } from "@/app/UI/DropDownList";
import { antropologicalTypesSimpleListReducer } from "../../model/slices/antropologicalTypesSimpleListSlice";
import { AntropologicalTypeForm } from "@/app/(private-routes)/(antropological-types)/ui/AntropologicalTypeForm/AntropologicalTypeForm";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import antropologicalTypePng from "../../../../lib/assets/png/antropologicType.png";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import { Picture } from "@/app/UI/Picture";
import deletePng from "@/assets/delete.png";
import { deleteAntropologicalTypeByIdThunk } from "@/app/(private-routes)/(antropological-types)/model/thunks/deleteAntropologicalTypeByIdThunk";
import { ModalSaveCancelDelete } from "@/app/UI/ModalSaveCancelDelete";

export interface AntropologicalTypesDropDownListProps {
    placeholder?: string;
    value?: AntropologicalTypeEntity | AntropologicalTypeEntity[];
    onChange?: (
        value?: AntropologicalTypeEntity | AntropologicalTypeEntity[],
    ) => void;
    mode?: "single" | "multiple";
    initialNewEntityData?: AntropologicalTypeEntity;
}

export const AntropologicalTypesDropDownList = memo(
    (props: AntropologicalTypesDropDownListProps) => {
        const { placeholder, value, onChange, mode, initialNewEntityData } =
            props;

        const dispatch = useAppDispatch();
        const data = useAppSelector(getAntropologicalTypesSimpleList.selectAll);
        const isLoading = useAppSelector(
            getAntropologicalTypesSimpleListIsLoading,
        );
        const error = useAppSelector(getAntropologicalTypesSimpleListError);
        const isInitialized = useAppSelector(
            getAntropologicalTypesSimpleListIsInitialized,
        );

        const { confirm } = App.useApp().modal;

        const [isModalOpen, setIsModalOpen] = useState(false);
        // Признак того, что модалка открывается для создания новой записи
        const [isModalCreate, setIsModalCreate] = useState(false);

        const [editableValue, setEditableValue] = useState<
            AntropologicalTypeEntity | undefined
        >(undefined);

        const [form] = Form.useForm();

        useInitialEffect(() => {
            if (!isInitialized) {
                dispatch(
                    getAntropologicalTypesSimpleListThunk({
                        replaceData: true,
                    }),
                );
            }
        });

        // Список значений
        const options = useMemo(() => {
            return data.map(
                (value: AntropologicalTypeEntity): DropDownOption => {
                    return {
                        value: value.id,
                        label: value.name,
                    };
                },
            );
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
                    const changedValues: Array<AntropologicalTypeEntity> = [];

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
                                deleteAntropologicalTypeByIdThunk({
                                    id: entityId,
                                }),
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
                    antropologicalTypesSimpleListSchema:
                        antropologicalTypesSimpleListReducer,
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
                    iconSrc={antropologicalTypePng.src}
                    title={
                        isModalCreate
                            ? "Новый антропологический тип"
                            : "Антропологический тип"
                    }
                    onOk={() => form.submit()}
                    onCancel={() => setIsModalOpen(false)}
                    onClose={() => setIsModalOpen(false)}
                    onDelete={() => {
                        onDeleteCallback(editableValue?.id);
                        setEditableValue(undefined);
                        setIsModalOpen(false);
                    }}
                >
                    <AntropologicalTypeForm
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
