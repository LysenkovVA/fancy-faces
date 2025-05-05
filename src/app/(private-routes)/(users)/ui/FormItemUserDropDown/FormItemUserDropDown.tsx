"use client";

import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import { Form, Skeleton } from "antd";
import { memo } from "react";
import { UserEntity } from "@/app/(private-routes)/(users)";
import imagePng from "../../../../lib/assets/png/user.png";
import { UsersDropDownList } from "@/app/(private-routes)/(users)/ui/UsersDropDownList/UsersDropDownList";

export interface FormItemUserDropDown {
    labelText?: string;
    namePath: string[];
    required?: boolean;
    requiredMessage?: string;
    isLoading: boolean;
    placeholder?: string;
    noStyle?: boolean;
    mode: "single" | "multiple";
    initialNewEntityData?: UserEntity;
}

export const FormItemUserDropDown = memo((props: FormItemUserDropDown) => {
    const {
        labelText = "Специалист",
        namePath,
        required = false,
        requiredMessage = undefined,
        isLoading = false,
        placeholder = "Укажите специалиста",
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
                <UsersDropDownList
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
