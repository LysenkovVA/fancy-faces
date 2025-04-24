"use client";

import React, { memo } from "react";
import { Flex, Typography } from "antd";
import { FOOTER_HEIGHT, FOOTER_WIDTH } from "@/app/UI/AppLayout/config/consts";
import { ON_PRIMARY_COLOR } from "@/app/lib/themes/primary-theme";
import { Version } from "@/app/UI/Version";

export const Footer = memo(() => {
    return (
        <Flex
            style={{
                width: FOOTER_WIDTH,
                height: FOOTER_HEIGHT,
            }}
            align={"center"}
            justify={"center"}
            vertical
            gap={8}
        >
            <Typography.Text style={{ color: ON_PRIMARY_COLOR }}>
                {`V lab. © ${new Date(Date.now()).getFullYear()}`}
            </Typography.Text>
            <Version />
        </Flex>
    );
});
