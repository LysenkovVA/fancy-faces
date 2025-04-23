"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { SubgroupEntity } from "../../model/types/SubgroupEntity";
import {
    DynamicModuleLoader,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import {
    getSubgroupsSimpleList,
    getSubgroupsSimpleListError,
    getSubgroupsSimpleListIsInitialized,
    getSubgroupsSimpleListIsLoading,
} from "../../model/selectors/subgroupsSimpleListSelectors";
import { Form, Modal, Typography } from "antd";
import { getSubgroupsSimpleListThunk } from "../../model/thunks/getSubgroupsSimpleListThunk";
import { DropDownList, DropDownOption } from "@/app/UI/DropDownList";

import { SubgroupForm } from "../SubgroupForm/SubgroupForm";
import {
    FORM_ICON_SIZE,
    MODAL_TITLE_MARGIN_BOTTOM,
    MODAL_WIDTH,
} from "@/app/UI/AppLayout/config/consts";
import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import subgroupPng from "../../../../lib/assets/png/subgroup.png";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import { subgroupsSimpleListReducer } from "../../model/slices/subgroupsSimpleListSlice";

export interface SubgroupsDropDownListProps {
    placeholder?: string;
    value?: SubgroupEntity | SubgroupEntity[];
    onChange?: (value?: SubgroupEntity | SubgroupEntity[]) => void;
    mode?: "single" | "multiple";
    initialNewEntityData?: SubgroupEntity;
}

export const SubgroupsDropDownList = memo(
    (props: SubgroupsDropDownListProps) => {
        const { placeholder, value, onChange, mode, initialNewEntityData } =
            props;

        const dispatch = useAppDispatch();
        const data = useAppSelector(getSubgroupsSimpleList.selectAll);
        const isLoading = useAppSelector(getSubgroupsSimpleListIsLoading);
        const error = useAppSelector(getSubgroupsSimpleListError);
        const isInitialized = useAppSelector(
            getSubgroupsSimpleListIsInitialized,
        );

        const [isModalOpen, setIsModalOpen] = useState(false);
        // Признак того, что модалка открывается для создания новой записи
        const [isModalCreate, setIsModalCreate] = useState(false);

        const [editableValue, setEditableValue] = useState<
            SubgroupEntity | undefined
        >(undefined);

        const [form] = Form.useForm();

        useInitialEffect(() => {
            if (!isInitialized) {
                dispatch(
                    getSubgroupsSimpleListThunk({
                        replaceData: true,
                    }),
                );
            }
        });

        // Список значений
        const options = useMemo(() => {
            return data.map((value: SubgroupEntity): DropDownOption => {
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
                    const changedValues: Array<SubgroupEntity> = [];

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

        return (
            <DynamicModuleLoader
                reducers={{
                    subgroupsSimpleListSchema: subgroupsSimpleListReducer,
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
                <Modal
                    title={
                        <LabelWithIcon
                            textStyle={{
                                marginBottom: MODAL_TITLE_MARGIN_BOTTOM,
                            }}
                            imageSrc={subgroupPng.src}
                            labelText={
                                isModalCreate ? "Новая подгруппа" : "Подгруппа"
                            }
                            iconSize={FORM_ICON_SIZE}
                        />
                    }
                    okType={"primary"}
                    okText={"Сохранить"}
                    cancelText={"Отмена"}
                    onOk={() => form.submit()}
                    onCancel={() => setIsModalOpen(false)}
                    onClose={() => setIsModalOpen(false)}
                    destroyOnClose
                    open={isModalOpen}
                    styles={{
                        body: {
                            maxHeight: "calc(100vh * 0.5)",
                            overflowY: "auto",
                        },
                    }}
                    width={MODAL_WIDTH}
                >
                    <SubgroupForm
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
                </Modal>
            </DynamicModuleLoader>
        );
    },
);
