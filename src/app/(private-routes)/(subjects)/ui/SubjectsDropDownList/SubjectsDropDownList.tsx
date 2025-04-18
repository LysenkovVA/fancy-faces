"use client";

import { memo, useCallback, useMemo, useState } from "react";
import { SubjectEntity } from "../../model/types/SubjectEntity";
import {
    DynamicModuleLoader,
    useAppDispatch,
    useAppSelector,
} from "@/app/lib/store";
import {
    getSubjectsSimpleList,
    getSubjectsSimpleListError,
    getSubjectsSimpleListIsInitialized,
    getSubjectsSimpleListIsLoading,
} from "../../model/selectors/subjectsSimpleListSelectors";
import { Form, Modal, Typography } from "antd";
import { getSubjectsSimpleListThunk } from "../../model/thunks/getSubjectsSimpleListThunk";
import { DropDownList, DropDownOption } from "@/app/UI/DropDownList";

import { SubjectForm } from "@/app/(private-routes)/(subjects)/ui/SubjectForm/SubjectForm";
import {
    FORM_ICON_SIZE,
    MODAL_TITLE_MARGIN_BOTTOM,
    MODAL_WIDTH,
} from "@/app/UI/AppLayout/config/consts";
import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import subjectPng from "../../../../lib/assets/png/subject.png";
import { useInitialEffect } from "@/app/lib/hooks/useInitialEffect";
import { subjectsSimpleListReducer } from "../../model/slices/subjectsSimpleListSlice";

export interface SubjectsDropDownListProps {
    placeholder?: string;
    value?: SubjectEntity | SubjectEntity[];
    onChange?: (value?: SubjectEntity | SubjectEntity[]) => void;
    mode?: "single" | "multiple";
    initialNewEntityData?: SubjectEntity;
}

export const SubjectsDropDownList = memo((props: SubjectsDropDownListProps) => {
    const { placeholder, value, onChange, mode, initialNewEntityData } = props;

    const dispatch = useAppDispatch();
    const data = useAppSelector(getSubjectsSimpleList.selectAll);
    const isLoading = useAppSelector(getSubjectsSimpleListIsLoading);
    const error = useAppSelector(getSubjectsSimpleListError);
    const isInitialized = useAppSelector(getSubjectsSimpleListIsInitialized);

    const [isModalOpen, setIsModalOpen] = useState(false);
    // Признак того, что модалка открывается для создания новой записи
    const [isModalCreate, setIsModalCreate] = useState(false);

    const [editableValue, setEditableValue] = useState<
        SubjectEntity | undefined
    >(undefined);

    const [form] = Form.useForm();

    useInitialEffect(() => {
        if (!isInitialized) {
            dispatch(
                getSubjectsSimpleListThunk({
                    replaceData: true,
                }),
            );
        }
    });

    // Список значений
    const options = useMemo(() => {
        return data.map((value: SubjectEntity): DropDownOption => {
            return {
                value: value.id,
                label: value.name!,
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
                const changedValues: Array<SubjectEntity> = [];

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
                const val = data.filter((entity) => entity.id === value)?.[0];

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
                subjectsSimpleListSchema: subjectsSimpleListReducer,
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
                        style={{
                            marginBottom: MODAL_TITLE_MARGIN_BOTTOM,
                        }}
                        imageSrc={subjectPng.src}
                        labelText={isModalCreate ? "Новый субъект" : "Субъект"}
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
                <SubjectForm
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
});
