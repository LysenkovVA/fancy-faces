"use client";

import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import { Form, Skeleton } from "antd";
import { memo } from "react";
import { ViewTypeEntity } from "../../model/types/ViewTypeEntity";
import { ViewTypesDropDownList } from "../ViewTypesDropDownList/ViewTypesDropDownList";

export interface FormItemViewTypeDropDown {
    labelText?: string;
    namePath: string[];
    required?: boolean;
    requiredMessage?: string;
    isLoading: boolean;
    placeholder?: string;
    noStyle?: boolean;
    mode: "single" | "multiple";
    initialNewEntityData?: ViewTypeEntity;
}

export const FormItemViewTypeDropDown = memo(
    (props: FormItemViewTypeDropDown) => {
        const {
            labelText = "Вид",
            namePath,
            required = false,
            requiredMessage = undefined,
            isLoading = false,
            placeholder = "Укажите вид",
            noStyle = undefined,
            mode,
            initialNewEntityData,
        } = props;
        return (
            <Form.Item
                noStyle={noStyle}
                label={
                    <LabelWithIcon
                        // imageSrc={imagePng.src}
                        labelText={labelText}
                        iconSize={FORM_ICON_SIZE}
                    />
                }
                name={namePath}
                rules={[{ required: required, message: requiredMessage }]}
            >
                {!isLoading ? (
                    <ViewTypesDropDownList
                        mode={mode}
                        placeholder={placeholder}
                        initialNewEntityData={initialNewEntityData}
                    />
                ) : (
                    <Skeleton.Input active block />
                )}
            </Form.Item>
        );
    },
);
