"use client";

import React, { memo } from "react";
import { Flex } from "antd";
import {
    BACKGROUND_PRIMARY_COLOR,
    HEADER_HEIGHT,
} from "@/app/UI/AppLayout/config/consts";
import { HeaderLogo } from "@/app/UI/AppLayout/ui/Header/ui/HeaderLogo/HeaderLogo";

export interface HeaderProps {}

export const Header = memo((props: HeaderProps) => {
    return (
        <Flex
            style={{
                backgroundColor: BACKGROUND_PRIMARY_COLOR,
                height: HEADER_HEIGHT,
                width: `100%`,
            }}
            align={"center"}
            justify={"start"}
        >
            <HeaderLogo />
        </Flex>
    );
});
