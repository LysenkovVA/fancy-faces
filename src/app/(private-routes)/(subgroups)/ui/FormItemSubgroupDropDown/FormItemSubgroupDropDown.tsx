"use client";

import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import { Form, Skeleton } from "antd";
import { memo } from "react";
import imagePng from "../../../../lib/assets/png/subgroup.png";
import { SubgroupEntity } from "../../model/types/SubgroupEntity";
import { SubgroupsDropDownList } from "@/app/(private-routes)/(subgroups)/ui/SubgroupsDropDownList/SubgroupsDropDownList";

export interface FormItemSubgroupDropDownProps {
    labelText?: string;
    namePath: string[];
    required?: boolean;
    requiredMessage?: string;
    isLoading: boolean;
    placeholder?: string;
    noStyle?: boolean;
    mode: "single" | "multiple";
    initialNewEntityData?: SubgroupEntity;
}

export const FormItemSubgroupDropDown = memo(
    (props: FormItemSubgroupDropDownProps) => {
        const {
            labelText = "Подгруппа",
            namePath,
            required = false,
            requiredMessage = undefined,
            isLoading = false,
            placeholder = "Укажите подгруппу",
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
                    <SubgroupsDropDownList
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
