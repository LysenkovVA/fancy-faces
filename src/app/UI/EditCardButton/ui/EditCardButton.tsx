"use client";

import React, { memo } from "react";
import { Flex, Skeleton, Typography } from "antd";
import editPng from "@/app/lib/assets/png/edit.png";
import { Picture } from "@/app/UI/Picture";
import { ON_SECONDARY_COLOR } from "@/app/lib/themes/primary-theme";

export interface EditCardButtonProps {
    onClick?: () => void;
    isLoading?: boolean;
}

export const EditCardButton = memo((props: EditCardButtonProps) => {
    const { onClick, isLoading } = props;
    return (
        <Flex
            align={"center"}
            justify={"center"}
            vertical
            gap={4}
            onClick={onClick}
        >
            {!isLoading ? (
                <Picture
                    value={editPng.src}
                    shape={"picture"}
                    borderWidth={0}
                    borderRadius={0}
                    pictureWidth={16}
                    pictureHeight={16}
                />
            ) : (
                <Skeleton.Node
                    active
                    style={{
                        width: 40,
                        height: 30,
                    }}
                />
            )}
            {!isLoading ? (
                <Typography.Text
                    style={{
                        fontSize: 10,
                        color: ON_SECONDARY_COLOR,
                    }}
                >
                    {`Изменить`}
                </Typography.Text>
            ) : null}
        </Flex>
    );
});
