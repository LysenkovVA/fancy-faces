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
            {/*<Image*/}
            {/*    style={{ justifyContent: "center" }}*/}
            {/*    src={llcLogoPNG.src}*/}
            {/*    height={FOOTER_HEIGHT - FOOTER_HEIGHT / 3}*/}
            {/*    alt={"logo_llc"}*/}
            {/*    preview={false}*/}
            {/*/>*/}
            <Typography.Text style={{ color: FOREGROUND_PRIMARY_COLOR }}>
                {`${new Date(Date.now()).getFullYear()} © 5 лаборатория`}
            </Typography.Text>
        </Flex>
    );
});
