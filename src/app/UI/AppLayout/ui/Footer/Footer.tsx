"use client";

import React, { memo } from "react";
import { Flex, Tag, Typography } from "antd";
import { FOOTER_HEIGHT, FOOTER_WIDTH } from "@/app/UI/AppLayout/config/consts";
import { ON_PRIMARY_COLOR } from "@/app/lib/themes/primary-theme";

export const Footer = memo(() => {
    return (
        <Flex
            style={{
                width: FOOTER_WIDTH,
                height: FOOTER_HEIGHT,
            }}
            align={"center"}
            justify={"center"}
        >
            <Typography.Text style={{ color: ON_PRIMARY_COLOR }}>
                {`V lab. © ${new Date(Date.now()).getFullYear()}`}
            </Typography.Text>
            {process.env.NODE_ENV !== "production" && (
                <Tag color={"warning"}>{`${process.env.NODE_ENV} mode`}</Tag>
            )}
        </Flex>
    );
});
