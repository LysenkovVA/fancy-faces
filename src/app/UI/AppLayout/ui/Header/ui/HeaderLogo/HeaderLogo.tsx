"use client";

import { Flex, Typography } from "antd";
import React, { memo } from "react";
import {
    FOREGROUND_PRIMARY_COLOR,
    HEADER_HEIGHT,
} from "@/app/UI/AppLayout/config/consts";
import { logoPNG } from "@/app/lib/assets";
import { Picture } from "@/app/UI/Picture";
import { useRouter } from "next/navigation";

export interface HeaderLogoProps {}

export const HeaderLogo = memo((props: HeaderLogoProps) => {
    const router = useRouter();
    return (
        <Flex
            style={{
                marginLeft: 16,
                // width: 250,
                height: HEADER_HEIGHT,
                cursor: "pointer",
            }}
            align={"center"}
            justify={"center"}
            gap={8}
            onClick={() => router.push("/subjects")}
        >
            <Picture
                value={logoPNG.src}
                pictureHeight={HEADER_HEIGHT - 20}
                shape={"picture"}
                borderWidth={0}
            />
            <Typography.Text
                style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: FOREGROUND_PRIMARY_COLOR,
                }}
            >
                {"FancyFaces App"}
            </Typography.Text>
        </Flex>
    );
});
