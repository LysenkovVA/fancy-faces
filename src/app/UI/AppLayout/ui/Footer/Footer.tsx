"use client";

import React, { memo } from "react";
import { Flex } from "antd";
import { FOOTER_HEIGHT, FOOTER_WIDTH } from "@/app/UI/AppLayout/config/consts";
import {
    PRIMARY_COLOR,
    PRIMARY_VARIANT_COLOR,
} from "@/app/lib/themes/primary-theme";
import { Version } from "@/app/UI/Version";

export const Footer = memo(() => {
    return (
        <Flex
            style={{
                width: FOOTER_WIDTH,
                height: FOOTER_HEIGHT,
                border: `1px solid ${PRIMARY_VARIANT_COLOR}`,
                borderRadius: "16px 16px 0 0",
                background: PRIMARY_COLOR,
            }}
            align={"center"}
            justify={"center"}
            vertical
            gap={8}
        >
            {/*<Typography.Text style={{ color: ON_PRIMARY_COLOR }}>*/}
            {/*    {`V lab. © ${new Date(Date.now()).getFullYear()}`}*/}
            {/*</Typography.Text>*/}
            <Version />
        </Flex>
    );
});
