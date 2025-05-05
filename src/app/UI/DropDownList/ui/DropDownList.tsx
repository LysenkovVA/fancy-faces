"use client";

import React, { memo } from "react";
import { Button, Flex, Select, SelectProps, Space, Tag } from "antd";
import { EditOutlined } from "@ant-design/icons";
import {
    BACKGROUND_COLOR,
    PRIMARY_VARIANT_COLOR,
} from "@/app/lib/themes/primary-theme";
import plusPng from "@/app/lib/assets/png/plus.png";
import editPng from "@/app/lib/assets/png/edit.png";
import { Picture } from "@/app/UI/Picture";

export type DropDownOption = {
    value: string; // Идентификатор
    label: string; // То, что показано пользователю
};

export interface DropDownListProps {
    placeholder?: string;
    mode?: "single" | "multiple";
    maxMultipleCount?: number;
    showSearch?: boolean;
    options: DropDownOption[];
    value?: string | string[];
    isLoading?: boolean;
    onChange?: (value?: string | string[]) => void;
    onAddClick?: () => void;
    onEditClick?: (value?: string) => void;
    onDeleteClick?: (value?: string) => void;
}

type TagRender = SelectProps["tagRender"];

export const DropDownList = memo((props: DropDownListProps) => {
    const {
        placeholder,
        mode = "single",
        maxMultipleCount = undefined,
        showSearch = true,
        options,
        value,
        isLoading,
        onChange,
        onAddClick,
        onEditClick,
        onDeleteClick,
    } = props;

    const tagRender: TagRender = (props) => {
        const { label, value, closable, onClose } = props;
        const onPreventMouseDown = (
            event: React.MouseEvent<HTMLSpanElement>,
        ) => {
            event.preventDefault();
            event.stopPropagation();
        };
        return (
            <Tag
                onMouseDown={onPreventMouseDown}
                closable={closable}
                onClose={onClose}
                style={{ marginInlineEnd: 4 }}
            >
                <Space size={"small"}>
                    {label}
                    <EditOutlined
                        style={{ cursor: "pointer" }}
                        onClick={() => onEditClick?.(value)}
                    />
                </Space>
            </Tag>
        );
    };

    return (
        <Flex
            style={{ width: "100%" }}
            align={"center"}
            justify={"center"}
            gap={4}
        >
            <Select
                disabled={isLoading}
                style={{
                    width: "100%",
                    textAlign: "start",
                    background: BACKGROUND_COLOR,
                    borderRadius: 8,
                    boxShadow: `0px 1px 5px ${PRIMARY_VARIANT_COLOR}`,
                }}
                placeholder={placeholder}
                mode={mode === "single" ? undefined : "multiple"}
                tagRender={tagRender}
                maxCount={mode === "single" ? undefined : maxMultipleCount}
                showSearch={showSearch}
                allowClear
                options={options}
                optionFilterProp={"label"}
                value={value}
                onChange={(value) => {
                    onChange?.(value);
                }}
            />
            {mode === "single" && onEditClick && (
                <Button
                    disabled={value === undefined}
                    icon={
                        <Picture
                            value={editPng.src}
                            shape={"picture"}
                            borderWidth={0}
                            borderRadius={0}
                            pictureWidth={20}
                            pictureHeight={20}
                        />
                    }
                    onClick={() => {
                        if (typeof value === "string") {
                            onEditClick(value);
                        }
                    }}
                />
            )}
            {onAddClick && (
                <Button
                    type={"primary"}
                    icon={
                        <Picture
                            value={plusPng.src}
                            shape={"picture"}
                            borderWidth={0}
                            borderRadius={0}
                            pictureWidth={20}
                            pictureHeight={20}
                        />
                    }
                    onClick={onAddClick}
                />
            )}
        </Flex>
    );
});
