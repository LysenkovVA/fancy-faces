"use client";

import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import { Form, Skeleton } from "antd";
import { memo } from "react";
import imagePng from "../../../../lib/assets/png/antropologicType.png";
import { AntropologicalTypeEntity } from "../../model/types/AntropologicalTypeEntity";
import { AntropologicalTypesDropDownList } from "../AntropologicalTypesDropDownList/AntropologicalTypesDropDownList";

export interface FormItemAntropologicalTypeDropDownProps {
    labelText?: string;
    namePath: string[];
    required?: boolean;
    requiredMessage?: string;
    isLoading: boolean;
    placeholder?: string;
    noStyle?: boolean;
    mode: "single" | "multiple";
    initialNewEntityData?: AntropologicalTypeEntity;
    onChange?: (
        entity?: AntropologicalTypeEntity | AntropologicalTypeEntity[],
    ) => void;
}

export const FormItemAntropologicalTypeDropDown = memo(
    (props: FormItemAntropologicalTypeDropDownProps) => {
        const {
            labelText = "Антроп-ий тип",
            namePath,
            required = false,
            requiredMessage = undefined,
            isLoading = false,
            placeholder = "Укажите антропологический тип",
            noStyle = undefined,
            mode,
            initialNewEntityData,
            onChange,
        } = props;
        return (
            <Form.Item
                noStyle={noStyle}
                label={
                    <LabelWithIcon
                        imageSrc={imagePng.src}
                        labelText={labelText}
                        iconSize={FORM_ICON_SIZE}
                    />
                }
                name={namePath}
                rules={[{ required: required, message: requiredMessage }]}
            >
                {!isLoading ? (
                    <AntropologicalTypesDropDownList
                        mode={mode}
                        placeholder={placeholder}
                        initialNewEntityData={initialNewEntityData}
                        onChange={onChange}
                    />
                ) : (
                    <Skeleton.Input active block />
                )}
            </Form.Item>
        );
    },
);
