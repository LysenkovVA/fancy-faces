"use client";

import { LabelWithIcon } from "@/app/UI/LabelWithIcon";
import { FORM_ICON_SIZE } from "@/app/UI/AppLayout/config/consts";
import { DatePicker, Form, Skeleton } from "antd";
import { memo } from "react";
import dayjs from "dayjs";
import ru_RU from "antd/lib/locale/ru_RU";
import imagePng from "../../../lib/assets/png/calendar.png";
import { PRIMARY_VARIANT_COLOR } from "@/app/lib/themes/primary-theme";

export interface FormItemDatePickerProps {
    imageSrc?: string;
    labelText: string;
    namePath: string[];
    required?: boolean;
    requiredMessage?: string;
    isLoading: boolean;
    placeholder: string;
    noStyle?: boolean;
}

export const FormItemDatePicker = memo((props: FormItemDatePickerProps) => {
    const {
        imageSrc = imagePng.src,
        labelText,
        namePath,
        required = false,
        requiredMessage = undefined,
        isLoading = false,
        placeholder = "",
        noStyle = undefined,
    } = props;
    return (
        <Form.Item
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
            getValueProps={(value) => ({
                value: value && dayjs(value),
            })}
            normalize={(value) => value && `${dayjs(value).toISOString()}`}
        >
            {!isLoading ? (
                <DatePicker
                    id={namePath[0]}
                    autoComplete={"off"}
                    placeholder={placeholder}
                    format={"DD.MM.YYYY"}
                    locale={ru_RU.DatePicker}
                    style={{
                        width: "100%",
                        boxShadow: `0px 1px 5px ${PRIMARY_VARIANT_COLOR}`,
                    }}
                />
            ) : (
                <Skeleton.Input active block />
            )}
        </Form.Item>
    );
});
