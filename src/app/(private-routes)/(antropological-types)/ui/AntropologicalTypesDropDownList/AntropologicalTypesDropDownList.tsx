"use client";

import { memo, useCallback, useMemo, useState } from "react";
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
import { Form, Modal, Typography } from "antd";
import { getAntropologicalTypesSimpleListThunk } from "../../model/thunks/getAntropologicalTypesSimpleListThunk";
import { DropDownList, DropDownOption } from "@/app/UI/DropDownList";
import { antropologicalTypesSimpleListReducer } from "../../model/slices/antropologicalTypesSimpleListSlice";
import { AntropologicalTypeForm } from "@/app/(private-routes)/(antropological-types)/ui/AntropologicalTypeForm/AntropologicalTypeForm";
import {
    FORM_ICON_SIZE,
    MODAL_TITLE_MARGIN_BOTTOM,
    MODAL_WIDTH,
} from "@/app/UI/AppLayout/config/consts";
import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import antropologicalTypePng from "../../../../lib/assets/png/antropologicType.png";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";

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
                <Modal
                    title={
                        <LabelWithIcon
                            textStyle={{
                                marginBottom: MODAL_TITLE_MARGIN_BOTTOM,
                            }}
                            imageSrc={antropologicalTypePng.src}
                            labelText={
                                isModalCreate
                                    ? "Новый антропологический тип"
                                    : "Антропологический тип"
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
                </Modal>
            </DynamicModuleLoader>
        );
    },
);
