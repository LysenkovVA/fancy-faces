"use client";

import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import { Flex, Form, Input, Skeleton } from "antd";
import { memo } from "react";
import { PRIMARY_VARIANT_COLOR } from "@/app/lib/themes/primary-theme";
import { Picture } from "@/app/UI/Picture";
import { FormItemLayout } from "antd/es/form/Form";

export interface FormItemTextAreaProps {
    imageSrc?: string;
    labelText?: string;
    namePath: string[];
    required?: boolean;
    requiredMessage?: string;
    isLoading?: boolean;
    placeholder?: string;
    noStyle?: boolean;
    rowsCount?: number;
    backgroundImageSrc?: string;
    layout?: FormItemLayout | undefined;
}

export const FormItemTextArea = memo((props: FormItemTextAreaProps) => {
    const {
        imageSrc,
        labelText,
        namePath,
        required = false,
        requiredMessage = undefined,
        isLoading = false,
        placeholder = "",
        noStyle = undefined,
        rowsCount = 3,
        backgroundImageSrc = undefined,
        layout = "horizontal",
    } = props;
    return (
        <Form.Item
            layout={layout}
            noStyle={noStyle}
            name={namePath}
            label={
                <LabelWithIcon
                    imageSrc={imageSrc}
                    labelText={labelText}
                    iconSize={FORM_ICON_SIZE}
                />
            }
            rules={[{ required: required, message: requiredMessage }]}
        >
            {!isLoading ? (
                <Flex>
                    <Input.TextArea
                        id={namePath[0]}
                        autoComplete={"off"}
                        placeholder={placeholder}
                        autoSize={{ minRows: rowsCount }}
                        style={{
                            boxShadow: `0px 1px 5px ${PRIMARY_VARIANT_COLOR}`,
                        }}
                    />
                    {backgroundImageSrc !== undefined && (
                        <Picture
                            style={{
                                position: "absolute",
                                bottom: 0,
                                right: 20,
                                opacity: 0.2,
                            }}
                            shape={"picture"}
                            borderWidth={0}
                            value={backgroundImageSrc}
                            pictureWidth={60}
                            pictureHeight={60}
                        />
                    )}
                </Flex>
            ) : (
                <Skeleton.Input
                    active
                    block
                    style={{ height: 25 * rowsCount }}
                />
            )}
        </Form.Item>
    );
});
