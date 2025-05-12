"use client";

import { Flex, Typography } from "antd";
import React, { memo } from "react";
import { HEADER_HEIGHT } from "@/app/UI/AppLayout/config/consts";
import { logoPNG } from "@/app/lib/assets";
import { Picture } from "@/app/UI/Picture";
import { useRouter } from "next/navigation";
import { ON_PRIMARY_COLOR } from "@/app/lib/themes/primary-theme";

export const HeaderLogo = memo(() => {
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
                    fontSize: 26,
                    fontWeight: "bold",
                    color: ON_PRIMARY_COLOR,
                }}
            >
                {"Фотопортрет"}
            </Typography.Text>
        </Flex>
    );
});
