"use client";

import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import { Form, Skeleton } from "antd";
import { memo } from "react";
import imagePng from "../../../../lib/assets/png/initiator.png";
import { InitiatorEntity } from "../../model/types/InitiatorEntity";
import { InitiatorsDropDownList } from "@/app/(private-routes)/(initiators)/ui/InitiatorsDropDownList/InitiatorsDropDownList";

export interface FormItemInitiatorDropDownProps {
    labelText?: string;
    namePath: string[];
    required?: boolean;
    requiredMessage?: string;
    isLoading: boolean;
    placeholder?: string;
    noStyle?: boolean;
    mode: "single" | "multiple";
    initialNewEntityData?: InitiatorEntity;
}

export const FormItemInitiatorDropDown = memo(
    (props: FormItemInitiatorDropDownProps) => {
        const {
            labelText = "Инициатор",
            namePath,
            required = false,
            requiredMessage = undefined,
            isLoading = false,
            placeholder = "Укажите инициатора",
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
                    <InitiatorsDropDownList
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
