"use client";

import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import { Form, Skeleton } from "antd";
import { memo } from "react";
import imagePng from "../../../../lib/assets/png/subject.png";
import { SubjectEntity } from "../../model/types/SubjectEntity";
import { SubjectsDropDownList } from "@/app/(private-routes)/(subjects)/ui/SubjectsDropDownList/SubjectsDropDownList";

export interface FormItemSubjectDropDownProps {
    labelText?: string;
    namePath: string[];
    required?: boolean;
    requiredMessage?: string;
    isLoading: boolean;
    placeholder?: string;
    noStyle?: boolean;
    mode: "single" | "multiple";
    initialNewEntityData?: SubjectEntity;
}

export const FormItemSubjectDropDown = memo(
    (props: FormItemSubjectDropDownProps) => {
        const {
            labelText = "Субъект",
            namePath,
            required = false,
            requiredMessage = undefined,
            isLoading = false,
            placeholder = "Укажите субъект",
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
                    <SubjectsDropDownList
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
