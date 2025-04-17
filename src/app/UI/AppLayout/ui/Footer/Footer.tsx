"use client";

import React, { memo } from "react";
import { Flex, Typography } from "antd";
import {
    BACKGROUND_PRIMARY_COLOR,
    FOOTER_HEIGHT,
    FOOTER_WIDTH,
    FOREGROUND_PRIMARY_COLOR,
} from "@/app/UI/AppLayout/config/consts";

export const Footer = memo(() => {
    return (
        <Flex
            style={{
                width: FOOTER_WIDTH,
                height: FOOTER_HEIGHT,
                backgroundColor: BACKGROUND_PRIMARY_COLOR,
            }}
            align={"center"}
            justify={"center"}
        >
            <Typography.Text style={{ color: FOREGROUND_PRIMARY_COLOR }}>
                {`5 лаборатория 3 отдела © ${new Date(Date.now()).getFullYear()}`}
            </Typography.Text>
        </Flex>
    );
});
