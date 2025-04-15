"use client";

import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import { Form, Skeleton } from "antd";
import { memo } from "react";
import {
    GenderEntity,
    GendersDropDownList,
} from "@/app/(private-routes)/(genders)";
import imagePng from "../../../../lib/assets/png/gender.png";

export interface FormItemGenderDropDown {
    labelText?: string;
    namePath: string[];
    required?: boolean;
    requiredMessage?: string;
    isLoading: boolean;
    placeholder?: string;
    noStyle?: boolean;
    mode: "single" | "multiple";
    initialNewEntityData?: GenderEntity;
}

export const FormItemGenderDropDown = memo((props: FormItemGenderDropDown) => {
    const {
        labelText = "Пол",
        namePath,
        required = false,
        requiredMessage = undefined,
        isLoading = false,
        placeholder = "Укажите пол",
        noStyle = undefined,
        mode,
        initialNewEntityData,
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
                <GendersDropDownList
                    mode={mode}
                    placeholder={placeholder}
                    initialNewEntityData={initialNewEntityData}
                />
            ) : (
                <Skeleton.Input active block />
            )}
        </Form.Item>
    );
});
